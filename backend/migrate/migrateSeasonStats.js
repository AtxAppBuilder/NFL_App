const fs = require('fs');
const pool = require('../config/db');
require('dotenv').config();

async function migrateSeasonStats() {
    try {
        // 📌 Read JSON file
        const statsData = JSON.parse(fs.readFileSync("/mnt/c/nfl_stats/backend/data/season_stats_2024.json", "utf8"));

        for (const stat of statsData) {
            const player = stat.player;

            // 📌 Get player_id from `players` table
            const playerRes = await pool.query(
                "SELECT player_id FROM players WHERE player_id = $1",
                [player.id]
            );

            if (playerRes.rows.length === 0) {
                console.warn(`Player ID ${player.id} not found in database, skipping...`);
                continue;
            }

            const player_id = playerRes.rows[0].player_id;

            // 📌 Insert season statistics into `season_stats` table
            const query = `
                INSERT INTO season_stats (
                    player_id, games_played, season, postseason,
                    passing_completions, passing_attempts, passing_yards, yards_per_pass_attempt, passing_touchdowns, 
                    passing_interceptions, passing_yards_per_game, passing_completion_pct, qbr,
                    rushing_attempts, rushing_yards, rushing_yards_per_game, yards_per_rush_attempt, rushing_touchdowns, 
                    rushing_fumbles, rushing_fumbles_lost, rushing_first_downs,
                    receptions, receiving_yards, yards_per_reception, receiving_touchdowns, receiving_fumbles, 
                    receiving_fumbles_lost, receiving_first_downs, receiving_targets, receiving_yards_per_game,
                    fumbles_forced, fumbles_recovered, total_tackles, defensive_sacks, defensive_sack_yards, 
                    solo_tackles, assist_tackles, fumbles_touchdowns, defensive_interceptions, interception_touchdowns,
                    kick_returns, kick_return_yards, yards_per_kick_return, kick_return_touchdowns, punt_returner_returns, 
                    punt_returner_return_yards, yards_per_punt_return, punt_return_touchdowns,
                    field_goal_attempts, field_goals_made, field_goal_pct, field_goals_made_1_19, 
                    field_goals_made_20_29, field_goals_made_30_39, field_goals_made_40_49, field_goals_attempts_1_19, 
                    field_goals_attempts_20_29, field_goals_attempts_30_39, field_goals_attempts_40_49, field_goals_attempts_50,
                    punts, punt_yards
                ) VALUES (
                    $1, $2, $3, $4,
                    $5, $6, $7, $8, $9,
                    $10, $11, $12, $13,
                    $14, $15, $16, $17, $18,
                    $19, $20, $21,
                    $22, $23, $24, $25, $26,
                    $27, $28, $29, $30,
                    $31, $32, $33, $34, $35,
                    $36, $37, $38, $39, $40,
                    $41, $42, $43, $44, $45,
                    $46, $47, $48,
                    $49, $50, $51, $52, 
                    $53, $54, $55, $56, 
                    $57, $58, $59, $60, 
                    $61, $62
                ) 
                ON CONFLICT (player_id, season, postseason) 
                DO UPDATE SET 
                    games_played = EXCLUDED.games_played,
                    passing_completions = EXCLUDED.passing_completions,
                    passing_attempts = EXCLUDED.passing_attempts,
                    passing_yards = EXCLUDED.passing_yards,
                    yards_per_pass_attempt = EXCLUDED.yards_per_pass_attempt,
                    passing_touchdowns = EXCLUDED.passing_touchdowns,
                    passing_interceptions = EXCLUDED.passing_interceptions,
                    passing_yards_per_game = EXCLUDED.passing_yards_per_game,
                    passing_completion_pct = EXCLUDED.passing_completion_pct,
                    qbr = EXCLUDED.qbr,
                    rushing_attempts = EXCLUDED.rushing_attempts,
                    rushing_yards = EXCLUDED.rushing_yards,
                    rushing_yards_per_game = EXCLUDED.rushing_yards_per_game,
                    yards_per_rush_attempt = EXCLUDED.yards_per_rush_attempt,
                    rushing_touchdowns = EXCLUDED.rushing_touchdowns,
                    rushing_fumbles = EXCLUDED.rushing_fumbles,
                    rushing_fumbles_lost = EXCLUDED.rushing_fumbles_lost,
                    rushing_first_downs = EXCLUDED.rushing_first_downs,
                    receptions = EXCLUDED.receptions,
                    receiving_yards = EXCLUDED.receiving_yards,
                    yards_per_reception = EXCLUDED.yards_per_reception,
                    receiving_touchdowns = EXCLUDED.receiving_touchdowns,
                    receiving_fumbles = EXCLUDED.receiving_fumbles,
                    receiving_fumbles_lost = EXCLUDED.receiving_fumbles_lost,
                    receiving_first_downs = EXCLUDED.receiving_first_downs,
                    receiving_targets = EXCLUDED.receiving_targets,
                    receiving_yards_per_game = EXCLUDED.receiving_yards_per_game,
                    fumbles_forced = EXCLUDED.fumbles_forced,
                    fumbles_recovered = EXCLUDED.fumbles_recovered,
                    total_tackles = EXCLUDED.total_tackles,
                    defensive_sacks = EXCLUDED.defensive_sacks,
                    defensive_sack_yards = EXCLUDED.defensive_sack_yards,
                    solo_tackles = EXCLUDED.solo_tackles,
                    assist_tackles = EXCLUDED.assist_tackles,
                    fumbles_touchdowns = EXCLUDED.fumbles_touchdowns,
                    defensive_interceptions = EXCLUDED.defensive_interceptions,
                    interception_touchdowns = EXCLUDED.interception_touchdowns,
                    kick_returns = EXCLUDED.kick_returns,
                    kick_return_yards = EXCLUDED.kick_return_yards,
                    yards_per_kick_return = EXCLUDED.yards_per_kick_return,
                    kick_return_touchdowns = EXCLUDED.kick_return_touchdowns,
                    punt_returner_returns = EXCLUDED.punt_returner_returns,
                    punt_returner_return_yards = EXCLUDED.punt_returner_return_yards,
                    yards_per_punt_return = EXCLUDED.yards_per_punt_return,
                    punt_return_touchdowns = EXCLUDED.punt_return_touchdowns,
                    field_goal_attempts = EXCLUDED.field_goal_attempts,
                    field_goals_made = EXCLUDED.field_goals_made,
                    field_goal_pct = EXCLUDED.field_goal_pct,
                    field_goals_made_1_19 = EXCLUDED.field_goals_made_1_19,
                    field_goals_made_20_29 = EXCLUDED.field_goals_made_20_29,
                    field_goals_made_30_39 = EXCLUDED.field_goals_made_30_39,
                    field_goals_made_40_49 = EXCLUDED.field_goals_made_40_49,
                    field_goals_attempts_1_19 = EXCLUDED.field_goals_attempts_1_19,
                    field_goals_attempts_20_29 = EXCLUDED.field_goals_attempts_20_29,
                    field_goals_attempts_30_39 = EXCLUDED.field_goals_attempts_30_39,
                    field_goals_attempts_40_49 = EXCLUDED.field_goals_attempts_40_49,
                    field_goals_attempts_50 = EXCLUDED.field_goals_attempts_50,
                    punts = EXCLUDED.punts,
                    punt_yards = EXCLUDED.punt_yards;
            `;

            // Log the values to see if there's a "0.5"
console.log([
    player_id, stat.games_played, stat.season, stat.postseason,
    stat.passing_completions, stat.passing_attempts, stat.passing_yards, stat.yards_per_pass_attempt, stat.passing_touchdowns,
    stat.passing_interceptions, stat.passing_yards_per_game, stat.passing_completion_pct, stat.qbr,
    stat.rushing_attempts, stat.rushing_yards, stat.rushing_yards_per_game, stat.yards_per_rush_attempt, stat.rushing_touchdowns,
    stat.rushing_fumbles, stat.rushing_fumbles_lost, stat.rushing_first_downs,
    stat.receptions, stat.receiving_yards, stat.yards_per_reception, stat.receiving_touchdowns, stat.receiving_fumbles,
    stat.receiving_fumbles_lost, stat.receiving_first_downs, stat.receiving_targets, stat.receiving_yards_per_game,
    stat.fumbles_forced, stat.fumbles_recovered, stat.total_tackles, stat.defensive_sacks, stat.defensive_sack_yards,
    stat.solo_tackles, stat.assist_tackles, stat.fumbles_touchdowns, stat.defensive_interceptions, stat.interception_touchdowns,
    stat.kick_returns, stat.kick_return_yards, stat.yards_per_kick_return, stat.kick_return_touchdowns, stat.punt_returner_returns,
    stat.punt_returner_return_yards, stat.yards_per_punt_return, stat.punt_return_touchdowns,
    stat.field_goal_attempts, stat.field_goals_made, stat.field_goal_pct, stat.field_goals_made_1_19,
    stat.field_goals_made_20_29, stat.field_goals_made_30_39, stat.field_goals_made_40_49, stat.field_goals_attempts_1_19,
    stat.field_goals_attempts_20_29, stat.field_goals_attempts_30_39, stat.field_goals_attempts_40_49, stat.field_goals_attempts_50,
    stat.punts, stat.punt_yards
]);

            await pool.query(query, [
                player_id, stat.games_played, stat.season, stat.postseason,
                stat.passing_completions, stat.passing_attempts, stat.passing_yards, stat.yards_per_pass_attempt, stat.passing_touchdowns,
                stat.passing_interceptions, stat.passing_yards_per_game, stat.passing_completion_pct, stat.qbr,
                stat.rushing_attempts, stat.rushing_yards, stat.rushing_yards_per_game, stat.yards_per_rush_attempt, stat.rushing_touchdowns,
                stat.rushing_fumbles, stat.rushing_fumbles_lost, stat.rushing_first_downs,
                stat.receptions, stat.receiving_yards, stat.yards_per_reception, stat.receiving_touchdowns, stat.receiving_fumbles,
                stat.receiving_fumbles_lost, stat.receiving_first_downs, stat.receiving_targets, stat.receiving_yards_per_game,
                stat.fumbles_forced, stat.fumbles_recovered, stat.total_tackles, stat.defensive_sacks, stat.defensive_sack_yards,
                stat.solo_tackles, stat.assist_tackles, stat.fumbles_touchdowns, stat.defensive_interceptions, stat.interception_touchdowns,
                stat.kick_returns, stat.kick_return_yards, stat.yards_per_kick_return, stat.kick_return_touchdowns, stat.punt_returner_returns,
                stat.punt_returner_return_yards, stat.yards_per_punt_return, stat.punt_return_touchdowns,
                stat.field_goal_attempts, stat.field_goals_made, stat.field_goal_pct, stat.field_goals_made_1_19,
                stat.field_goals_made_20_29, stat.field_goals_made_30_39, stat.field_goals_made_40_49, stat.field_goals_attempts_1_19,
                stat.field_goals_attempts_20_29, stat.field_goals_attempts_30_39, stat.field_goals_attempts_40_49, stat.field_goals_attempts_50,
                stat.punts, stat.punt_yards
            ]);

            console.log(`Inserted stats for player_id: ${player_id}, season: ${stat.season}`);
        }
    } catch (error) {
        console.error("Error inserting season stats:", error);
    } finally {
        pool.end();
    }
}

