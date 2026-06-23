<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Simulation;
use App\Services\AIProxyService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;
use Mockery\MockInterface;

/**
 * Vetted by AI - Manual Review Required by Senior Engineer/Manager
 */
class PortfolioApiTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->user = User::factory()->create();
    }

    /**
     * Test upload portfolio
     */
    public function test_can_upload_portfolio()
    {
        Storage::fake('local');

        $file = UploadedFile::fake()->create('document.pdf', 1000);

        $response = $this->actingAs($this->user)
            ->postJson('/api/v1/portfolios', [
                'title' => 'My SERDOS Portfolio',
                'file' => $file,
            ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
            ]);

        $this->assertDatabaseHas('portfolios', [
            'user_id' => $this->user->id,
            'title' => 'My SERDOS Portfolio',
        ]);

        Storage::disk('local')->assertExists('portfolios/' . $file->hashName());
    }

    /**
     * Test analyze portfolio (Mocking AI)
     */
    public function test_can_trigger_ai_analysis()
    {
        Storage::fake('local');
        $file = UploadedFile::fake()->create('doc.pdf', 500);
        
        $portfolio = $this->user->portfolios()->create([
            'title' => 'Test Doc',
            'file_path' => 'portfolios/test.pdf',
            'status' => 'pending',
        ]);

        // Mock AIProxyService
        $this->mock(AIProxyService::class, function (MockInterface $mock) use ($portfolio) {
            $mock->shouldReceive('analyzeSimilarity')
                ->once()
                ->with($portfolio)
                ->andReturn(true);
        });

        $response = $this->actingAs($this->user)
            ->postJson("/api/v1/portfolios/{$portfolio->id}/analyze");

        $response->assertStatus(200)
            ->assertJson(['success' => true]);
    }
}
