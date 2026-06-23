<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Payment;
use App\Services\PaymentGateway;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Mockery\MockInterface;

/**
 * Vetted by AI - Manual Review Required by Senior Engineer/Manager
 */
class PaymentApiTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    /**
     * Test create payment
     */
    public function test_can_initiate_payment()
    {
        // Mock PaymentGateway
        $this->mock(PaymentGateway::class, function (MockInterface $mock) {
            $mock->shouldReceive('createSnapToken')
                ->once()
                ->andReturn('mock-snap-token-123');
        });

        $response = $this->actingAs($this->user)
            ->postJson('/api/v1/payments', [
                'amount' => 500000,
            ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'data' => [
                    'snap_token' => 'mock-snap-token-123',
                ],
            ]);

        $this->assertDatabaseHas('payments', [
            'user_id' => $this->user->id,
            'amount' => 500000,
            'status' => 'pending',
        ]);
    }

    /**
     * Test midtrans callback
     */
    public function test_can_handle_midtrans_callback()
    {
        $payment = Payment::create([
            'user_id' => $this->user->id,
            'transaction_id' => 'ORDER-123',
            'amount' => 500000,
            'status' => 'pending',
        ]);

        $callbackData = [
            'order_id' => 'ORDER-123',
            'transaction_status' => 'settlement',
            'payment_type' => 'credit_card',
            'gross_amount' => '500000.00',
        ];

        $response = $this->postJson('/api/v1/payments/callback', $callbackData);

        $response->assertStatus(200);

        $this->assertDatabaseHas('payments', [
            'transaction_id' => 'ORDER-123',
            'status' => 'settled',
        ]);
    }
}
