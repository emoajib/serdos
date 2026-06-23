<?php

namespace Tests\Feature;

use App\Models\Simulation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Vetted by AI - Manual Review Required by Senior Engineer/Manager
 */
class SimulationApiTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->artisan('migrate');
        
        $this->user = User::factory()->create();
    }

    /**
     * Test creating a simulation via API
     */
    public function test_can_create_simulation()
    {
        $response = $this->actingAs($this->user)
            ->postJson('/api/v1/simulations', [
                'nkajf' => 80.0,
                'npd' => 85.0,
                'npdd' => 90.0,
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        $this->assertDatabaseHas('simulations', [
            'user_id' => $this->user->id,
            'nkajf' => 80.0,
        ]);
    }

    /**
     * Test validation error in simulation
     */
    public function test_simulation_validation_errors()
    {
        $response = $this->actingAs($this->user)
            ->postJson('/api/v1/simulations', [
                'nkajf' => 150.0, // Invalid: exceeds 100
            ]);

        $response->assertStatus(422) // Changed to 422 for standard Laravel validation
            ->assertJson([
                'success' => false,
            ]);
    }

    /**
     * Test listing simulations
     */
    public function test_can_list_simulations()
    {
        $this->user->simulations()->create([
            'nkajf' => 70,
            'npd' => 70,
            'npdd' => 70,
            'nap' => 70,
            'status' => 'diterima',
            'status_code' => 'valid',
        ]);

        $response = $this->actingAs($this->user)
            ->getJson('/api/v1/simulations');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data');
    }
}
