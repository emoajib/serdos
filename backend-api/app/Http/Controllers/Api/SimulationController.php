<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Simulation;
use App\Models\SimSetting;
use App\Domain\Serdos\Actions\CalculateSubScoringAction;
use Illuminate\Http\Request;

/**
 * SIMULATION ENGINE v4.0 - SNAPSHOT CAPABLE
 */
class SimulationController extends Controller
{
    public function store(Request $request)
    {
        // 1. MONETIZATION GATE
        $count = $request->user()->simulations()->count();
        $isPremium = $request->user()->hasActiveSubscription();
        
        if ($count >= 1 && !$isPremium) {
            return response()->json([
                'success' => false,
                'requires_payment' => true,
                'message' => 'Limit simulasi gratis habis. Silakan upgrade ke Premium.'
            ], 402);
        }

        // 2. FETCH CURRENT POLICY RULES (SNAPSHOT)
        $currentRules = SimSetting::all()->pluck('value', 'key')->toArray();

        // 3. EXECUTE CALCULATION ENGINE
        $calculator = new CalculateSubScoringAction();
        $results = $calculator->execute($request->all());

        // 4. PERSIST WITH SNAPSHOT INTEGRITY
        $simulation = $request->user()->simulations()->create([
            'profile' => $request->profile,
            'details' => $request->details,
            'nap' => $results['nap'] ?? 0,
            'status' => $results['gates']['is_passed'] ? 'passed' : 'failed',
            'status_code' => $results['gates']['is_passed'] ? 'LULUS' : 'GAGAL',
            'applied_rules' => $currentRules // 💾 SNAPSHOT SAVED HERE
        ]);

        return response()->json([
            'success' => true,
            'data' => $simulation,
            'evaluation' => $results
        ]);
    }

    public function latest(Request $request)
    {
        $sim = $request->user()->simulations()->latest()->first();
        return response()->json(['success' => true, 'data' => $sim]);
    }

    public function index(Request $request)
    {
        return response()->json([
            'success' => true,
            'data' => $request->user()->simulations()->latest()->get()
        ]);
    }

    public function auditAI(Request $request)
    {
        $request->validate([
            'biodataNarative' => [
                'required',
                'string',
                function ($attribute, $value, $fail) {
                    $wordCount = str_word_count($value);
                    if ($wordCount > 150) {
                        $fail('Narasi Biodata tidak boleh lebih dari 150 kata.');
                    }
                }
            ],
            'narasiPenelitian' => [
                'required',
                'string',
                function ($attribute, $value, $fail) {
                    $wordCount = str_word_count($value);
                    if ($wordCount < 250 || $wordCount > 300) {
                        $fail('Narasi Penelitian harus antara 250-300 kata.');
                    }
                }
            ],
            'narasiPkM' => [
                'required',
                'string',
                function ($attribute, $value, $fail) {
                    $wordCount = str_word_count($value);
                    if ($wordCount < 250 || $wordCount > 300) {
                        $fail('Narasi Pengabdian kepada Masyarakat harus antara 250-300 kata.');
                    }
                }
            ],
        ]);

        // Proxy to AI service on port 5000
        $client = new \GuzzleHttp\Client();
        try {
            $response = $client->post('http://localhost:5000/audit', [
                'json' => [
                    'biodata' => $request->biodataNarative,
                    'penelitian' => $request->narasiPenelitian,
                    'pkm' => $request->narasiPkM,
                ],
                'timeout' => 30,
            ]);

            $result = json_decode($response->getBody(), true);
            $score = $result['score'] ?? 0; // Assume score is percentage 0-100

            return response()->json([
                'success' => true,
                'score' => $score,
                'status' => $score > 60 ? 'FRAUD DETECTED' : ($score > 40 ? 'WARNING' : 'CLEAR'),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'AI service unavailable: ' . $e->getMessage(),
            ], 500);
        }
    }
}