// Run migration
migrateSeasonStats();












// const fs = require('fs');
// const pool = require('../config/db');
// require('dotenv').config();

// async function migrateSeasonStats() {
//     try {
//         // 📌 Read JSON file
//         const statsData = JSON.parse(fs.readFileSync("/mnt/c/nfl_stats/backend/data/season_stats_2024.json", "utf8"));

//         for (const stat of statsData) {
//             const player = stat.player;

//             // 📌 Get player_id from `players` table
//             const playerRes = await pool.query(
//                 "SELECT player_id FROM players WHERE player_id = $1",
//                 [player.id]
//             );

//             if (playerRes.rows.length === 0) {
//                 console.warn(`Player ID ${player.id} not found in database, skipping...`);
//                 continue;
//             }

//             const player_id = playerRes.rows[0].player_id;

//             // 📌 Insert season statistics into `season_stats` table
//             const query = `
//                 INSERT INTO season_stats (
//                     player_id, games_played, season, postseason,
//                     passing_completions, passing_attempts, passing_yards, yards_per_pass_attempt, passing_touchdowns, 
//                     passing_interceptions, passing_yards_per_game, passing_completion_pct, qbr,
//                     rushing_attempts, rushing_yards, rushing_yards_per_game, yards_per_rush_attempt, rushing_touchdowns, 
//                     rushing_fumbles, rushing_fumbles_lost, rushing_first_downs,
//                     receptions, receiving_yards, yards_per_reception, receiving_touchdowns, receiving_fumbles, 
//                     receiving_fumbles_lost, receiving_first_downs, receiving_targets, receiving_yards_per_game,
//                     fumbles_forced, fumbles_recovered, total_tackles, defensive_sacks, defensive_sack_yards, 
//                     solo_tackles, assist_tackles, fumbles_touchdowns, defensive_interceptions, interception_touchdowns,
//                     kick_returns, kick_return_yards, yards_per_kick_return, kick_return_touchdowns, punt_returner_returns, 
//                     punt_returner_return_yards, yards_per_punt_return, punt_return_touchdowns,
//                     field_goal_attempts, field_goals_made, field_goal_pct, field_goals_made_1_19, 
//                     field_goals_made_20_29, field_goals_made_30_39, field_goals_made_40_49, field_goals_attempts_1_19, 
//                     field_goals_attempts_20_29, field_goals_attempts_30_39, field_goals_attempts_40_49, field_goals_attempts_50,
//                     punts, punt_yards
//                 ) VALUES (
//                     $1, $2, $3, $4,
//                     $5, $6, $7, $8, $9,
//                     $10, $11, $12, $13,
//                     $14, $15, $16, $17, $18,
//                     $19, $20, $21,
//                     $22, $23, $24, $25, $26,
//                     $27, $28, $29, $30,
//                     $31, $32, $33, $34, $35,
//                     $36, $37, $38, $39, $40,
//                     $41, $42, $43, $44, $45,
//                     $46, $47, $48,
      
