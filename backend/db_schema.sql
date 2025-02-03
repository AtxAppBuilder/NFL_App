----------Client Users----------------          
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL, -- Store hashed passwords (use bcrypt)
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-----User Profile Tab-------------            
CREATE TABLE user_profiles (
  profile_id SERIAL PRIMARY KEY,
  user_id INT UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,  -- Links to users table
  profile_picture TEXT,  -- Store URL or file path
  bio TEXT,
  favorite_team TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-------Save Recent Players Searched---------------
CREATE TABLE saved_players (
  save_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE,  -- Link to users
  player_id INT REFERENCES players(player_id) ON DELETE CASCADE,  -- Link to players
  saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_user_player UNIQUE (user_id, player_id)  -- Unique constraint on user and player ---This is not in my PSQL Database -----
);

-----------Player Salaries----------------
CREATE TABLE nfl_player_salaries (
    salary_id SERIAL PRIMARY KEY, -- Unique salary record identifier
    player_id INT REFERENCES players(player_id) ON DELETE CASCADE, -- Link to players
    team_id INT REFERENCES teams(team_id) ON DELETE SET NULL, -- Link to teams (nullable, set to NULL if the team is deleted)
    name VARCHAR(255) NOT NULL,
    position VARCHAR(50) NOT NULL,
    total_value BIGINT NOT NULL,
    apy BIGINT NOT NULL,
    total_guaranteed BIGINT NOT NULL,
    avg_guarantee_per_year BIGINT NOT NULL,
    percent_guaranteed NUMERIC(5,2) NOT NULL
);
--------Players Table---------------------   
CREATE TABLE players (
    player_id SERIAL PRIMARY KEY,   
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    position TEXT NOT NULL,
    position_abbreviation TEXT NOT NULL,
    height INT,
    weight INT, 
    jersey_number INT,
    college TEXT NOT NULL,
    experience INT,
    age INT,
    team_id INT REFERENCES teams(team_id) ON DELETE SET NULL
);
-------Teams Table------------------        
CREATE TABLE teams (
    team_id SERIAL PRIMARY KEY,
    conference TEXT NOT NULL,
    division TEXT NOT NULL,
    name TEXT NOT NULL,
    full_name TEXT NOT NULL,
    location TEXT NOT NULL,
    abbreviation TEXT NOT NULL
);
--------Season Stats Table-----------------------                    
CREATE TABLE season_stats (  
  stat_id SERIAL PRIMARY KEY,
  player_id INT REFERENCES players(player_id) ON DELETE CASCADE,
  games_played INT,
  season INT,
  postseason BOOLEAN,

  ------Passing------------
  passing_completions INT,
  passing_attempts INT,
  passing_yards INT,
  yards_per_pass_attempt NUMERIC(10, 2),
  passing_touchdowns INT,
  passing_interceptions INT,
  passing_yards_per_game NUMERIC(10, 2),
  passing_completion_pct NUMERIC(10, 2),
  qbr NUMERIC(5, 2),

  --------Rushing------------
  rushing_attempts INT,
  rushing_yards INT,
  rushing_yards_per_game NUMERIC(10, 2),
  yards_per_rush_attempt NUMERIC(10, 2),
  rushing_touchdowns INT,
  rushing_fumbles INT,
  rushing_fumbles_lost INT,
  rushing_first_downs INT,

  -------Receiving--------
  receptions INT,
  receiving_yards INT,
  yards_per_reception NUMERIC(10, 2),
  receiving_touchdowns INT,
  receiving_fumbles INT,
  receiving_fumbles_lost INT,
  receiving_first_downs INT,
  receiving_targets INT,
  receiving_yards_per_game NUMERIC(10, 2),

  -----Defense------
  fumbles_forced INT,
  fumbles_recovered INT,
  total_tackles INT,
  defensive_sacks INT,
  defensive_sack_yards INT,
  solo_tackles INT,
  assist_tackles INT,
  fumbles_touchdowns INT,
  defensive_interceptions INT,
  interception_touchdowns INT,

  -----Special Teams---------
  kick_returns INT,
  kick_return_yards INT,
  yards_per_kick_return NUMERIC(10, 2),
  kick_return_touchdowns INT,
  punt_returner_returns INT,
  punt_returner_return_yards INT,
  yards_per_punt_return NUMERIC(10, 2),
  punt_return_touchdowns INT,

--------Kicking-----------
  field_goal_attempts INT,
  field_goals_made INT,
  field_goal_pct NUMERIC(5, 2),
  field_goals_made_1_19 INT,
  field_goals_made_20_29 INT,
  field_goals_made_30_39 INT,
  field_goals_made_40_49 INT,
  field_goals_attempts_1_19 INT,
  field_goals_attempts_20_29 INT,
  field_goals_attempts_30_39 INT,
  field_goals_attempts_40_49 INT,
  field_goals_attempts_50 INT,

  ------Punting----------
  punts INT,
  punt_yards INT 
);


