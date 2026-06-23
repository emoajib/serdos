<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - SERDOS Digital Nusantara</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0;
            padding: 20px;
        }
        .login-container {
            background: rgba(255, 255, 255, 0.95);
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            width: 100%;
            max-width: 400px;
        }
        .logo {
            text-align: center;
            margin-bottom: 2rem;
        }
        .logo h1 {
            color: #667eea;
            margin: 0;
            font-size: 2rem;
            font-weight: bold;
        }
        .logo p {
            color: #666;
            margin: 0.5rem 0 0 0;
        }
        .form-group {
            margin-bottom: 1rem;
        }
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            color: #333;
            font-weight: 500;
        }
        .form-group input {
            width: 100%;
            padding: 0.75rem;
            border: 2px solid #ddd;
            border-radius: 5px;
            font-size: 1rem;
            transition: border-color 0.3s;
        }
        .form-group input:focus {
            outline: none;
            border-color: #667eea;
        }
        .captcha-label {
            background: #f8f9fa;
            padding: 0.5rem;
            border-radius: 5px;
            border: 2px solid #667eea;
            text-align: center;
            font-weight: bold;
            color: #333;
            margin-bottom: 0.5rem;
        }
        .error {
            background: #fee;
            color: #c33;
            padding: 0.5rem;
            border-radius: 5px;
            border: 1px solid #fcc;
            margin-bottom: 1rem;
        }
        .success {
            background: #efe;
            color: #363;
            padding: 0.5rem;
            border-radius: 5px;
            border: 1px solid #cfc;
            margin-bottom: 1rem;
        }
        .btn {
            width: 100%;
            padding: 0.75rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 1rem;
            font-weight: bold;
            cursor: pointer;
            transition: opacity 0.3s;
        }
        .btn:hover {
            opacity: 0.9;
        }
        .btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
        .password-container {
            position: relative;
        }
        .password-toggle {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            cursor: pointer;
            color: #666;
            padding: 5px;
            transition: color 0.3s;
        }
        .password-toggle:hover {
            color: #667eea;
        }
        .password-input {
            padding-right: 40px;
        }
        .captcha-container {
            position: relative;
        }
        .captcha-input-group {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .captcha-input-group input {
            flex: 1;
        }
        .captcha-reload-btn {
            background: #667eea;
            border: none;
            border-radius: 5px;
            padding: 8px;
            cursor: pointer;
            color: white;
            transition: background-color 0.3s, opacity 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .captcha-reload-btn:hover {
            background: #5a67d8;
        }
        .captcha-reload-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
        .animate-spin {
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="logo">
            <h1>SERDOS DIGI</h1>
            <p>Digital Nusantara Simulation System</p>
        </div>

        @if(session('success'))
            <div class="success">{{ session('success') }}</div>
        @endif

        <form method="POST" action="{{ url('/login') }}">
            @csrf

            <div class="form-group">
                <label for="email">Email Address</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    autocomplete="username"
                    placeholder="name@university.ac.id"
                    value="{{ old('email') }}"
                />
            </div>

            <div class="form-group">
                <label for="password">Password</label>
                <div class="password-container">
                    <input
                        type="password"
                        id="password"
                        name="password"
                        required
                        autocomplete="current-password"
                        placeholder="••••••••"
                        class="password-input"
                    />
                    <button type="button" class="password-toggle" onclick="togglePassword()" title="Toggle password visibility">
                        <svg id="eye-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                    </button>
                </div>
            </div>

            <div class="form-group">
                <div class="captcha-container">
                    <div class="captcha-label" id="captcha-question">
                        CAPTCHA: {{ $captcha_question }} = ?
                    </div>
                    <div class="captcha-input-group">
                        <input
                            type="number"
                            name="captcha_answer"
                            id="captcha-answer"
                            required
                            placeholder="Masukkan jawaban"
                            value="{{ old('captcha_answer') }}"
                        />
                        <button type="button" class="captcha-reload-btn" onclick="reloadCaptcha()" title="Reload CAPTCHA">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                            </svg>
                        </button>
                    </div>
                    <input type="hidden" name="captcha_id" id="captcha-id" value="{{ $captcha_id }}" />
                </div>
            </div>

            @if($errors->has('login') || $errors->has('captcha'))
                <div class="error">
                    @if($errors->has('login'))
                        {{ $errors->first('login') }}
                    @endif
                    @if($errors->has('captcha'))
                        {{ $errors->first('captcha') }}
                    @endif
                </div>
            @endif

            <button type="submit" class="btn">
                Masuk ke Portal
            </button>
        </form>

        <div style="text-align: center; margin-top: 1rem; color: #666; font-size: 0.9rem;">
            Vetted by AI • Enterprise Edition v2.1
        </div>
    </div>

    <script>
        function togglePassword() {
            const passwordInput = document.getElementById('password');
            const eyeIcon = document.getElementById('eye-icon');

            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                eyeIcon.innerHTML = `
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                `;
            } else {
                passwordInput.type = 'password';
                eyeIcon.innerHTML = `
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                `;
            }
        }

        function reloadCaptcha() {
            const reloadBtn = document.querySelector('.captcha-reload-btn');
            const originalIcon = reloadBtn.innerHTML;

            // Disable button and show loading
            reloadBtn.disabled = true;
            reloadBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="animate-spin">
                    <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
            `;

            // Fetch new CAPTCHA
            fetch('/captcha/reload', {
                method: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                // Update CAPTCHA
                document.getElementById('captcha-question').textContent = `CAPTCHA: ${data.captcha_question} = ?`;
                document.getElementById('captcha-id').value = data.captcha_id;
                document.getElementById('captcha-answer').value = '';

                // Clear any previous error
                const errorElement = document.querySelector('.error');
                if (errorElement) {
                    errorElement.style.display = 'none';
                }
            })
            .catch(error => {
                console.error('Error reloading CAPTCHA:', error);
                alert('Gagal memuat ulang CAPTCHA. Silakan refresh halaman.');
            })
            .finally(() => {
                // Re-enable button and restore icon
                reloadBtn.disabled = false;
                reloadBtn.innerHTML = originalIcon;
            });
        }
    </script>
</body>
</html>