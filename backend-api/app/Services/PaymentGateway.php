<?php

namespace App\Services;

use App\Events\PaymentSettled;
use App\Models\Payment;
use Illuminate\Support\Facades\Log;
use Midtrans\Config;
use Midtrans\Snap;

/**
 * Vetted by AI - Manual Review Required by Senior Engineer/Manager
 */
class PaymentGateway
{
    public function __construct()
    {
        Config::$serverKey = config('services.midtrans.server_key');
        Config::$isProduction = config('services.midtrans.is_production', false);
        Config::$isSanitized = config('services.midtrans.is_sanitized', true);
        Config::$is3ds = config('services.midtrans.is_3ds', true);
    }

    /**
     * Verify payment notification integrity
     */
    public function verifySignature(array $payload): bool
    {
        $orderId = $payload['order_id'];
        $statusCode = $payload['status_code'];
        $grossAmount = $payload['gross_amount'];
        $serverKey = config('services.midtrans.server_key');
        $input = $orderId . $statusCode . $grossAmount . $serverKey;
        $signature = hash("sha512", $input);

        return $signature === $payload['signature_key'];
    }

    /**
     * Handle Midtrans payment integration
     */
    public function initiateMidtransPayment(Payment $payment): array
    {
        try {
            $params = [
                'transaction_details' => [
                    'order_id' => $payment->transaction_id,
                    'gross_amount' => (int) $payment->amount,
                ],
                'customer_details' => [
                    'first_name' => $payment->user->name,
                    'email' => $payment->user->email,
                ],
            ];

            $snapToken = Snap::getSnapToken($params);
            $redirectUrl = Snap::getSnapUrl($params);

            Log::info('MIDTRANS_PAYMENT_INITIATED', [
                'transaction_id' => $payment->transaction_id,
                'snap_token' => $snapToken,
            ]);

            return [
                'snap_token' => $snapToken,
                'redirect_url' => $redirectUrl,
            ];
        } catch (\Exception $e) {
            Log::error('MIDTRANS_PAYMENT_ERROR', [
                'transaction_id' => $payment->transaction_id,
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }

    public function handleCallback(array $payload): bool
    {
        // Zero Trust: Always verify signature before processing
        if (!$this->verifySignature($payload)) {
            Log::error('MIDTRANS_INVALID_SIGNATURE', ['payload' => $payload]);
            return false;
        }

        $orderId = $payload['order_id'];
        $status = $payload['transaction_status'];
        
        $payment = Payment::where('transaction_id', $orderId)->first();

        if (!$payment) {
            Log::warning('MIDTRANS_CALLBACK_PAYMENT_NOT_FOUND', ['order_id' => $orderId]);
            return false;
        }

        $paymentStatus = match ($status) {
            'capture', 'settlement' => 'settled',
            'pending' => 'pending',
            'deny', 'expire', 'cancel', 'failed' => 'failed',
            default => 'pending',
        };

        $payment->update([
            'status' => $paymentStatus,
            'payload' => $payload,
        ]);

        if ($paymentStatus === 'settled') {
            PaymentSettled::dispatch($payment);
            Log::info('MIDTRANS_PAYMENT_SETTLED', ['transaction_id' => $orderId]);
        }

        return true;
    }
}
