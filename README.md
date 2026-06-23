# 🚀 SERDOS Digital Nusantara - Simulasi NAP Penilaian Dosen

Sistem simulasi penilaian akademik (NAP) untuk dosen dengan arsitektur modern, domain-driven design, dan realtime updates.

## 📋 Fitur Utama

- **Single Port Gateway** - Semua traffic via Port 1111
- **Domain-Driven Design** - Logika bisnis terpisah dan testable
- **Realtime System** - Laravel Reverb + WebSocket
- **Payment Integration** - Midtrans integration
- **AI Similarity Engine** - Python microservice untuk deteksi kesamaan dokumen

## 🏗️ Arsitektur

```
PHPNAP = (0.35 × NKAJF) + (0.10 × NPD) + (0.55 × NPDD)
Anti-Gagal: NAP ≤ 4.2 otomatis ditolak
```

### Komponen
- **Backend**: Laravel 11 + Domain-Driven Design
- **Frontend**: React + Tailwind + Realtime Context
- **WebSocket**: Laravel Reverb (Port 8080)
- **AI**: Python Flask Microservice (Port 5000)
- **Database**: MySQL
- **Cache**: Redis

## 🚀 Quickstart

### Development (XAMPP)

```bash
# 1. Setup (sekali saja)
call setup_antigravity.bat

# 2. Run semua services
call run_antigravity_single_port.bat

# Access: http://127.0.0.1:1111
```

### Docker

```bash
docker-compose up -d
```

## 📁 Struktur Project

```
serdos-simulation-app/
├── backend-api/               # Laravel 11
│   ├── app/Domain/Serdos/    # Business Logic
│   ├── app/Http/             # Controllers, Middleware
│   ├── routes/               # API Routes
│   └── tests/                # Unit & Feature Tests
├── frontend-web/              # React + Tailwind
│   └── src/
├── ai-similarity-engine/      # Python Microservice
└── docs/                      # Documentation
```

## 📚 API Endpoints

### Simulation
- `POST /api/v1/simulations` - Calculate NAP Score

### Portfolio
- `GET /api/v1/portfolios` - List portfolios
- `GET /api/v1/portfolios/{id}` - Get portfolio detail

### Payment
- `POST /api/v1/payments/initiate` - Initiate payment
- `POST /api/v1/payments/callback` - Payment callback

## 🔐 Realtime Channels

- `private-payment.{userId}` - Payment updates
- `private-ai-result.{userId}` - AI analysis results
- `private-simulation.{userId}` - Simulation updates

## 🚀 Production Deployment

### Prerequisites
- PHP 8.2+
- MySQL 8.0+
- Node.js 18+
- Python 3.11+

### Quick Production Setup
```bash
# 1. Setup database
mysql -u root -e "CREATE DATABASE serdos_digital"

# 2. Install dependencies
cd backend-api && composer install
cd ../frontend-web && npm install
cd ../ai-similarity-engine && pip install -r requirements.txt

# 3. Configure environment
cp backend-api/.env.example backend-api/.env
# Edit .env with production values

# 4. Database migration
cd backend-api
php artisan migrate --seed
php artisan key:generate

# 5. Build frontend
cd ../frontend-web
npm run build
cp -r dist/* ../backend-api/public/

# 6. Start services
cd ../backend-api
php artisan serve --host=127.0.0.1 --port=1111 &

cd ../ai-similarity-engine
python app.py &
```

### Production URL
- **Application**: http://127.0.0.1:1111
- **API**: http://127.0.0.1:1111/api/v1/
- **Health Check**: http://127.0.0.1:1111/api/v1/health

### Default Credentials
- **Admin**: admin@serdos.digital / admin123
- **Dosen**: dosen@university.ac.id / dosen123

### SSL Configuration
Self-signed certificates generated in `ssl/` directory for HTTPS testing.

### Nginx Production Config
Nginx configuration available in `nginx.conf` for production deployment.

### CI/CD Pipeline
GitHub Actions workflow configured for automated testing and deployment.

### Deployment Script
Run `./deploy.sh` for automated production deployment with backups.

## 🧪 Testing

## 📝 Environment Variables

Lihat `.env.example` di setiap folder

## 🤝 Contributing

Follow Domain-Driven Design principles

## 📄 License

MIT
