-- Fantasy Cricket Database Schema (3NF/BCNF Normalized)
-- Migration 001: Core Schema
-- MySQL 8+ required for window functions

-- Drop existing tables if they exist (for clean migrations)
DROP TABLE IF EXISTS player_gameweek_points;
DROP TABLE IF EXISTS league_memberships;
DROP TABLE IF EXISTS leagues;
DROP TABLE IF EXISTS fantasy_team_squad_players;
DROP TABLE IF EXISTS fantasy_team_squads;
DROP TABLE IF EXISTS fantasy_teams;
DROP TABLE IF EXISTS fixtures;
DROP TABLE IF EXISTS gameweeks;
DROP TABLE IF EXISTS players;
DROP TABLE IF EXISTS real_teams;
DROP TABLE IF EXISTS users;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Real cricket teams
CREATE TABLE real_teams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    short_code VARCHAR(10) NOT NULL UNIQUE,
    logo_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_short_code (short_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Players
CREATE TABLE players (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    real_team_id INT NOT NULL,
    role ENUM('Batsman', 'Bowler', 'All-Rounder', 'Wicket-Keeper') NOT NULL,
    cost DECIMAL(5,2) NOT NULL CHECK (cost > 0),
    rating VARCHAR(5),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (real_team_id) REFERENCES real_teams(id) ON DELETE RESTRICT,
    INDEX idx_real_team (real_team_id),
    INDEX idx_role (role),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Gameweeks (tournament rounds)
CREATE TABLE gameweeks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    gameweek_number INT NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_gameweek_number (gameweek_number),
    INDEX idx_active (is_active),
    INDEX idx_dates (start_date, end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Fixtures (matches)
CREATE TABLE fixtures (
    id INT AUTO_INCREMENT PRIMARY KEY,
    gameweek_id INT NOT NULL,
    home_team_id INT NOT NULL,
    away_team_id INT NOT NULL,
    match_date DATETIME NOT NULL,
    venue VARCHAR(200),
    status ENUM('Scheduled', 'In Progress', 'Completed', 'Cancelled') DEFAULT 'Scheduled',
    home_score VARCHAR(50),
    away_score VARCHAR(50),
    winner_team_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (gameweek_id) REFERENCES gameweeks(id) ON DELETE RESTRICT,
    FOREIGN KEY (home_team_id) REFERENCES real_teams(id) ON DELETE RESTRICT,
    FOREIGN KEY (away_team_id) REFERENCES real_teams(id) ON DELETE RESTRICT,
    FOREIGN KEY (winner_team_id) REFERENCES real_teams(id) ON DELETE SET NULL,
    INDEX idx_gameweek (gameweek_id),
    INDEX idx_match_date (match_date),
    INDEX idx_status (status),
    CHECK (home_team_id != away_team_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Fantasy teams
CREATE TABLE fantasy_teams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    team_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_team (user_id, team_name),
    INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Fantasy team squads (per gameweek)
CREATE TABLE fantasy_team_squads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fantasy_team_id INT NOT NULL,
    gameweek_id INT NOT NULL,
    captain_player_id INT,
    vice_captain_player_id INT,
    is_submitted BOOLEAN DEFAULT FALSE,
    submitted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (fantasy_team_id) REFERENCES fantasy_teams(id) ON DELETE CASCADE,
    FOREIGN KEY (gameweek_id) REFERENCES gameweeks(id) ON DELETE RESTRICT,
    FOREIGN KEY (captain_player_id) REFERENCES players(id) ON DELETE SET NULL,
    FOREIGN KEY (vice_captain_player_id) REFERENCES players(id) ON DELETE SET NULL,
    UNIQUE KEY unique_team_gameweek (fantasy_team_id, gameweek_id),
    INDEX idx_gameweek (gameweek_id),
    INDEX idx_submitted (is_submitted),
    CHECK (captain_player_id != vice_captain_player_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Fantasy team squad players
CREATE TABLE fantasy_team_squad_players (
    id INT AUTO_INCREMENT PRIMARY KEY,
    squad_id INT NOT NULL,
    player_id INT NOT NULL,
    is_playing_11 BOOLEAN DEFAULT TRUE,
    position_order INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (squad_id) REFERENCES fantasy_team_squads(id) ON DELETE CASCADE,
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE RESTRICT,
    UNIQUE KEY unique_squad_player (squad_id, player_id),
    INDEX idx_squad (squad_id),
    INDEX idx_player (player_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Leagues
CREATE TABLE leagues (
    id INT AUTO_INCREMENT PRIMARY KEY,
    league_name VARCHAR(100) NOT NULL,
    league_code VARCHAR(20) NOT NULL UNIQUE,
    created_by_user_id INT NOT NULL,
    is_public BOOLEAN DEFAULT TRUE,
    max_members INT DEFAULT 100,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_code (league_code),
    INDEX idx_public (is_public),
    INDEX idx_creator (created_by_user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- League memberships
CREATE TABLE league_memberships (
    id INT AUTO_INCREMENT PRIMARY KEY,
    league_id INT NOT NULL,
    fantasy_team_id INT NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (league_id) REFERENCES leagues(id) ON DELETE CASCADE,
    FOREIGN KEY (fantasy_team_id) REFERENCES fantasy_teams(id) ON DELETE CASCADE,
    UNIQUE KEY unique_league_team (league_id, fantasy_team_id),
    INDEX idx_league (league_id),
    INDEX idx_team (fantasy_team_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Player gameweek points (detailed scoring)
CREATE TABLE player_gameweek_points (
    id INT AUTO_INCREMENT PRIMARY KEY,
    player_id INT NOT NULL,
    gameweek_id INT NOT NULL,
    fixture_id INT,
    
    -- Batting stats
    runs_scored INT DEFAULT 0,
    fours INT DEFAULT 0,
    sixes INT DEFAULT 0,
    is_duck BOOLEAN DEFAULT FALSE,
    
    -- Bowling stats
    wickets INT DEFAULT 0,
    maiden_overs INT DEFAULT 0,
    dot_balls INT DEFAULT 0,
    
    -- Fielding stats
    catches INT DEFAULT 0,
    stumpings INT DEFAULT 0,
    run_outs INT DEFAULT 0,
    
    -- Computed points (can be calculated or stored)
    batting_points INT DEFAULT 0,
    bowling_points INT DEFAULT 0,
    fielding_points INT DEFAULT 0,
    total_points INT DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
    FOREIGN KEY (gameweek_id) REFERENCES gameweeks(id) ON DELETE CASCADE,
    FOREIGN KEY (fixture_id) REFERENCES fixtures(id) ON DELETE SET NULL,
    UNIQUE KEY unique_player_gameweek (player_id, gameweek_id, fixture_id),
    INDEX idx_player (player_id),
    INDEX idx_gameweek (gameweek_id),
    INDEX idx_fixture (fixture_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