//                     $49, $50, $51, $52, 
//                     $53, $54, $55, $56, 
//                     $57, $58, $59, $60, 
//                     $61, $62
//                 ) 
//                 ON CONFLICT (player_id, season, postseason) 
//                 DO UPDATE SET 
//                     games_played = EXCLUDED.games_played,
//                     passing_completions = EXCLUDED.passing_completions,
//                     passing_attempts = EXCLUDED.passing_attempts,
//                     passing_yards = EXCLUDED.passing_yards,
//                     yards_per_pass_attempt = EXCLUDED.yards_per_pass_attempt,
//                     passing_touchdowns = EXCLUDED.passing_touchdowns,
//                     passing_interceptions = EXCLUDED.passing_interceptions,
//                     passing_yards_per_game = EXCLUDED.passing_yards_per_game,
//                     passing_completion_pct = EXCLUDED.passing_completion_pct,
//                     qbr = EXCLUDED.qbr,
//                     rushing_attempts = EXCLUDED.rushing_attempts,
//                     rushing_yards = EXCLUDED.rushing_yards,
//                     rushing_yards_per_game = EXCLUDED.rushing_yards_per_game,
//                     yards_per_rush_attempt = EXCLUDED.yards_per_rush_attempt,
//                     rushing_touchdowns = EXCLUDED.rushing_touchdowns
//             `;

