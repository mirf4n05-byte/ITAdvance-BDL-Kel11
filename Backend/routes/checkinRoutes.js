const express = require('express');
const router = express.Router();
const { getCheckinStatus, doCheckin } = require('../controllers/checkinController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/status', verifyToken, getCheckinStatus);
router.post('/', verifyToken, doCheckin);

module.exports = router;