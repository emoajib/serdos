<?php

namespace App\Services;

use App\Models\Payment;
use App\Models\User;
use Illuminate\Support\Facades\Log;

/**
 * AUTOMATED PAYMENT ENGINE v1.0
 * Vetted by AI - Manual Review Required by Senior Engineer/Manager
 */
class PaymentService
{
    /**
     * SIMULATE MIDTRANS WEBHOOK HANDLING
     */
    public function handleCallback(array $payload)
    {
        $orderId = $payload['order_id'];
        $status = $payload['transaction_status'];

        $payment = Payment::where('transaction_id', $orderId)->first();

        if ($payment) {
            if ($status === 'settlement' || $status === 'capture') {
                $payment->update(['status' => 'settled']);
                Log::info("Payment Automated Approval: " . $orderId);
            } else if ($status === 'pending') {
                $payment->update(['status' => 'pending']);
            } else {
                $payment->update(['status' => 'failed']);
            }
        }

        return true;
    }

    /**
     * GENERATE PAYMENT URL (MOCK FOR NOW)
     */
    public function createTransaction(User $user, float $amount)
    {
        $id = 'SDN-' . time() . '-' . $user->id;
        
        $payment = Payment::create([
            'user_id' => $user->id,
            'transaction_id' => $id,
            'amount' => $amount,
            'status' => 'pending'
        ]);

        return [
            'success' => true,
            'payment_url' => 'https://app.sandbox.midtrans.com/snap/v2/vtweb/' . $id,
            'transaction_id' => $id
        ];
    }
}
