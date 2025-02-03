const express = require('express');
const { getAllPlayers } = require('../controllers/playerController');

const router = express.Router();

router.get('/', getAllPlayers);

module.exports = router;