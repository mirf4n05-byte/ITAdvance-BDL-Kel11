const { executeQuery } = require('../../Database/db');

// GET /api/profil/bidang -> Ambil daftar bidang IT untuk dropdown Frontend
const getBidangIT = async (req, res) => {
    try {
        const result = await executeQuery(
            `SELECT id_bidang, nama_bidang, deskripsi FROM bidang_it ORDER BY id_bidang ASC`
        );
        res.status(200).json({ bidang: result.rows });
    } catch (err) {
        console.error('GetBidangIT error:', err);
        res.status(500).json({ message: 'Gagal mengambil data bidang IT.', error: err.message });
    }
};

// GET /api/profil -> Ambil profil & preferensi belajar user aktif
const getProfil = async (req, res) => {
    try {
        const result = await executeQuery(
            `SELECT id_pengguna, universitas, jurusan, semester, 
              TO_CHAR(target_lulus, 'YYYY-MM-DD') AS target_lulus,
              tingkat_awal, jam_belajar_harian, waktu_pilihan, cita_cita_karier
       FROM profil_pengguna 
       WHERE id_pengguna = :id_pengguna`,
            { id_pengguna: req.user.id_pengguna }
        );

        if (result.rows.length === 0) {
            return res.status(200).json({ has_profil: false, profil: null });
        }

        res.status(200).json({ has_profil: true, profil: result.rows[0] });
    } catch (err) {
        console.error('GetProfil error:', err);
        res.status(500).json({ message: 'Gagal mengambil profil pengguna.', error: err.message });
    }
};

// POST atau PUT /api/profil -> Simpan atau perbarui profil & preferensi belajar
const saveProfil = async (req, res) => {
    const {
        universitas,
        jurusan,
        semester,
        target_lulus,
        tingkat_awal,
        jam_belajar_harian,
        waktu_pilihan,
        cita_cita_karier
    } = req.body;

    if (!tingkat_awal || !jam_belajar_harian || !waktu_pilihan || !cita_cita_karier) {
        return res.status(400).json({
            message: 'Tingkat awal, jam belajar harian, waktu pilihan, dan cita-cita karier wajib diisi.'
        });
    }

    try {
        const existing = await executeQuery(
            `SELECT id_pengguna FROM profil_pengguna WHERE id_pengguna = :id_pengguna`,
            { id_pengguna: req.user.id_pengguna }
        );

        const binds = {
            id_pengguna: req.user.id_pengguna,
            universitas: universitas || null,
            jurusan: jurusan || null,
            semester: semester ? Number(semester) : null,
            target_lulus: target_lulus || null,
            tingkat_awal,
            jam_belajar_harian: Number(jam_belajar_harian),
            waktu_pilihan,
            cita_cita_karier
        };

        if (existing.rows.length > 0) {
            await executeQuery(
                `UPDATE profil_pengguna 
         SET universitas = :universitas,
             jurusan = :jurusan,
             semester = :semester,
             target_lulus = TO_DATE(:target_lulus, 'YYYY-MM-DD'),
             tingkat_awal = :tingkat_awal,
             jam_belajar_harian = :jam_belajar_harian,
             waktu_pilihan = :waktu_pilihan,
             cita_cita_karier = :cita_cita_karier
         WHERE id_pengguna = :id_pengguna`,
                binds
            );

            return res.status(200).json({ message: 'Profil dan preferensi berhasil diperbarui.' });
        }

        await executeQuery(
            `INSERT INTO profil_pengguna (
        id_pengguna, universitas, jurusan, semester, target_lulus,
        tingkat_awal, jam_belajar_harian, waktu_pilihan, cita_cita_karier
      ) VALUES (
        :id_pengguna, :universitas, :jurusan, :semester, TO_DATE(:target_lulus, 'YYYY-MM-DD'),
        :tingkat_awal, :jam_belajar_harian, :waktu_pilihan, :cita_cita_karier
      )`,
            binds
        );

        res.status(201).json({ message: 'Profil dan preferensi berhasil disimpan.' });
    } catch (err) {
        console.error('SaveProfil error:', err);
        res.status(500).json({ message: 'Gagal menyimpan profil pengguna.', error: err.message });
    }
};

module.exports = { getBidangIT, getProfil, saveProfil };