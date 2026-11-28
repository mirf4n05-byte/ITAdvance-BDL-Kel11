const express = require('express');
const router = express.Router();
const { getRoadmap, updateStatusLangkah } = require('../controllers/karierController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/roadmap', verifyToken, getRoadmap);
router.patch('/:id/status', verifyToken, updateStatusLangkah);

module.exports = router;