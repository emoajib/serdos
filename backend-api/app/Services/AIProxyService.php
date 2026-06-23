<?php

namespace App\Services;

use App\Events\PortfolioAnalyzed;
use App\Models\Portfolio;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

/**
 * Vetted by AI - Manual Review Required by Senior Engineer/Manager
 */
class AIProxyService
{
    /**
     * Panggil AI Similarity Engine secara asynchronous
     */
    public function analyzeSimilarity(Portfolio $portfolio): void
    {
        // Update status to processing
        $portfolio->update(['status' => 'processing']);

        // Dispatch background task
        dispatch(function () use ($portfolio) {
            try {
                // Get file content from storage
                $fileContent = Storage::disk('local')->get($portfolio->file_path);
                $fileName = basename($portfolio->file_path);

                // Send request to AI Engine with file attachment
                $response = Http::attach(
                    'file', $fileContent, $fileName
                )->post(config('services.ai_engine.url') . '/analyze', [
                    'portfolio_id' => $portfolio->id,
                    'title' => $portfolio->title,
                ]);

                if ($response->successful()) {
                    $result = $response->json();
                    
                    // Update portfolio with results
                    $portfolio->update([
                        'similarity_score' => $result['score'] ?? 0,
                        'status' => 'completed',
                    ]);

                    // Emit event untuk realtime update via WebSocket
                    PortfolioAnalyzed::dispatch($portfolio);
                    
                    Log::info('AI_SIMILARITY_ANALYSIS_COMPLETED', [
                        'portfolio_id' => $portfolio->id,
                        'score' => $result['score'] ?? 0,
                    ]);
                } else {
                    Log::error('AI_SIMILARITY_ENGINE_FAILED', [
                        'portfolio_id' => $portfolio->id,
                        'status' => $response->status(),
                        'response' => $response->body(),
                    ]);
                    $portfolio->update(['status' => 'failed']);
                }
            } catch (\Exception $e) {
                Log::error('AI_SIMILARITY_SERVICE_ERROR', [
                    'portfolio_id' => $portfolio->id,
                    'file_path' => $portfolio->file_path,
                    'error' => $e->getMessage(),
                ]);
                $portfolio->update(['status' => 'failed']);
            }
        });
    }
}
