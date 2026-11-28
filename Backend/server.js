const path = require('path');
const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const { initializeDB, closeDB } = require('../Database/db');
const authRoutes = require('./routes/authRoutes');
const profilRoutes = require('./routes/profilRoutes');
const checkinRoutes = require('./routes/checkinRoutes');
const jadwalRoutes = require('./routes/jadwalRoutes');
const pengingatRoutes = require('./routes/pengingatRoutes');
const karierRoutes = require('./routes/karierRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'ITAdvance API berjalan di port ' + PORT });
});

// Seluruh Routes Utama
app.use('/api/auth', authRoutes);
app.use('/api/profil', profilRoutes);
app.use('/api/checkin', checkinRoutes);
app.use('/api/jadwal', jadwalRoutes);
app.use('/api/pengingat', pengingatRoutes);
app.use('/api/karier', karierRoutes);

initializeDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server ITAdvance berjalan di http://localhost:${PORT}`);
    });
});

process.on('SIGINT', async () => {
    await closeDB();
    process.exit(0);
});