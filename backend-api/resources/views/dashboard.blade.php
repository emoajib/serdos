<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - SERDOS Digital Nusantara</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .glass-panel {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .gradient-text {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
    </style>
</head>
<body class="min-h-screen bg-slate-900 text-white">
    <div class="container mx-auto px-4 py-8">
        <div class="glass-panel rounded-2xl p-8 max-w-4xl mx-auto">
            <div class="flex justify-between items-center mb-8">
                <div>
                    <h1 class="text-3xl font-black gradient-text mb-2">SERDOS DIGI</h1>
                    <p class="text-slate-400">Digital Nusantara Simulation System</p>
                </div>
                <form method="POST" action="{{ url('/logout') }}" class="inline">
                    @csrf
                    <button type="submit" class="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors">
                        Logout
                    </button>
                </form>
            </div>

            @if(session('success'))
                <div class="mb-6 bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-3 text-green-400 text-sm">
                    {{ session('success') }}
                </div>
            @endif

            <div class="grid md:grid-cols-2 gap-6">
                <div class="glass-panel rounded-xl p-6">
                    <h2 class="text-xl font-semibold mb-4 text-indigo-400">Selamat Datang!</h2>
                    <div class="space-y-2 text-sm">
                        <p><span class="text-slate-400">Nama:</span> {{ session('user')['name'] ?? 'N/A' }}</p>
                        <p><span class="text-slate-400">Email:</span> {{ session('user')['email'] ?? 'N/A' }}</p>
                        <p><span class="text-slate-400">Role:</span> {{ session('user')['role'] ?? 'N/A' }}</p>
                    </div>
                </div>

                <div class="glass-panel rounded-xl p-6">
                    <h2 class="text-xl font-semibold mb-4 text-purple-400">Menu Utama</h2>
                    <div class="space-y-3">
                        @if(session('user')['role'] === 'admin')
                            <a href="#" class="block bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors">
                                Kelola Pengguna
                            </a>
                            <a href="#" class="block bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors">
                                Review Portofolio
                            </a>
                        @else
                            <a href="#" class="block bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors">
                                Simulasi
                            </a>
                            <a href="#" class="block bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors">
                                Portofolio Saya
                            </a>
                        @endif
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="absolute bottom-8 right-8 text-slate-500 text-xs tracking-widest uppercase">
        Vetted by AI • Enterprise Edition v2.1
    </div>
</body>
</html>