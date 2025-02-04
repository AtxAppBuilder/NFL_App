const fs = require('fs');
const pool = require('../config/db');
require('dotenv').config();


async function migratePlayers() {
    try {
      // 📌 Read JSON file
      const data = JSON.parse(fs.readFileSync("/mnt/c/nfl_stats/backend/data/players_2024.json", "utf8"));
  
      for (const player of data) {
        // 🔹 Convert height to inches (if needed)
        const heightInInches = player.height
          ? player.height.split("' ").reduce((ft, inch) => ft * 12 + parseInt(inch), 0)
          : null;
  
        // 🔹 Convert experience to number (if possible)
        const experience = parseInt(player.experience) || null;
  
        // 📌 Get team_id from `teams` table using team abbreviation
        const teamRes = await pool.query(
          "SELECT team_id FROM teams WHERE abbreviation = $1",
          [player.team.abbreviation]
        );
        const team_id = teamRes.rows.length > 0 ? teamRes.rows[0].team_id : null;
  
        // 📌 Insert player into `players` table
        const query = `
          INSERT INTO players (first_name, last_name, position, position_abbreviation, height, weight, jersey_number, college, experience, age, team_id) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          ON CONFLICT (player_id) DO NOTHING
        `;
  
        await pool.query(query, [
          player.first_name,
          player.last_name,
          player.position,
          player.position_abbreviation,
          heightInInches, // Storing height in inches
          player.weight ? parseInt(player.weight) : null, // Remove " lbs" and convert to INT
          player.jersey_number || null,
          player.college,
          experience,
          player.age,
          team_id,
        ]);
  
        console.log(`Inserted player: ${player.first_name} ${player.last_name}`);
      }
    } catch (error) {
      console.error("Error inserting players:", error);
    } finally {
      pool.end();
    }
  }
  
  // Run migration
  migratePlayers();