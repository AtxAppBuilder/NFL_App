const express = require('express');

const { getAllTeams } = require('../controllers/teamController');

const router = express.Router();

router.get('/', getAllTeams);

module.exports = router;