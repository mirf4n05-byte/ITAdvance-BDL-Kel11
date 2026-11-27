const path = require('path');
const oracledb = require('oracledb');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

async function testConnection() {
    let connection;
    try {
        console.log('⏳ Menghubungkan ke:', process.env.DB_CONNECT_STRING, 'sebagai user:', process.env.DB_USER);

        connection = await oracledb.getConnection({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectString: process.env.DB_CONNECT_STRING
        });

        const result = await connection.execute(
            `SELECT USER AS CONNECTED_USER, 'Koneksi Sukses!' AS STATUS FROM DUAL`
        );
        console.log('✅ Hasil:', result.rows[0]);
    } catch (err) {
        console.error('❌ Koneksi Gagal:', err.message);
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

// Wajib dipanggil agar fungsi berjalan
testConnection();