const pool = require('../config/db'); 
const fs = require('fs');
const path = require('path');

// Function to read JSON file
const readJsonFile = (fileName) => {
  const filePath = path.join(__dirname, '..', 'data', fileName);
  const rawData = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(rawData);
};

// Function to insert data into PostgreSQL
const migrateSeasonStats = async (fileName) => {
  const data = readJsonFile(fileName);

  try {
    // Start a transaction
    await pool.query('BEGIN');

    // Insert each record into the database
    for (const record of data) {
      const {
        player,
        games_played,
        season,
        postseason,
        passing_completions,
        passing_attempts,
        passing_yards,
        yards_per_pass_attempt,
        passing_touchdowns,
        passing_interceptions,
        passing_yards_per_game,
        passing_completion_pct,
        qbr,
        rushing_attempts,
        rushing_yards,
        rushing_yards_per_game,
        yards_per_rush_attempt,
        rushing_touchdowns,
        rushing_fumbles,
        rushing_fumbles_lost,
        rushing_first_downs,
        receptions,
        receiving_yards,
        yards_per_reception,
        receiving_touchdowns,
        receiving_fumbles,
        receiving_fumbles_lost,
        receiving_first_downs,
        receiving_targets,
        receiving_yards_per_game,
        fumbles_forced,
        fumbles_recovered,
        total_tackles,
        defensive_sacks,
        defensive_sack_yards,
        solo_tackles,
        assist_tackles,
        fumbles_touchdowns,
        defensive_interceptions,
        interception_touchdowns,
        kick_returns,
        kick_return_yards,
        yards_per_kick_return,
        kick_return_touchdowns,
        punt_returner_returns,
        punt_returner_return_yards,
        yards_per_punt_return,
        punt_return_touchdowns,
        field_goal_attempts,
        field_goals_made,
        field_goal_pct,
        punts,
        punt_yards,
        field_goals_made_1_19,
        field_goals_made_20_29,
        field_goals_made_30_39,
        field_goals_made_40_49,
        field_goals_made_50,
        field_goals_attempts_1_19,
        field_goals_attempts_20_29,
        field_goals_attempts_30_39,
        field_goals_attempts_40_49,
        field_goals_attempts_50
      } = record;

      const query = `
        INSERT INTO season_stats (
          player_id, first_name, last_name, position, position_abbreviation, height, weight, jersey_number, college, experience, age,
          games_played, season, postseason,
          passing_completions, passing_attempts, passing_yards, yards_per_pass_attempt, passing_touchdowns, passing_interceptions, passing_yards_per_game, passing_completion_pct, qbr,
          rushing_attempts, rushing_yards, rushing_yards_per_game, yards_per_rush_attempt, rushing_touchdowns, rushing_fumbles, rushing_fumbles_lost, rushing_first_downs,
          receptions, receiving_yards, yards_per_reception, receiving_touchdowns, receiving_fumbles, receiving_fumbles_lost, receiving_first_downs, receiving_targets, receiving_yards_per_game,
          fumbles_forced, fumbles_recovered, total_tackles, defensive_sacks, defensive_sack_yards, solo_tackles, assist_tackles, fumbles_touchdowns, defensive_interceptions, interception_touchdowns,
          kick_returns, kick_return_yards, yards_per_kick_return, kick_return_touchdowns, punt_returner_returns, punt_returner_return_yards, yards_per_punt_return, punt_return_touchdowns,
          field_goal_attempts, field_goals_made, field_goal_pct, punts, punt_yards,
          field_goals_made_1_19, field_goals_made_20_29, field_goals_made_30_39, field_goals_made_40_49, field_goals_made_50,
          field_goals_attempts_1_19, field_goals_attempts_20_29, field_goals_attempts_30_39, field_goals_attempts_40_49, field_goals_attempts_50
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,
          $12, $13, $14,
          $15, $16, $17, $18, $19, $20, $21, $22, $23,
          $24, $25, $26, $27, $28, $29, $30, $31,
          $32, $33, $34, $35, $36, $37, $38, $39, $40,
          $41, $42, $43, $44, $45, $46, $47, $48, $49, $50,
          $51, $52, $53, $54, $55, $56, $57, $58,
          $59, $60, $61, $62, $63,
          $64, $65, $66, $67, $68,
          $69, $70, $71, $72, $73
        )
      `;
      await pool.query(query, [
        player.id, player.first_name, player.last_name, player.position, player.position_abbreviation, player.height, player.weight, player.jersey_number, player.college, player.experience, player.age,
        games_played, season, postseason,
        passing_completions, passing_attempts, passing_yards, yards_per_pass_attempt, passing_touchdowns, passing_interceptions, passing_yards_per_game, passing_completion_pct, qbr,
        rushing_attempts, rushing_yards, rushing_yards_per_game, yards_per_rush_attempt, rushing_touchdowns, rushing_fumbles, rushing_fumbles_lost, rushing_first_downs,
        receptions, receiving_yards, yards_per_reception, receiving_touchdowns, receiving_fumbles, receiving_fumbles_lost, receiving_first_downs, receiving_targets, receiving_yards_per_game,
        fumbles_forced, fumbles_recovered, total_tackles, defensive_sacks, defensive_sack_yards, solo_tackles, assist_tackles, fumbles_touchdowns, defensive_interceptions, interception_touchdowns,
        kick_returns, kick_return_yards, yards_per_kick_return, kick_return_touchdowns, punt_returner_returns, punt_returner_return_yards, yards_per_punt_return, punt_return_touchdowns,
        field_goal_attempts, field_goals_made, field_goal_pct, punts, punt_yards,
        field_goals_made_1_19, field_goals_made_20_29, field_goals_made_30_39, field_goals_made_40_49, field_goals_made_50,
        field_goals_attempts_1_19, field_goals_attempts_20_29, field_goals_attempts_30_39, field_goals_attempts_40_49, field_goals_attempts_50
      ]);
    }

    // Commit the transaction
    await pool.query('COMMIT');
    console.log('✅ Data migrated successfully!');
  } catch (error) {
    // Rollback the transaction in case of error
    await pool.query('ROLLBACK');
    console.error('❌ Error migrating data:', error);
  } finally {
    // Close the database connection
    await pool.end();
  }
};

// Run the migration
const fileName = 'season_stats_2024.json'; // Change this to the file you want to migrate
migrateSeasonStats(fileName);