require('dotenv').config();
const cors = require('cors');
const morgan = require('morgan');
const express = require('express');



const playerRoutes = require('./routes/playerRoutes');
const authRoutes = require('./routes/authRoutes');
const seasonStatsRoute = require('./routes/seasonStatsRoute');
const teamsRoute = require('./routes/teamsRoute')
// const statsRoute = require('./routes/statsRoute')

// PostgreSQL connection
const pool = require('./config/db'); 

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/players', playerRoutes) 
app.use('/api/auth', authRoutes) 
app.use('/api/season_stats', seasonStatsRoute) 
app.use('/api/teams', teamsRoute)
// app.use('/api/stats', statsRoute)

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });