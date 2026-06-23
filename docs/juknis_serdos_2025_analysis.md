# Analisis Juknis SERDOS 2025

## Rumus Penilaian NAP

Peraturan DIKTI/BAN-PT 2025 tentang penilaian dosen:

$$\text{PHPNAP} = (0.35 \times \text{NKAJF}) + (0.10 \times \text{NPD}) + (0.55 \times \text{NPDD})$$

### Komponen Penilaian

#### NKAJF (Nilai Kualitas Akademik & Jurnal Penelitian)
- Bobot: 35%
- Range: 0-100
- Mencakup: Publikasi, penelitian, tulisan

#### NPD (Nilai Pengabdian Dosen)
- Bobot: 10%
- Range: 0-100
- Mencakup: Pengabdian masyarakat, pelatihan

#### NPDD (Nilai Pengajaran & Pengembangan Dosen)
- Bobot: 55%
- Range: 0-100
- Mencakup: Pengajaran, pengembangan kurikulum, mentoring

## Kriteria Anti-Gagal

**Standar Minimum**: NAP > 4.2

Jika NAP ≤ 4.2 → **DITOLAK**

## Contoh Perhitungan

```
NKAJF = 80
NPD = 70
NPDD = 90

PHPNAP = (0.35 × 80) + (0.10 × 70) + (0.55 × 90)
       = 28 + 7 + 49.5
       = 84.5

Status: ✅ DITERIMA (> 4.2)
```

## Implementasi di Sistem

1. Input dilakukan via Simulation Wizard
2. Backend memvalidasi range (0-100)
3. Domain Action menghitung NAP
4. Value Object menyimpan hasil
5. Frontend menampilkan dengan gauge chart
6. Realtime update via WebSocket
7. Payment settlement trigger submission

## Mapping Juknis ke Database

- NKAJF → academics table
- NPD → services table
- NPDD → teaching table
- NAP result → assessment_results table

## Referensi Dokumen

- Juknis BAN-PT 2025
- Permendikbud No. XX Tahun 2025
- SOP DIKTI 2025
