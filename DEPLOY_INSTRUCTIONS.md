# DEPLOYMENT INSTRUCTIONS - SERDOS Digital Nusantara
## Domain: sosiomen.web.id

=====================================================
## ⚡ INSTALASI CEPAT (5 MENIT)
=====================================================

### 1. Buat Database di cPanel
```
1. Login cPanel → MySQL Databases
2. Buat database: sosiomen_serdos
3. Buat user: sosiomen_serdos_user + password kuat
4. Assign user ke database (ALL PRIVILEGES)
5. Catat: DB_NAME, DB_USER, DB_PASSWORD
```

### 2. Upload File via cPanel File Manager
```
1. Login cPanel → File Manager
2. Navigasi ke public_html/
3. Upload file: serdos-deploy.zip (disediakan)
4. Extract zip → folder "serdos" akan muncul
5. Pindahkan isi serdos/backend-api/public/* ke public_html/
6. Pindahkan folder serdos/backend-api/ ke luar public_html/
   Jadi: /home/sosiomen/serdos/backend-api/
```

### 3. Set Environment
```
Edit: /home/sosiomen/serdos/backend-api/.env

Isi kredensial database dari langkah 1:
  DB_DATABASE=sosiomen_serdos
  DB_USERNAME=sosiomen_serdos_user
  DB_PASSWORD=password_dari_langkah_1

Update Midtrans key (jika ada):
  MIDTRANS_SERVER_KEY=isi_dari_midtrans
  MIDTRANS_CLIENT_KEY=isi_dari_midtrans
```

### 4. Generate APP_KEY & Cache
```bash
# Via SSH (jika ada akses)
cd /home/sosiomen/serdos/backend-api
php artisan key:generate
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan storage:link

# Atau via cPanel Terminal / SSH
```

### 5. Set Permissions
```bash
chmod -R 755 /home/sosiomen/serdos/backend-api/storage
chmod -R 755 /home/sosiomen/serdos/backend-api/bootstrap/cache
```

### 6. Konfigurasi Document Root di cPanel
```
1. Login cPanel → Domains
2. Pilih sosiomen.web.id → Document Root
3. Set ke: /home/sosiomen/public_html
   (Karena public_html sudah berisi isi dari backend-api/public/)
```

### 7. Test
```
Visit: https://sosiomen.web.id/api/v1/health
Seharusnya return: {"status":"ok","message":"SERDOS API is running"}
```

=====================================================
## 📁 STRUKTUR FINAL DI SERVER
=====================================================
```
/home/sosiomen/
├── public_html/              → Document Root
│   ├── index.php            → Laravel entry point
│   ├── .htaccess            → Rewrite rules
│   ├── index.html            → Frontend (React)
│   └── assets/              → Frontend build files
│
└── serdos/                   → Di luar public_html
    └── backend-api/
        ├── app/              → Laravel app
        ├── config/           → Config files
        ├── routes/           → API routes
        ├── vendor/           → Composer dependencies
        ├── .env              → Environment config
        └── storage/          → Logs, cache, uploads
```

=====================================================
## ⚠️ CATATAN PENTING
=====================================================
- AI Similarity Engine: Tidak bisa jalan di shared hosting
  → Deploy terpisah ke Railway/Render/Vercel nanti
- WebSocket Realtime: Tidak aktif di shared hosting
  → Pakai Pusher gratis jika diperlukan
- Redis: Nonaktif (pakai file cache bawaan Laravel)
- Images/Uploads: Pastikan folder storage/app/public bisa diakses

=====================================================
## 🚀 SELESAI! Aplikasi siap diakses.
=====================================================