const fs = require('fs');
const pool = require('../config/db');
require('dotenv').config();

const migrateTeams = async () => {
  const teamData = JSON.parse(fs.readFileSync('/mnt/c/nfl_stats/backend/data/teams_2024.json', 'utf-8'));
  
  const query = `
    INSERT INTO teams (conference, division, name, full_name, location, abbreviation) 
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (abbreviation) DO NOTHING
  `;

  for (const team of teamData) {
    try {
      await pool.query(query, [
        team.conference,
        team.division,
        team.name,
        team.full_name,
        team.location,
        team.abbreviation
      ]);
      console.log(`Inserted: ${team.full_name}`);
    } catch (error) {
      console.error(`Error inserting ${team.full_name}:`, error);
    }
  }

  pool.end();
};

migrateTeams();















// const insertTeams = async () => {

//   // Load all JSON files


//   if (!Array.isArray(teamData)) {
//     console.error("Error: teamData is not an array. Check your JSON file.");
//     return;
//   }

//   const query = `
//     INSERT INTO teams (conference, division, name, full_name, location, abbreviation) 
//     VALUES ($1, $2, $3, $4, $5, $6)
//     ON CONFLICT (abbreviation) DO NOTHING;
//   `;

//   for (const team of teamData) {
//     const { conference, division, name, full_name, location, abbreviation } = team;
    
//     // Validate all required fields are present
//     if (!conference || !division || !name || !full_name || !location || !abbreviation) {
//       console.error(`Error: Missing required field for team: ${JSON.stringify(team)}`);
//       continue; // Skip the team if any required field is missing
//     }

//     try {
//       await pool.query(query, [
//         conference, 
//         division, 
//         name, 
//         full_name, 
//         location, 
//         abbreviation
//       ]);
//       console.log(`Inserted team: ${full_name}`);
//     } catch (error) {
//       console.error(`Error inserting team ${full_name}:`, error);
//     }
//   }
// };

// const migrateData = async () => {
//   try {
//     console.log('Starting migration...');
//     await insertTeams();
//     console.log('Migration completed.');
//     pool.end(); // Close connection
//   } catch (err) {
//     console.error('Migration failed:', err);
//   }
// };

// migrateData();
