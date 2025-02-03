const express = require('express');

const { getAllSeasonStats } = require('../controllers/seasonStatsController');

const router = express.Router();

router.get('/', getAllSeasonStats);

module.exports = router;