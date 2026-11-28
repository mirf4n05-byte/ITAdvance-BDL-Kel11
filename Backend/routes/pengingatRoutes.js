const express = require('express');
const router = express.Router();
const { getPengingat, createPengingat } = require('../controllers/pengingatController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/', verifyToken, getPengingat);
router.post('/', verifyToken, createPengingat);

module.exports = router;