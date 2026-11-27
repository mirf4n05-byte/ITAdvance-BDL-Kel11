const path = require('path');
const oracledb = require('oracledb');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.autoCommit = true;

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING,
    poolMin: 2,
    poolMax: 10,
    poolIncrement: 1
};

async function initializeDB() {
    try {
        await oracledb.createPool(dbConfig);
        console.log('✅ Connection pool Oracle XE berhasil dibuat.');
    } catch (err) {
        console.error('❌ Gagal membuat connection pool Oracle XE:', err.message);
        process.exit(1);
    }
}

async function closeDB() {
    try {
        await oracledb.getPool().close(10);
        console.log('🔌 Connection pool Oracle XE ditutup.');
    } catch (err) {
        console.error('Error menutup pool:', err.message);
    }
}

async function executeQuery(sql, binds = [], options = {}) {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(sql, binds, options);
        return result;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error menutup koneksi:', err.message);
            }
        }
    }
}

module.exports = { initializeDB, closeDB, executeQuery };