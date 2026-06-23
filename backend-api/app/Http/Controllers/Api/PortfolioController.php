<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Portfolio;
use App\Services\AIProxyService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

/**
 * Vetted by AI - Manual Review Required by Senior Engineer/Manager
 */
class PortfolioController extends Controller
{
    public function __construct(
        private AIProxyService $aiProxy
    ) {}

    public function index(Request $request)
    {
        $portfolios = Portfolio::where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $portfolios,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'file' => 'required|file|mimes:pdf,docx,doc|max:5120', // 5MB limit
        ]);

        try {
            $path = $request->file('file')->store('portfolios');

            $portfolio = Portfolio::create([
                'user_id' => $request->user()->id,
                'title' => $request->title,
                'file_path' => $path,
                'status' => 'pending',
            ]);

            // Trigger AI analysis automatically after upload
            $this->aiProxy->analyzeSimilarity($portfolio);

            Log::info('SERDOS_PORTFOLIO_UPLOADED_AND_TRIGGERED', [
                'user_id' => $portfolio->user_id,
                'portfolio_id' => $portfolio->id,
            ]);

            return response()->json([
                'success' => true,
                'data' => $portfolio,
            ], 201);
        } catch (\Exception $e) {
            Log::error('SERDOS_PORTFOLIO_UPLOAD_ERROR', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to upload portfolio',
            ], 400);
        }
    }

    public function show($id)
    {
        $portfolio = Portfolio::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $portfolio,
        ]);
    }

    public function analyzeForPlagiarism($id)
    {
        $portfolio = Portfolio::findOrFail($id);

        try {
            $this->aiProxy->analyzeSimilarity($portfolio);

            Log::info('SERDOS_PORTFOLIO_ANALYSIS_RETRIGGERED', [
                'portfolio_id' => $id,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Analysis triggered',
            ]);
        } catch (\Exception $e) {
            $portfolio->update(['status' => 'failed']);
            Log::error('SERDOS_PORTFOLIO_ANALYSIS_ERROR', [
                'portfolio_id' => $id,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to trigger analysis',
            ], 500);
        }
    }

    public function destroy($id)
    {
        $portfolio = Portfolio::findOrFail($id);
        
        // Delete file from storage
        if (Storage::exists($portfolio->file_path)) {
            Storage::delete($portfolio->file_path);
        }

        $portfolio->delete();

        Log::info('SERDOS_PORTFOLIO_DELETED', [
            'portfolio_id' => $id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Portfolio deleted successfully',
        ]);
    }
}
