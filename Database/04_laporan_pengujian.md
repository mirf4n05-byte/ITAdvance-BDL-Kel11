
# LAPORAN PENGUJIAN DATABASE ITADVANCE-BDL

## 1. Pengujian Koneksi Database
- Database: Oracle XE
- Nama pengguna: ITADVANCE
- Hasil: Berhasil terhubung ke database.

## 2. Pengujian Struktur Tabel
- Jumlah tabel baru: 9 tabel
- Tabel yang dibuat:
  1. PENGGUNA
  2. PROFIL_PENGGUNA
  3. BIDANG_IT
  4. CHECKIN_HARIAN
  5. MATERI
  6. JADWAL_BELAJAR
  7. HASIL_BELAJAR
  8. PENGINGAT
  9. LANGKAH_KARIER
- Hasil: Berhasil dibuat dan terdeteksi di database.

## 3. Pengujian Data Bidang IT
- Tabel: BIDANG_IT
- Jumlah data: 4 bidang IT
- Hasil: Data berhasil dimasukkan.

## 4. Pengujian Data Materi
- Tabel: MATERI
- Jumlah data: 9 materi pembelajaran
- Hasil: Data berhasil dimasukkan.

## 5. Pengujian Relasi Antar Tabel
- Pengujian: Relasi foreign key pada tabel database baru.
- Hasil: Struktur foreign key telah didefinisikan dalam script SQL. Pengujian relasi melalui database masih perlu dilakukan.

## 6. Kesimpulan
Berdasarkan pengujian yang telah dilakukan, database ITAdvance-BDL menggunakan Oracle XE dengan 9 tabel baru. Sebanyak 4 data bidang IT dan 9 data materi pembelajaran telah berhasil dimasukkan. Pengujian relasi foreign key masih perlu diselesaikan untuk memastikan hubungan antar tabel berjalan dengan baik.
