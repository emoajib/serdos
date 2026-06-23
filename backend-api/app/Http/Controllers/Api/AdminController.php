<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Simulation;
use App\Models\Payment;
use App\Models\User;
use App\Models\SimSetting;
use App\Models\SimRubric;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

/**
 * SUPREME ADMIN ENGINE v4.0 - AUDIT COMPLIANT
 */
class AdminController extends Controller
{
    public function stats()
    {
        return response()->json([
            'success' => true,
            'stats' => [
                'total_simulations' => Simulation::count(),
                'passed_count' => Simulation::where('status', 'passed')->count(),
                'total_revenue' => Payment::where('status', 'settled')->sum('amount'),
                'active_users' => User::count(),
            ],
            'recent_activities' => Simulation::with('user')->latest()->take(10)->get(),
            'audit_logs' => ActivityLog::with('user')->latest()->take(50)->get()
        ]);
    }

    public function updateSetting(Request $request)
    {
        $oldSettings = SimSetting::all()->pluck('value', 'key')->toArray();
        
        foreach ($request->all() as $key => $value) {
            SimSetting::updateOrCreate(['key' => $key], ['value' => $value]);
        }

        // 🛡️ IMPLEMENT AUDIT TRAIL
        ActivityLog::create([
            'user_id' => auth()->id(),
            'action' => 'UPDATE_SETTINGS',
            'payload' => [
                'before' => $oldSettings,
                'after' => $request->all(),
            ],
            'ip_address' => $request->ip()
        ]);

        return response()->json(['success' => true, 'message' => 'Pengaturan Berhasil Diupdate & Tercatat di Audit Log']);
    }

    public function getUsers()
    {
        $users = User::withCount('simulations')->latest()->get()->map(function($user) {
            $user->is_premium = $user->payments()->where('status', 'settled')->exists();
            return $user;
        });
        return response()->json(['success' => true, 'users' => $users]);
    }

    public function getSettings() { 
        $settings = SimSetting::all()->pluck('value', 'key');
        // Default fallbacks if empty
        if (!isset($settings['nap_threshold'])) $settings['nap_threshold'] = 3.0;
        if (!isset($settings['npd_threshold'])) $settings['npd_threshold'] = 5.0;
        return response()->json(['success' => true, 'settings' => $settings]); 
    }

    public function togglePremium($id)
    {
        $user = User::findOrFail($id);
        $isCurrentlyPremium = $user->payments()->where('status', 'settled')->exists();

        if ($isCurrentlyPremium) {
            // Unsettle latest payment for this exercise
            $user->payments()->where('status', 'settled')->latest()->first()->update(['status' => 'refunded']);
        } else {
            // Create manual settled payment
            $user->payments()->create([
                'amount' => 150000,
                'status' => 'settled',
                'payment_method' => 'MANUAL_ADMIN',
                'external_id' => 'MANUAL-'.time()
            ]);
        }

        ActivityLog::create([
            'user_id' => auth()->id(),
            'action' => 'TOGGLE_PREMIUM',
            'description' => 'Manual toggle premium for user ID: '.$id,
            'ip_address' => request()->ip()
        ]);

        return response()->json(['success' => true]);
    }

    public function getRubrics() { return response()->json(['success' => true, 'rubrics' => SimRubric::orderBy('role_group')->orderBy('order')->get()]); }
    public function getPendingPayments() { return response()->json(['success' => true, 'payments' => Payment::with('user')->where('status', 'pending')->latest()->get()]); }
    public function approvePayment($id) { 
        Payment::findOrFail($id)->update(['status' => 'settled']); 
        ActivityLog::create([
            'user_id' => auth()->id(),
            'action' => 'APPROVE_PAYMENT',
            'description' => 'Approved payment ID: '.$id,
            'ip_address' => request()->ip()
        ]);
        return response()->json(['success' => true]); 
    }
}
