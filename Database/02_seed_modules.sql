-- 1. Mengisi data bidang IT
INSERT INTO bidang_it (id_bidang, nama_bidang, deskripsi)
VALUES (1, 'Programming', 'Bidang yang mempelajari bahasa pemrograman.');

INSERT INTO bidang_it (id_bidang, nama_bidang, deskripsi)
VALUES (2, 'Web Development', 'Bidang pengembangan website.');

INSERT INTO bidang_it (id_bidang, nama_bidang, deskripsi)
VALUES (3, 'Database', 'Bidang pengelolaan dan penyimpanan data.');

INSERT INTO bidang_it (id_bidang, nama_bidang, deskripsi)
VALUES (4, 'UI/UX Design', 'Bidang desain antarmuka dan pengalaman pengguna.');


-- 2. Materi Programming
INSERT INTO materi
(id_materi, id_bidang, judul_materi, tingkat, estimasi_jam, urutan, deskripsi)
VALUES
(1, 1, 'Pengenalan Pemrograman', 'Pemula', 3, 1,
 'Mempelajari dasar-dasar pemrograman dan algoritma.');

INSERT INTO materi
(id_materi, id_bidang, judul_materi, tingkat, estimasi_jam, urutan, deskripsi)
VALUES
(2, 1, 'Dasar Bahasa Java', 'Pemula', 5, 2,
 'Mempelajari variabel, tipe data, kondisi, dan perulangan Java.');

INSERT INTO materi
(id_materi, id_bidang, judul_materi, tingkat, estimasi_jam, urutan, deskripsi)
VALUES
(3, 1, 'Dasar Bahasa Python', 'Pemula', 5, 3,
 'Mempelajari sintaks dasar dan struktur program Python.');


-- 3. Materi Web Development
INSERT INTO materi
(id_materi, id_bidang, judul_materi, tingkat, estimasi_jam, urutan, deskripsi)
VALUES
(4, 2, 'Pengenalan HTML', 'Pemula', 3, 1,
 'Mempelajari struktur dasar halaman web menggunakan HTML.');

INSERT INTO materi
(id_materi, id_bidang, judul_materi, tingkat, estimasi_jam, urutan, deskripsi)
VALUES
(5, 2, 'Dasar CSS', 'Pemula', 4, 2,
 'Mempelajari cara mengatur tampilan halaman web menggunakan CSS.');


-- 4. Materi Database
INSERT INTO materi
(id_materi, id_bidang, judul_materi, tingkat, estimasi_jam, urutan, deskripsi)
VALUES
(6, 3, 'Pengenalan Database', 'Pemula', 3, 1,
 'Mempelajari konsep database, tabel, baris, dan kolom.');

INSERT INTO materi
(id_materi, id_bidang, judul_materi, tingkat, estimasi_jam, urutan, deskripsi)
VALUES
(7, 3, 'Dasar SQL', 'Pemula', 5, 2,
 'Mempelajari perintah SQL untuk mengelola data.');


-- 5. Materi UI/UX Design
INSERT INTO materi
(id_materi, id_bidang, judul_materi, tingkat, estimasi_jam, urutan, deskripsi)
VALUES
(8, 4, 'Pengenalan UI/UX Design', 'Pemula', 3, 1,
 'Mempelajari dasar desain antarmuka dan pengalaman pengguna.');

INSERT INTO materi
(id_materi, id_bidang, judul_materi, tingkat, estimasi_jam, urutan, deskripsi)
VALUES
(9, 4, 'Dasar Penggunaan Figma', 'Pemula', 4, 2,
 'Mempelajari pembuatan desain dan prototype menggunakan Figma.');

COMMIT;
