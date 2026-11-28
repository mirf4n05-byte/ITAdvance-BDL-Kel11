const express = require('express');
const router = express.Router();
const { generateJadwal, getJadwal, selesaikanJadwal } = require('../controllers/jadwalController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/generate', verifyToken, generateJadwal);
router.get('/', verifyToken, getJadwal);
router.patch('/:id/selesai', verifyToken, selesaikanJadwal);

module.exports = router;