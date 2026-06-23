<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Services\PaymentGateway;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

/**
 * Vetted by AI - Manual Review Required by Senior Engineer/Manager
 */
class PaymentController extends Controller
{
    public function __construct(
        private PaymentGateway $gateway
    ) {}

    public function index(Request $request)
    {
        $payments = Payment::where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $payments,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:1000',
        ]);

        try {
            $payment = Payment::create([
                'user_id' => $request->user()->id,
                'transaction_id' => 'SERDOS-' . time() . '-' . rand(1000, 9999),
                'amount' => $request->amount,
                'status' => 'pending',
            ]);

            $midtransData = $this->gateway->initiateMidtransPayment($payment);

            Log::info('SERDOS_PAYMENT_CREATED', [
                'user_id' => $payment->user_id,
                'transaction_id' => $payment->transaction_id,
            ]);

            return response()->json([
                'success' => true,
                'data' => array_merge($payment->toArray(), $midtransData),
            ], 201);
        } catch (\Exception $e) {
            Log::error('SERDOS_PAYMENT_CREATE_ERROR', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to initiate payment',
            ], 400);
        }
    }

    public function show($id)
    {
        $payment = Payment::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $payment,
        ]);
    }

    public function callback(Request $request)
    {
        // Audit Trail: Log raw payload
        Log::info('MIDTRANS_CALLBACK_RECEIVED', $request->all());

        try {
            $success = $this->gateway->handleCallback($request->all());

            return response()->json([
                'success' => $success,
                'message' => $success ? 'Callback processed' : 'Callback validation failed',
            ]);
        } catch (\Exception $e) {
            Log::error('SERDOS_PAYMENT_CALLBACK_ERROR', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error processing callback',
            ], 500);
        }
    }
}
