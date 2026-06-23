<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login | SERDOS Digital Nusantara</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #6366f1;
            --primary-dark: #4f46e5;
            --bg: #0f172a;
            --glass: rgba(255, 255, 255, 0.03);
            --glass-border: rgba(255, 255, 255, 0.1);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Outfit', sans-serif;
        }

        body {
            background-color: var(--bg);
            color: white;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            position: relative;
        }

        /* Animated Background Gradients */
        .blob {
            position: absolute;
            width: 500px;
            height: 500px;
            background: radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%);
            border-radius: 50%;
            z-index: -1;
            filter: blur(80px);
            animation: move 20s infinite alternate;
        }

        @keyframes move {
            from { transform: translate(-20%, -20%); }
            to { transform: translate(20%, 20%); }
        }

        .login-card {
            background: var(--glass);
            backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            padding: 3rem;
            border-radius: 2rem;
            width: 100%;
            max-width: 450px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            text-align: center;
            animation: fadeIn 0.8s ease-out;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .logo {
            font-size: 2rem;
            font-weight: 700;
            background: linear-gradient(to right, #818cf8, #c084fc);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 0.5rem;
        }

        .subtitle {
            color: #94a3b8;
            font-size: 0.9rem;
            margin-bottom: 2.5rem;
        }

        .form-group {
            text-align: left;
            margin-bottom: 1.5rem;
        }

        label {
            display: block;
            font-size: 0.85rem;
            color: #cbd5e1;
            margin-bottom: 0.5rem;
            margin-left: 0.5rem;
        }

        input {
            width: 100%;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--glass-border);
            padding: 1rem 1.2rem;
            border-radius: 1rem;
            color: white;
            font-size: 1rem;
            transition: all 0.3s;
        }

        input:focus {
            outline: none;
            border-color: var(--primary);
            background: rgba(255, 255, 255, 0.08);
            box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
        }

        .login-btn {
            width: 100%;
            background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
            color: white;
            border: none;
            padding: 1rem;
            border-radius: 1rem;
            font-weight: 600;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s;
            margin-top: 1rem;
            box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.3);
        }

        .login-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 20px 25px -5px rgba(99, 102, 241, 0.4);
        }

        .footer-note {
            margin-top: 2rem;
            font-size: 0.8rem;
            color: #64748b;
        }

        .alert {
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.2);
            color: #fca5a5;
            padding: 0.8rem;
            border-radius: 0.8rem;
            margin-bottom: 1.5rem;
            font-size: 0.85rem;
            display: none;
        }
    </style>
</head>
<body>
    <div class="blob"></div>
    
    <div class="login-card">
        <div class="logo">SERDOS Digital</div>
        <p class="subtitle">Platform Simulasi & Sertifikasi Dosen Terpadu</p>
        
        <div id="auth-alert" class="alert">Email atau password salah.</div>
        
        <form id="login-form" onsubmit="handleLogin(event)">
            <div class="form-group">
                <label>Alamat Email</label>
                <input type="email" id="email" placeholder="dosen@university.ac.id" required>
            </div>
            
            <div class="form-group">
                <label>Kata Sandi</label>
                <input type="password" id="password" placeholder="••••••••" required>
            </div>
            
            <button type="submit" class="login-btn">Masuk Ke Sistem</button>
        </form>
        
        <div class="footer-note">
            &copy; 2026 SERDOS Digital Nusantara<br>
            <span style="font-size: 0.7rem; opacity: 0.5;">Emergency Gateway Active | PHP Optimized</span>
        </div>
    </div>

    <script>
        function handleLogin(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const alert = document.getElementById('auth-alert');

            // Emergency simulation for local testing
            // Real authentication happens via actual API in final React deployment
            if (email === 'admin@serdos.digital' && password === 'admin123') {
                alert.style.display = 'none';
                localStorage.setItem('auth', 'true');
                localStorage.setItem('role', 'admin');
                alert.className = 'alert';
                alert.style.background = 'rgba(34, 197, 94, 0.1)';
                alert.style.borderColor = 'rgba(34, 197, 94, 0.2)';
                alert.style.color = '#86efac';
                alert.innerText = 'Login Berhasil! Mengalihkan...';
                alert.style.display = 'block';
                setTimeout(() => window.location.reload(), 1500);
            } else if (email === 'dosen@university.ac.id' && password === 'dosen123') {
                alert.style.display = 'none';
                localStorage.setItem('auth', 'true');
                localStorage.setItem('role', 'dosen');
                alert.className = 'alert';
                alert.style.background = 'rgba(34, 197, 94, 0.1)';
                alert.style.borderColor = 'rgba(34, 197, 94, 0.2)';
                alert.style.color = '#86efac';
                alert.innerText = 'Login Berhasil! Mengalihkan...';
                alert.style.display = 'block';
                setTimeout(() => window.location.reload(), 1500);
            } else {
                alert.style.display = 'block';
            }
        }
    </script>
</body>
</html>