//             await pool.query(query, [
//                 player_id, stat.games_played, stat.season, stat.postseason,
//                 stat.passing_completions, stat.passing_attempts, stat.passing_yards, stat.yards_per_pass_attempt, stat.passing_touchdowns,
//                 stat.passing_interceptions, stat.passing_yards_per_game, stat.passing_completion_pct, stat.qbr,
//                 stat.rushing_attempts, stat.rushing_yards, stat.rushing_yards_per_game, stat.yards_per_rush_attempt, stat.rushing_touchdowns,
//                 stat.rushing_fumbles, stat.rushing_fumbles_lost, stat.rushing_first_downs,
//                 stat.receptions, stat.receiving_yards, stat.yards_per_reception, stat.receiving_touchdowns, stat.receiving_fumbles,
//                 stat.receiving_fumbles_lost, stat.receiving_first_downs, stat.receiving_targets, stat.receiving_yards_per_game,
//                 stat.fumbles_forced, stat.fumbles_recovered, stat.total_tackles, stat.defensive_sacks, stat.defensive_sack_yards,
//                 stat.solo_tackles, stat.assist_tackles, stat.fumbles_touchdowns, stat.defensive_interceptions, stat.interception_touchdowns,
//                 stat.kick_returns, stat.kick_return_yards, stat.yards_per_kick_return, stat.kick_return_touchdowns, stat.punt_returner_returns,
//                 stat.punt_returner_return_yards, stat.yards_per_punt_return, stat.punt_return_touchdowns,
//                 stat.field_goal_attempts, stat.field_goals_made, stat.field_goal_pct, stat.field_goals_made_1_19,
//                 stat.field_goals_made_20_29, stat.field_goals_made_30_39, stat.field_goals_made_40_49, stat.field_goals_attempts_1_19,
//                 stat.field_goals_attempts_20_29, stat.field_goals_attempts_30_39, stat.field_goals_attempts_40_49, stat.field_goals_attempts_50,
//                 stat.punts, stat.punt_yards
//             ]);

//             console.log(`Inserted stats for player_id: ${player_id}, season: ${stat.season}`);
//         }
//     } catch (error) {
//         console.error("Error inserting season stats:", error);
//     } finally {
//         pool.end()
//     }
// }

// // Run migration
// migrateSeasonStats();









