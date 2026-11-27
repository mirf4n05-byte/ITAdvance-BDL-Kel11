const { executeQuery } = require('../../Database/db');

// Helper menghitung streak berturut-turut dari riwayat tanggal check-in
function calculateStreak(rows) {
    if (rows.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Cek apakah check-in terbaru hari ini atau kemarin
    const latestDate = new Date(rows[0].TGL_STR + 'T00:00:00');
    const diffFromToday = Math.round((today - latestDate) / (1000 * 60 * 60 * 24));

    if (diffFromToday > 1) return 0; // Streak terputus jika bolos lebih dari 1 hari

    let expectedDate = new Date(latestDate);
    for (const row of rows) {
        const rowDate = new Date(row.TGL_STR + 'T00:00:00');
        if (rowDate.getTime() === expectedDate.getTime()) {
            streak++;
            expectedDate.setDate(expectedDate.getDate() - 1);
        } else {
            break;
        }
    }
    return streak;
}

// GET /api/checkin/status -> Cek status check-in hari ini & jumlah streak
const getCheckinStatus = async (req, res) => {
    try {
        const todayCheck = await executeQuery(
            `SELECT id_checkin, catatan, TO_CHAR(tanggal, 'YYYY-MM-DD') AS tanggal
       FROM checkin_harian
       WHERE id_pengguna = :id_pengguna AND TRUNC(tanggal) = TRUNC(SYSDATE)`,
            { id_pengguna: req.user.id_pengguna }
        );

        const history = await executeQuery(
            `SELECT DISTINCT TO_CHAR(tanggal, 'YYYY-MM-DD') AS tgl_str
       FROM checkin_harian
       WHERE id_pengguna = :id_pengguna
       ORDER BY tgl_str DESC`,
            { id_pengguna: req.user.id_pengguna }
        );

        const streak = calculateStreak(history.rows);

        res.status(200).json({
            checked_in_today: todayCheck.rows.length > 0,
            streak_count: streak,
            total_checkins: history.rows.length,
            today_data: todayCheck.rows[0] || null
        });
    } catch (err) {
        console.error('GetCheckinStatus error:', err);
        res.status(500).json({ message: 'Gagal memeriksa status check-in.', error: err.message });
    }
};

// POST /api/checkin -> Klaim check-in harian (maksimal 1x/hari)
const doCheckin = async (req, res) => {
    const { catatan } = req.body;

    try {
        // Validasi 1x sehari
        const existingToday = await executeQuery(
            `SELECT id_checkin FROM checkin_harian 
       WHERE id_pengguna = :id_pengguna AND TRUNC(tanggal) = TRUNC(SYSDATE)`,
            { id_pengguna: req.user.id_pengguna }
        );

        if (existingToday.rows.length > 0) {
            return res.status(409).json({
                message: 'Kamu sudah melakukan check-in hari ini. Kembali lagi besok!'
            });
        }

        await executeQuery(
            `INSERT INTO checkin_harian (id_pengguna, catatan)
       VALUES (:id_pengguna, :catatan)`,
            {
                id_pengguna: req.user.id_pengguna,
                catatan: catatan || 'Konsisten belajar hari ini!'
            }
        );

        const history = await executeQuery(
            `SELECT DISTINCT TO_CHAR(tanggal, 'YYYY-MM-DD') AS tgl_str
       FROM checkin_harian
       WHERE id_pengguna = :id_pengguna
       ORDER BY tgl_str DESC`,
            { id_pengguna: req.user.id_pengguna }
        );

        const newStreak = calculateStreak(history.rows);

        res.status(201).json({
            message: 'Check-in harian berhasil!',
            streak_count: newStreak
        });
    } catch (err) {
        console.error('DoCheckin error:', err);
        res.status(500).json({ message: 'Gagal melakukan check-in harian.', error: err.message });
    }
};

module.exports = { getCheckinStatus, doCheckin };