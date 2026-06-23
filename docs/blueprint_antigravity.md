# BLUEPRINT SERDOSDIGI NUSANTARA – v2.1 (April 2026)

## Ringkasan Eksekutif

SERDOS Digital Nusantara adalah aplikasi simulasi penilaian akademik (NAP) berbasis web dengan arsitektur modern, domain-driven design, dan sistem realtime. Dirancang untuk efisiensi operasional, skalabilitas, dan user experience yang optimal.

## Arsitektur Utama

### 1. Single Port Gateway (Port 1111)
- Semua HTTP traffic masuk melalui Laravel
- React build disimpan di `public/`
- Mengurangi kompleksitas deployment

### 2. Domain-Driven Design (DDD)
- Logika NAP terpusat di `Domain/Serdos/`
- Rumus: `PHPNAP = (0.35 × NKAJF) + (0.10 × NPD) + (0.55 × NPDD)`
- Anti-Gagal: NAP ≤ 4.2 otomatis ditolak
- Testable & maintainable

### 3. Realtime System
- Laravel Reverb WebSocket (Port 8080)
- Private channels per user
- Auto-update setelah payment settled

### 4. AI Similarity Engine
- Python Flask microservice
- Asynchronous processing
- WebSocket integration

### 5. Frontend Experience
- React + Tailwind CSS
- Simulation Wizard (step-by-step)
- Real-time Gauge Chart
- Zero refresh after payment

## File Struktur

```
serdos-simulation-app/
├── setup_antigravity.bat                  # Setup script
├── run_antigravity_single_port.bat       # Run all services
├── sync_frontend.bat                      # Build & sync frontend
├── Dockerfile
├── docker-compose.yml
├── README.md
│
├── backend-api/                           # Laravel 11
│   ├── app/
│   │   ├── Domain/Serdos/                # DDD Core
│   │   │   ├── Actions/
│   │   │   │   ├── CalculateNAPAction.php
│   │   │   │   ├── NAPValidator.php
│   │   │   │   └── ValidateAntiFailAction.php
│   │   │   ├── ValueObjects/
│   │   │   │   └── NAPResult.php
│   │   │   ├── Rules/
│   │   │   └── Contracts/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/
│   │   │   │   ├── SimulationController.php
│   │   │   │   ├── PortfolioController.php
│   │   │   │   ├── PaymentController.php
│   │   │   │   └── Admin/
│   │   │   ├── Middleware/
│   │   │   │   ├── SubscriptionGuard.php
│   │   │   │   └── AdminAccess.php
│   │   │   └── Requests/
│   │   ├── Services/
│   │   │   ├── SerdosEngine.php          # Orchestrator
│   │   │   ├── AIProxyService.php
│   │   │   └── PaymentGateway.php
│   │   ├── Events/
│   │   │   ├── PaymentSettled.php
│   │   │   ├── AISimilarityCompleted.php
│   │   │   └── SimulationScoreUpdated.php
│   │   ├── Providers/
│   │   │   └── DomainServiceProvider.php
│   │   └── Models/
│   ├── database/migrations/
│   ├── routes/
│   │   ├── api.php
│   │   ├── web.php                      # Catch-all React
│   │   └── channels.php                 # Reverb
│   ├── tests/
│   │   ├── Domain/Serdos/              # Unit Tests
│   │   └── Feature/                    # Feature Tests
│   └── .env
│
├── frontend-web/                        # React + Tailwind
│   ├── src/
│   │   ├── context/
│   │   │   └── RealtimeContext.jsx     # Echo + Reverb
│   │   ├── pages/
│   │   │   └── Dosen/
│   │   │       └── SimulationWizard.jsx
│   │   └── components/ui/
│   └── .env
│
├── ai-similarity-engine/               # Python Microservice
│   ├── app.py
│   └── requirements.txt
│
└── docs/
    ├── blueprint_antigravity.md        # Ini
    ├── juknis_serdos_2025_analysis.md
    ├── checklist_golive.md
    └── error-archive/
        └── BUG_TRACKER.md
```

## Cara Menjalankan

### Development (XAMPP/Local)
```bash
# 1. Instalasi sekali saja
call setup_antigravity.bat

# 2. Jalankan semua services
call run_antigravity_single_port.bat

# Akses: http://127.0.0.1:1111
```

### Docker
```bash
docker-compose up -d
```

### Production
1. Build frontend: `call sync_frontend.bat`
2. Deploy dengan Docker
3. Configure env variables

## API Endpoints

### Simulation
- `POST /api/v1/simulations` - Calculate NAP

### Portfolio
- `GET /api/v1/portfolios` - List
- `GET /api/v1/portfolios/{id}` - Detail

### Payment
- `POST /api/v1/payments/initiate` - Start payment
- `POST /api/v1/payments/callback` - Webhook

## Risk & Mitigasi

| Komponen | Risiko | Mitigasi |
|----------|--------|----------|
| NAP Calculation | Rumus salah / floating | Value Object + Unit Tests |
| Realtime | WebSocket putus | Reverb auto-start + fallback polling |
| Domain Structure | File hilang saat refactor | DomainServiceProvider + migration command |
| Deployment | Inconsistent build | sync_frontend.bat wajib + Docker |

## File Kritis

✅ CalculateNAPAction.php + NAPValidator.php (rumus resmi)
✅ NAPResult.php Value Object
✅ RealtimeContext.jsx (Echo + Reverb)
✅ channels.php (Reverb configuration)
✅ DomainServiceProvider.php (dependency injection)
✅ Unit Tests lengkap
✅ run_antigravity_single_port.bat
✅ Dockerfile & docker-compose.yml
✅ BUG_TRACKER.md

## Next Steps

1. ✅ Struktur lengkap sudah dibuat
2. ⚠️ Configure database migrations
3. ⚠️ Setup Midtrans API keys
4. ⚠️ Configure Reverb
5. ⚠️ Test end-to-end flow

## Version History

- v2.1 (10 April 2026) - Final blueprint, semua file ready
- v2.0 - Complete restructure with DDD
- v1.0 - Initial prototype

---

**Status**: ✅ READY FOR DEVELOPMENT
