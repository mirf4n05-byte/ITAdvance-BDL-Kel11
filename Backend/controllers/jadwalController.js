const oracledb = require('oracledb');
const { executeQuery } = require('../../Database/db');

// POST /api/jadwal/generate -> Susun jadwal belajar otomatis dari profil & tabel materi
const generateJadwal = async (req, res) => {
    const id_pengguna = req.user.id_pengguna;

    try {
        // 1. Ambil preferensi belajar pengguna
        const profilRes = await executeQuery(
            `SELECT tingkat_awal, jam_belajar_harian, waktu_pilihan, cita_cita_karier
       FROM profil_pengguna
       WHERE id_pengguna = :id_pengguna`,
            { id_pengguna }
        );

        if (profilRes.rows.length === 0) {
            return res.status(400).json({
                message: 'Profil belum diisi. Lengkapi profil dan cita-cita karier terlebih dahulu.'
            });
        }

        const profil = profilRes.rows[0];
        const jamHarian = Number(profil.JAM_BELAJAR_HARIAN) || 2;
        const targetKarier = profil.CITA_CITA_KARIER;

        // 2. Ambil daftar materi sesuai bidang karier (urut berdasarkan urutan kurikulum)
        let materiRes = await executeQuery(
            `SELECT m.id_materi, m.judul_materi, m.tingkat, m.estimasi_jam, m.urutan
       FROM materi m
       JOIN bidang_it b ON m.id_bidang = b.id_bidang
       WHERE LOWER(b.nama_bidang) LIKE LOWER(:karier)
       ORDER BY m.urutan ASC, m.id_materi ASC`,
            { karier: `%${targetKarier}%` }
        );

        // Fallback jika nama bidang belum persis sama agar demo tetap berjalan
        if (materiRes.rows.length === 0) {
            materiRes = await executeQuery(
                `SELECT id_materi, judul_materi, tingkat, estimasi_jam, urutan
         FROM materi
         ORDER BY urutan ASC, id_materi ASC`
            );
        }

        if (materiRes.rows.length === 0) {
            return res.status(404).json({
                message: 'Data master materi masih kosong. Pastikan tabel MATERI sudah diisi.'
            });
        }

        // 3. Hapus jadwal lama yang masih TERJADWAL (pertahankan yang sudah SELESAI)
        await executeQuery(
            `DELETE FROM jadwal_belajar WHERE id_pengguna = :id_pengguna AND status = 'TERJADWAL'`,
            { id_pengguna }
        );

        // 4. Algoritma pemecahan estimasi jam materi ke sesi harian mulai besok
        const jadwalTerbentuk = [];
        let hariKe = 1;

        for (const m of materiRes.rows) {
            let sisaJam = Number(m.ESTIMASI_JAM) || jamHarian;

            while (sisaJam > 0) {
                const durasiSesi = Math.min(sisaJam, jamHarian);
                const tanggalTarget = new Date();
                tanggalTarget.setDate(tanggalTarget.getDate() + hariKe);
                const tglStr = tanggalTarget.toISOString().split('T')[0];

                const insertRes = await executeQuery(
                    `INSERT INTO jadwal_belajar (id_pengguna, id_materi, tanggal_jadwal, durasi_jam, status)
           VALUES (:id_pengguna, :id_materi, TO_DATE(:tgl, 'YYYY-MM-DD'), :durasi_jam, 'TERJADWAL')
           RETURNING id_jadwal INTO :id`,
                    {
                        id_pengguna,
                        id_materi: m.ID_MATERI,
                        tgl: tglStr,
                        durasi_jam: durasiSesi,
                        id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
                    }
                );

                jadwalTerbentuk.push({
                    id_jadwal: insertRes.outBinds.id[0],
                    judul_materi: m.JUDUL_MATERI,
                    tanggal_jadwal: tglStr,
                    durasi_jam: durasiSesi,
                    status: 'TERJADWAL'
                });

                sisaJam -= durasiSesi;
                hariKe++;
            }
        }

        res.status(201).json({
            message: 'Jadwal belajar otomatis berhasil dibuat.',
            total_sesi: jadwalTerbentuk.length,
            jadwal: jadwalTerbentuk
        });
    } catch (err) {
        console.error('GenerateJadwal error:', err);
        res.status(500).json({ message: 'Gagal membuat jadwal belajar.', error: err.message });
    }
};

// GET /api/jadwal -> Ambil seluruh daftar jadwal belajar user
const getJadwal = async (req, res) => {
    try {
        const result = await executeQuery(
            `SELECT j.id_jadwal, m.judul_materi, m.tingkat,
              TO_CHAR(j.tanggal_jadwal, 'YYYY-MM-DD') AS tanggal_jadwal,
              j.durasi_jam, j.status
       FROM jadwal_belajar j
       JOIN materi m ON j.id_materi = m.id_materi
       WHERE j.id_pengguna = :id_pengguna
       ORDER BY j.tanggal_jadwal ASC, j.id_jadwal ASC`,
            { id_pengguna: req.user.id_pengguna }
        );

        res.status(200).json({ jadwal: result.rows });
    } catch (err) {
        console.error('GetJadwal error:', err);
        res.status(500).json({ message: 'Gagal mengambil jadwal belajar.', error: err.message });
    }
};

// PATCH /api/jadwal/:id/selesai -> Tandai sesi selesai & simpan catatan ke hasil_belajar
const selesaikanJadwal = async (req, res) => {
    const id_jadwal = Number(req.params.id);
    const { catatan_hasil } = req.body;
    const id_pengguna = req.user.id_pengguna;

    try {
        const cek = await executeQuery(
            `SELECT id_jadwal, status FROM jadwal_belajar WHERE id_jadwal = :id_jadwal AND id_pengguna = :id_pengguna`,
            { id_jadwal, id_pengguna }
        );

        if (cek.rows.length === 0) {
            return res.status(404).json({ message: 'Jadwal tidak ditemukan.' });
        }

        await executeQuery(
            `UPDATE jadwal_belajar SET status = 'SELESAI' WHERE id_jadwal = :id_jadwal`,
            { id_jadwal }
        );

        await executeQuery(
            `INSERT INTO hasil_belajar (id_jadwal, id_pengguna, catatan_hasil)
       VALUES (:id_jadwal, :id_pengguna, :catatan_hasil)`,
            {
                id_jadwal,
                id_pengguna,
                catatan_hasil: catatan_hasil || 'Sesi belajar diselesaikan.'
            }
        );

        res.status(200).json({
            message: 'Sesi belajar ditandai selesai dan dicatat ke hasil belajar.'
        });
    } catch (err) {
        console.error('SelesaikanJadwal error:', err);
        res.status(500).json({ message: 'Gagal menyelesaikan sesi belajar.', error: err.message });
    }
};

module.exports = { generateJadwal, getJadwal, selesaikanJadwal };