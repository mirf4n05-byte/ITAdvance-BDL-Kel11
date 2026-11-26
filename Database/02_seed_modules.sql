-- 1. Materi Programming
INSERT INTO LEARNING_MODULES
(TITLE, FIELD, SKILL_LEVEL, STEP_ORDER, ESTIMATED_HOURS, DESCRIPTION)
VALUES
('Pengenalan Pemrograman',
 'Programming', 'Pemula', 1, 3,
 'Mempelajari dasar-dasar pemrograman dan algoritma.');

INSERT INTO LEARNING_MODULES
(TITLE, FIELD, SKILL_LEVEL, STEP_ORDER, ESTIMATED_HOURS, DESCRIPTION)
VALUES
('Dasar Bahasa Java',
 'Programming', 'Pemula', 2, 5,
 'Mempelajari variabel, tipe data, kondisi, dan perulangan Java.');

INSERT INTO LEARNING_MODULES
(TITLE, FIELD, SKILL_LEVEL, STEP_ORDER, ESTIMATED_HOURS, DESCRIPTION)
VALUES
('Dasar Bahasa Python',
 'Programming', 'Pemula', 3, 5,
 'Mempelajari sintaks dasar dan struktur program Python.');

-- 2. Materi Web Development
INSERT INTO LEARNING_MODULES
(TITLE, FIELD, SKILL_LEVEL, STEP_ORDER, ESTIMATED_HOURS, DESCRIPTION)
VALUES
('Pengenalan HTML',
 'Web Development', 'Pemula', 1, 3,
 'Mempelajari struktur dasar halaman web menggunakan HTML.');

INSERT INTO LEARNING_MODULES
(TITLE, FIELD, SKILL_LEVEL, STEP_ORDER, ESTIMATED_HOURS, DESCRIPTION)
VALUES
('Dasar CSS',
 'Web Development', 'Pemula', 2, 4,
 'Mempelajari cara mengatur tampilan halaman web menggunakan CSS.');

-- 3. Materi Database
INSERT INTO LEARNING_MODULES
(TITLE, FIELD, SKILL_LEVEL, STEP_ORDER, ESTIMATED_HOURS, DESCRIPTION)
VALUES
('Pengenalan Database',
 'Database', 'Pemula', 1, 3,
 'Mempelajari konsep database, tabel, baris, dan kolom.');

INSERT INTO LEARNING_MODULES
(TITLE, FIELD, SKILL_LEVEL, STEP_ORDER, ESTIMATED_HOURS, DESCRIPTION)
VALUES
('Dasar SQL',
 'Database', 'Pemula', 2, 5,
 'Mempelajari perintah SQL untuk mengelola data.');

-- 4. Materi UI/UX Design
INSERT INTO LEARNING_MODULES
(TITLE, FIELD, SKILL_LEVEL, STEP_ORDER, ESTIMATED_HOURS, DESCRIPTION)
VALUES
('Pengenalan UI/UX Design',
 'UI/UX Design', 'Pemula', 1, 3,
 'Mempelajari dasar desain antarmuka dan pengalaman pengguna.');

INSERT INTO LEARNING_MODULES
(TITLE, FIELD, SKILL_LEVEL, STEP_ORDER, ESTIMATED_HOURS, DESCRIPTION)
VALUES
('Dasar Penggunaan Figma',
 'UI/UX Design', 'Pemula', 2, 4,
 'Mempelajari pembuatan desain dan prototype menggunakan Figma.');

COMMIT;
