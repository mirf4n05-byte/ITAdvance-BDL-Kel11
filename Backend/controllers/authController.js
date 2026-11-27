const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const oracledb = require('oracledb');
const { executeQuery } = require('../../Database/db');

// POST /api/auth/register
const register = async (req, res) => {
    const { nama_lengkap, email, password } = req.body;

    if (!nama_lengkap || !email || !password) {
        return res.status(400).json({ message: 'Nama lengkap, email, dan password wajib diisi.' });
    }

    try {
        const checkUser = await executeQuery(
            `SELECT id_pengguna FROM pengguna WHERE LOWER(email) = LOWER(:email)`,
            { email }
        );

        if (checkUser.rows.length > 0) {
            return res.status(409).json({ message: 'Email sudah terdaftar.' });
        }

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const insertResult = await executeQuery(
            `INSERT INTO pengguna (nama_lengkap, email, password_hash) 
       VALUES (:nama_lengkap, :email, :password_hash)
       RETURNING id_pengguna INTO :id`,
            {
                nama_lengkap,
                email,
                password_hash,
                id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
            }
        );

        const newId = insertResult.outBinds.id[0];

        res.status(201).json({
            message: 'Registrasi berhasil.',
            user: { id_pengguna: newId, nama_lengkap, email }
        });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ message: 'Terjadi kesalahan pada server.', error: err.message });
    }
};

// POST /api/auth/login
const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email dan password wajib diisi.' });
    }

    try {
        const result = await executeQuery(
            `SELECT id_pengguna, nama_lengkap, email, password_hash FROM pengguna WHERE LOWER(email) = LOWER(:email)`,
            { email }
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Email atau password salah.' });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.PASSWORD_HASH);

        if (!isMatch) {
            return res.status(401).json({ message: 'Email atau password salah.' });
        }

        const token = jwt.sign(
            { id_pengguna: user.ID_PENGGUNA, email: user.EMAIL },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: 'Login berhasil.',
            token,
            user: {
                id_pengguna: user.ID_PENGGUNA,
                nama_lengkap: user.NAMA_LENGKAP,
                email: user.EMAIL
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Terjadi kesalahan pada server.', error: err.message });
    }
};

// GET /api/auth/me
const getMe = async (req, res) => {
    try {
        const result = await executeQuery(
            `SELECT id_pengguna, nama_lengkap, email FROM pengguna WHERE id_pengguna = :id_pengguna`,
            { id_pengguna: req.user.id_pengguna }
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
        }

        res.status(200).json({ user: result.rows[0] });
    } catch (err) {
        console.error('GetMe error:', err);
        res.status(500).json({ message: 'Terjadi kesalahan pada server.', error: err.message });
    }
};

module.exports = { register, login, getMe };