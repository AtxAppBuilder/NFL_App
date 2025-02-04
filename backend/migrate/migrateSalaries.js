const fs = require('fs');
const pool = require('../config/db');
require('dotenv').config();

const migrateSalaries = async () => {
  // Load player salary data from a JSON file
  const playerSalaries = JSON.parse(fs.readFileSync('/mnt/c/nfl_stats/backend/data/salaries_2024.json', 'utf-8'));

  // SQL query for inserting player salary data
  const query = `
    INSERT INTO nfl_player_salaries (player_id, team_id, name, position, total_value, apy, total_guaranteed, avg_guarantee_per_year, percent_guaranteed)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    ON CONFLICT (player_id) DO NOTHING
  `;

  // Loop through player salaries and insert into the database
  for (const salary of playerSalaries) {
    try {
      // Retrieve team_id based on team name (you may need a helper function for this)
      const teamQuery = `SELECT team_id FROM teams WHERE abbreviation = $1`;
      const teamResult = await pool.query(teamQuery, [salary.team]);
      const team_id = teamResult.rows.length > 0 ? teamResult.rows[0].team_id : null;

      // Prepare the values for the insert query
      const totalValue = parseInt(salary.totalValue.replace(/\D/g, ''), 10); // Remove non-numeric characters and convert to integer
      const apy = parseInt(salary.apy.replace(/\D/g, ''), 10);
      const totalGuaranteed = parseInt(salary.totalGuaranteed.replace(/\D/g, ''), 10);
      const avgGuaranteePerYear = parseInt(salary.avgGuaranteePerYear.replace(/\D/g, ''), 10);
      const percentGuaranteed = parseFloat(salary.percentGuaranteed.replace('%', '').trim());

      // Insert player salary into the database
      await pool.query(query, [
        salary.playerId, // Assuming playerId exists in your data
        team_id,
        salary.name,
        salary.position,
        totalValue,
        apy,
        totalGuaranteed,
        avgGuaranteePerYear,
        percentGuaranteed
      ]);
      
      console.log(`Inserted salary for: ${salary.name}`);
    } catch (error) {
      console.error(`Error inserting salary for ${salary.name}:`, error);
    }
  }

  pool.end(); // Close the database connection
};

migrateSalaries();
