const { executeQuery } = require('../../Database/db');

// GET /api/pengingat -> Ambil daftar pengingat harian user
const getPengingat = async (req, res) => {
    try {
        const result = await executeQuery(
            `SELECT id_pengingat, pesan, waktu_pengingat, status
       FROM pengingat
       WHERE id_pengguna = :id_pengguna
       ORDER BY waktu_pengingat ASC, id_pengingat ASC`,
            { id_pengguna: req.user.id_pengguna }
        );

        res.status(200).json({ pengingat: result.rows });
    } catch (err) {
        console.error('GetPengingat error:', err);
        res.status(500).json({ message: 'Gagal mengambil daftar pengingat.', error: err.message });
    }
};

// POST /api/pengingat -> Tambah pengingat harian baru
const createPengingat = async (req, res) => {
    const { pesan, waktu_pengingat } = req.body;

    if (!pesan || !waktu_pengingat) {
        return res.status(400).json({ message: 'Pesan dan waktu pengingat (HH:MM) wajib diisi.' });
    }

    try {
        await executeQuery(
            `INSERT INTO pengingat (id_pengguna, pesan, waktu_pengingat, status)
       VALUES (:id_pengguna, :pesan, :waktu_pengingat, 'AKTIF')`,
            {
                id_pengguna: req.user.id_pengguna,
                pesan,
                waktu_pengingat
            }
        );

        res.status(201).json({ message: 'Pengingat berhasil ditambahkan.' });
    } catch (err) {
        console.error('CreatePengingat error:', err);
        res.status(500).json({ message: 'Gagal menambahkan pengingat.', error: err.message });
    }
};

module.exports = { getPengingat, createPengingat };