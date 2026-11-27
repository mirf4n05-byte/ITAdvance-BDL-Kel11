const express = require('express');
const router = express.Router();
const { getBidangIT, getProfil, saveProfil } = require('../controllers/profilController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/bidang', getBidangIT);
router.get('/', verifyToken, getProfil);
router.post('/', verifyToken, saveProfil);
router.put('/', verifyToken, saveProfil);

module.exports = router;
