<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Vetted by AI - Manual Review Required by Senior Engineer/Manager
 */
class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test protected routes require authentication
     */
    public function test_protected_routes_require_auth()
    {
        // Try to access simulations without login
        $response = $this->getJson('/api/v1/simulations');
        $response->assertStatus(401);

        // Try to access portfolios without login
        $response = $this->getJson('/api/v1/portfolios');
        $response->assertStatus(401);

        // Try to access payments without login
        $response = $this->getJson('/api/v1/payments');
        $response->assertStatus(401);
    }

    /**
     * Test public routes are accessible
     */
    public function test_public_routes_are_accessible()
    {
        // Health check should be public
        $response = $this->getJson('/api/v1/health');
        $response->assertStatus(200);

        // Payment callback should be public
        $response = $this->postJson('/api/v1/payments/callback', [
            'order_id' => 'NON-EXISTENT',
            'transaction_status' => 'pending'
        ]);
        // Should not be 401, but maybe 404/200 depending on logic
        $this->assertNotEquals(401, $response->getStatusCode());
    }

    /**
     * Test successful authentication
     */
    public function test_user_can_access_protected_routes_with_token()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->getJson('/api/v1/simulations');

        $response->assertStatus(200);
    }
}
