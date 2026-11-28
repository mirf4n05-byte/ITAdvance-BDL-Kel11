const { executeQuery } = require('../../Database/db');

// GET /api/karier/roadmap -> Ambil checklist karier (auto-generate jika user baru)
const getRoadmap = async (req, res) => {
    const id_pengguna = req.user.id_pengguna;

    try {
        let result = await executeQuery(
            `SELECT id_langkah, judul_langkah, kategori, status
       FROM langkah_karier
       WHERE id_pengguna = :id_pengguna
       ORDER BY id_langkah ASC`,
            { id_pengguna }
        );

        // Jika belum punya roadmap, buatkan otomatis sesuai cita-cita karier di profil
        if (result.rows.length === 0) {
            const profilRes = await executeQuery(
                `SELECT cita_cita_karier FROM profil_pengguna WHERE id_pengguna = :id_pengguna`,
                { id_pengguna }
            );

            const karier = profilRes.rows[0]?.CITA_CITA_KARIER || 'IT Specialist';

            const langkahDefault = [
                {
                    judul: `Optimasi Headline & Ringkasan LinkedIn untuk peran ${karier}`,
                    kategori: 'LINKEDIN'
                },
                {
                    judul: 'Tautkan URL Profil LinkedIn & GitHub ke Portofolio Pribadi',
                    kategori: 'LINKEDIN'
                },
                {
                    judul: `Selesaikan seluruh modul dasar kurikulum ${karier}`,
                    kategori: 'SKILL'
                },
                {
                    judul: `Bangun & publikasikan minimal 1 proyek portofolio ${karier} di GitHub`,
                    kategori: 'PORTOFOLIO'
                },
                {
                    judul: `Unggah studi kasus proyek ${karier} ke bagian Featured LinkedIn`,
                    kategori: 'PORTOFOLIO'
                }
            ];

            for (const item of langkahDefault) {
                await executeQuery(
                    `INSERT INTO langkah_karier (id_pengguna, judul_langkah, kategori, status)
           VALUES (:id_pengguna, :judul_langkah, :kategori, 'BELUM')`,
                    {
                        id_pengguna,
                        judul_langkah: item.judul,
                        kategori: item.kategori
                    }
                );
            }

            result = await executeQuery(
                `SELECT id_langkah, judul_langkah, kategori, status
         FROM langkah_karier
         WHERE id_pengguna = :id_pengguna
         ORDER BY id_langkah ASC`,
                { id_pengguna }
            );
        }

        res.status(200).json({ roadmap: result.rows });
    } catch (err) {
        console.error('GetRoadmap error:', err);
        res.status(500).json({ message: 'Gagal mengambil career roadmap.', error: err.message });
    }
};

// PATCH /api/karier/:id/status -> Update status checklist langkah karier (BELUM / SELESAI)
const updateStatusLangkah = async (req, res) => {
    const id_langkah = Number(req.params.id);
    const { status } = req.body;

    if (!status || !['BELUM', 'SELESAI'].includes(status.toUpperCase())) {
        return res.status(400).json({ message: 'Status harus berupa BELUM atau SELESAI.' });
    }

    try {
        const cek = await executeQuery(
            `SELECT id_langkah FROM langkah_karier WHERE id_langkah = :id_langkah AND id_pengguna = :id_pengguna`,
            { id_langkah, id_pengguna: req.user.id_pengguna }
        );

        if (cek.rows.length === 0) {
            return res.status(404).json({ message: 'Langkah karier tidak ditemukan.' });
        }

        await executeQuery(
            `UPDATE langkah_karier SET status = :status WHERE id_langkah = :id_langkah`,
            { status: status.toUpperCase(), id_langkah }
        );

        res.status(200).json({ message: 'Status langkah karier berhasil diperbarui.' });
    } catch (err) {
        console.error('UpdateStatusLangkah error:', err);
        res.status(500).json({ message: 'Gagal memperbarui status langkah karier.', error: err.message });
    }
};

module.exports = { getRoadmap, updateStatusLangkah };