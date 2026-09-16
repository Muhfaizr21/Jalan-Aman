# Jalan Aman — Superadmin Panel

Dokumentasi fitur panel superadmin/web dashboard untuk sistem **Jalan Aman**, rekomendasi rute teraman berbasis crowdsourcing, spatial clustering (DBSCAN), risk prediction (Random Forest), dan modified pathfinding (A*).

Proyek: ICONFEST 2026 — Software Development Competition
Tim: UNSIL KAMI DATANG

---

## Daftar Isi

1. [Manajemen Laporan Insiden](#1-manajemen-laporan-insiden)
2. [Dashboard Peta Klaster (DBSCAN)](#2-dashboard-peta-klaster-dbscan)
3. [Panel Model & Risk Scoring](#3-panel-model--risk-scoring)
4. [Manajemen User](#4-manajemen-user)
5. [Panel Statistik & Analytics](#5-panel-statistik--analytics)
6. [Manajemen Konten Master](#6-manajemen-konten-master)
7. [Audit Log](#7-audit-log)
8. [Manajemen Wilayah/Zona Operasional](#8-manajemen-wilayahzona-operasional)
9. [Moderasi Konten Laporan](#9-moderasi-konten-laporan)
10. [Manajemen Integrasi Eksternal](#10-manajemen-integrasi-eksternal)
11. [Konfigurasi Notifikasi Real-Time](#11-konfigurasi-notifikasi-real-time)
12. [Sistem Monitoring & Job Queue](#12-sistem-monitoring--job-queue)
13. [Feedback Loop Rute](#13-feedback-loop-rute)
14. [Data Export & Kepatuhan Privasi](#14-data-export--kepatuhan-privasi)
15. [Rekomendasi Prioritas MVP](#15-rekomendasi-prioritas-mvp)

---

## 1. Manajemen Laporan Insiden

Modul inti untuk mengelola laporan crowdsourcing dari pengguna sebelum masuk ke pipeline clustering.

- List laporan: tabel dengan ID, kategori insiden, wilayah, waktu kejadian, waktu lapor, status (pending/verified/rejected), user pelapor
- Filter & search: status, kategori, rentang tanggal, wilayah, radius dari titik tertentu
- Detail laporan: mini-map lokasi, foto bukti, catatan user, history perubahan status
- Aksi verifikasi: approve (masuk pipeline clustering) / reject (wajib isi alasan)
- Deteksi duplikat otomatis: highlight laporan lain dalam radius & waktu berdekatan (mis. <100m, <1 jam)
- Bulk action: approve/reject banyak laporan sekaligus
- Rate limit indicator: tandai user dengan frekuensi laporan mencurigakan

## 2. Dashboard Peta Klaster (DBSCAN)

Visualisasi hasil pengelompokan titik rawan.

- Peta heatmap interaktif (zoom, pan), gradasi warna sesuai kepadatan klaster
- Toggle layer: laporan mentah vs hasil klaster vs data historis kepolisian
- Filter: rentang waktu, wilayah, kategori insiden
- Detail klaster: jumlah insiden, kategori dominan, radius klaster
- Tombol "Re-run Clustering" manual dengan parameter `eps` & `min_samples` yang bisa di-tuning admin
- History run: waktu eksekusi, jumlah klaster dihasilkan, durasi proses

## 3. Panel Model & Risk Scoring

Kontrol atas model prediksi tingkat bahaya.

- List skor risiko per ruas jalan/segmen, sortable
- Detail feature importance per segmen (waktu, riwayat insiden, kondisi lingkungan)
- Tombol "Retrain Model" manual dengan pilihan dataset (semua data / N bulan terakhir)
- Riwayat training: tanggal, durasi, versi model
- Evaluasi model: accuracy, precision/recall, confusion matrix per versi
- Rollback ke versi model sebelumnya jika performa turun

## 4. Manajemen User

- List user: nama, kontak, role, status akun, jumlah laporan
- Detail user: riwayat laporan, riwayat pencarian rute, riwayat rating rute
- Aksi: suspend/ban (dengan alasan wajib), reset password, ubah role
- Role: Superadmin, Admin/Moderator (verifikasi laporan saja), User biasa
- Trust score (opsional): kredibilitas user berdasarkan rasio laporan verified vs rejected

## 5. Panel Statistik & Analytics

- Grafik tren laporan: per kategori, wilayah, rentang waktu
- Perbandingan rute: rasio pilihan "rute aman" vs "rute tercepat", selisih rata-rata waktu tempuh
- Breakdown insiden per jam (validasi pola jam rawan)
- Top 5–10 wilayah paling rawan (data terkini)
- Export ke CSV/Excel untuk kepolisian/pemkot

## 6. Manajemen Konten Master

- CRUD kategori insiden (begal, curas, minim penerangan, dll) — nama, ikon, severity default
- Setting threshold skor risiko untuk label "Aman" / "Waspada" / "Berisiko" (konfigurable, bukan hardcode)
- Setting parameter default DBSCAN (`eps`, `min_samples`) sebagai konfigurasi sistem

## 7. Audit Log

- Log semua aksi admin: siapa, aksi apa, timestamp, before-after value
- Filter by admin, tipe aksi, rentang tanggal
- Read-only — tidak bisa dihapus, untuk akuntabilitas

## 8. Manajemen Wilayah/Zona Operasional

- CRUD zona operasional: nama, boundary polygon, status aktif/nonaktif
- Setting coverage awal sesuai target SOM (mis. Jabodetabek)
- Geofence check: tolak request rute di luar zona aktif
- Status rollout per zona: pilot / expansion planned / live

## 9. Moderasi Konten Laporan

- Antrian review konten (foto, teks) terpisah dari verifikasi validitas laporan
- Flag otomatis: kata kunci ofensif, foto bermasalah
- Aksi blur/redact identitas korban sebelum insiden tampil di peta publik
- Approve/reject konten independen dari status laporan

## 10. Manajemen Integrasi Eksternal

- Konfigurasi koneksi data kepolisian (endpoint/format, jadwal sync)
- Log sinkronisasi: waktu, jumlah record, status, error detail
- Manajemen API key/partner (mis. platform ojol) dengan rate limit per partner
- Mapping field data eksternal ke skema internal sebelum import

## 11. Konfigurasi Notifikasi Real-Time

- Setting radius trigger notifikasi area rawan
- Setting jam aktif notifikasi (default 00.00–04.59, konfigurable per zona)
- Template pesan per level risiko
- Preview & test notifikasi sebelum publish

## 12. Sistem Monitoring & Job Queue

- Dashboard status job: DBSCAN, training Random Forest, sync eksternal (running/success/failed, durasi)
- Alert otomatis saat job gagal
- Metric performa A*: response time rata-rata, request/menit, error rate
- Log trigger manual vs scheduled

## 13. Feedback Loop Rute

- Rating pasca-perjalanan: "rute ini beneran aman?" + komentar opsional
- List feedback dengan filter by rute / skor rendah
- Korelasi feedback negatif vs skor prediksi (sinyal untuk retrain/investigasi)
- Feedback masuk sebagai data tambahan training Random Forest berikutnya

## 14. Data Export & Kepatuhan Privasi

- Export data agregat (bukan data personal) untuk kepolisian/pemkot
- Setting retensi data (mis. anonimisasi identitas pelapor setelah 6 bulan)
- Log akses data sensitif (siapa export/lihat data mentah)
- Consent tracking: persetujuan user atas penggunaan data laporan untuk clustering/training

---

## 15. Rekomendasi Prioritas MVP

Untuk penyisihan (target progres 75%), tidak semua modul wajib fungsional penuh — cukup tampak dalam ERD/use case sebagai bukti sistem dipikirkan end-to-end.

**Wajib jalan (MVP):**
- Modul 1 — Manajemen Laporan Insiden
- Modul 2 — Dashboard Peta Klaster
- Modul 3 — Panel Model & Risk Scoring (minimal tampilan skor + retrain manual)
- Modul 4 — Manajemen User (dasar: list, role, ban)
- Modul 5 — Panel Statistik & Analytics (dasar)

**Cukup di-sebut di dokumen/roadmap (bukan prioritas coding):**
- Modul 8, 10, 11, 12 — butuh integrasi eksternal atau infrastruktur monitoring yang berat untuk skala prototype
- Modul 13, 14 — relevan untuk pengembangan lanjutan, cocok masuk ke bagian Saran (5.2) di proposal

**Wajib ada minimal sebagai kontrol dasar (murah tapi penting untuk kredibilitas):**
- Modul 6 — Manajemen Konten Master (threshold & kategori)
- Modul 7 — Audit Log (log sederhana cukup)
- Modul 9 — Moderasi Konten Laporan (minimal: approve/reject konten manual)