<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

/**
 * Controller untuk halaman login web dengan CAPTCHA
 */
class AuthWebController extends Controller
{
    /**
     * Tampilkan halaman login dengan CAPTCHA
     */
    public function showLogin()
    {
        return view('auth.login', $this->generateCaptchaData());
    }

    /**
     * Reload CAPTCHA via AJAX
     */
    public function reloadCaptcha()
    {
        return response()->json($this->generateCaptchaData());
    }

    /**
     * Generate CAPTCHA data
     */
    private function generateCaptchaData()
    {
        // Generate CAPTCHA directly (not using API to avoid cache issues)
        $num1 = rand(10, 99);
        $num2 = rand(1, 9);
        $sum = $num1 + $num2;
        $uuid = Str::uuid()->toString();

        // Store the answer in cache for 5 minutes
        Cache::put("captcha:{$uuid}", $sum, 300);

        return [
            'captcha_id' => $uuid,
            'captcha_question' => "{$num1} + {$num2}",
        ];
    }

    /**
     * Proses login dari web form
     */
    public function processLogin(Request $request)
    {
        $request->validate([
            'email'           => 'required|email',
            'password'        => 'required|string|min:6',
            'captcha_id'      => 'required|string',
            'captcha_answer'  => 'required|integer',
        ]);

        // Validate CAPTCHA
        $captchaKey = "captcha:{$request->captcha_id}";
        $expectedAnswer = Cache::get($captchaKey);
        $userAnswer = (int) $request->captcha_answer;

        if (!$expectedAnswer || $expectedAnswer !== $userAnswer) {
            // Remove used CAPTCHA
            Cache::forget($captchaKey);

            return back()->withErrors([
                'captcha' => 'CAPTCHA salah. Silakan coba lagi.',
            ])->withInput($request->except('password'));
        }

        // Remove used CAPTCHA
        Cache::forget($captchaKey);

        // Proses login via direct authentication (CAPTCHA already validated)
        $loginResult = $this->loginViaDirect($request->email, $request->password);

        if ($loginResult) {
            // Store token in session for web usage
            session(['api_token' => $loginResult['token'], 'user' => $loginResult['user']]);

            return redirect('/dashboard')->with('success', 'Login berhasil!');
        }

        // Jika login gagal, redirect kembali dengan error
        return back()->withErrors([
            'login' => 'Login gagal. Periksa email dan password Anda.',
        ])->withInput($request->except('password'));
    }

    /**
     * Logout
     */
    public function logout()
    {
        // Revoke token if exists
        $token = session('api_token');
        if ($token) {
            // Find and revoke the token
            $user = \App\Models\User::find(session('user')['id']);
            if ($user) {
                $user->tokens()->where('name', 'like', 'serdos-web-%')->delete();
            }
        }

        session()->flush();
        return redirect('/login')->with('success', 'Logout berhasil!');
    }

    /**
     * Login via direct authentication (bypass API for web login)
     */
    private function loginViaDirect($email, $password)
    {
        // Direct authentication without CAPTCHA (CAPTCHA already validated)
        $user = \App\Models\User::where('email', $email)->first();

        if (!$user || !\Illuminate\Support\Facades\Hash::check($password, $user->password)) {
            return null;
        }

        // Revoke old tokens
        $user->tokens()->delete();

        // Create new token
        $tokenName = 'serdos-web-' . $user->role;
        $abilities = $user->role === 'admin'
            ? ['admin:*', 'dosen:*']
            : ['dosen:simulation', 'dosen:portfolio'];

        $sanctumToken = $user->createToken($tokenName, $abilities);

        return [
            'token' => $sanctumToken->plainTextToken,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ]
        ];
    }
}