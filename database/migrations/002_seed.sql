-- Fantasy Cricket Seed Data
-- Migration 002: Sample Data for Development and Testing

-- Insert real teams
INSERT INTO real_teams (name, short_code, logo_url) VALUES
('Mumbai Indians', 'MI', '/teams/mi.png'),
('Chennai Super Kings', 'CSK', '/teams/csk.png'),
('Royal Challengers Bangalore', 'RCB', '/teams/rcb.png'),
('Kolkata Knight Riders', 'KKR', '/teams/kkr.png'),
('Delhi Capitals', 'DC', '/teams/dc.png'),
('Rajasthan Royals', 'RR', '/teams/rr.png'),
('Gujarat Titans', 'GT', '/teams/gt.png'),
('Lucknow Super Giants', 'LSG', '/teams/lsg.png'),
('Sunrisers Hyderabad', 'SRH', '/teams/srh.png'),
('Punjab Kings', 'PBKS', '/teams/pbks.png');

-- Insert sample admin user (password: admin123 - hashed with bcrypt rounds=12)
INSERT INTO users (username, email, password_hash, full_name, is_admin) VALUES
('admin', 'admin@fantasycricket.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpMNKYe5i', 'Administrator', TRUE);

-- Insert sample regular users
INSERT INTO users (username, email, password_hash, full_name, is_admin) VALUES
('john_doe', 'john@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpMNKYe5i', 'John Doe', FALSE),
('jane_smith', 'jane@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpMNKYe5i', 'Jane Smith', FALSE),
('mike_wilson', 'mike@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpMNKYe5i', 'Mike Wilson', FALSE);

-- Insert players (Batsmen)
INSERT INTO players (name, real_team_id, role, cost, rating, is_active) VALUES
('Virat Kohli', 3, 'Batsman', 15.0, 'A', TRUE),
('Rohit Sharma', 1, 'Batsman', 15.0, 'A', TRUE),
('KL Rahul', 8, 'Batsman', 13.0, 'B', TRUE),
('Shubman Gill', 7, 'Batsman', 12.0, 'B', TRUE),
('David Warner', 5, 'Batsman', 14.0, 'A', TRUE),
('Shreyas Iyer', 4, 'Batsman', 11.0, 'C', TRUE),
('Suryakumar Yadav', 1, 'Batsman', 12.0, 'B', TRUE),
('Jos Buttler', 6, 'Batsman', 14.0, 'A', TRUE);

-- Insert players (Wicket Keepers)
INSERT INTO players (name, real_team_id, role, cost, rating, is_active) VALUES
('MS Dhoni', 2, 'Wicket-Keeper', 12.0, 'B', TRUE),
('Rishabh Pant', 5, 'Wicket-Keeper', 13.0, 'B', TRUE),
('Quinton de Kock', 8, 'Wicket-Keeper', 11.0, 'C', TRUE),
('Ishan Kishan', 1, 'Wicket-Keeper', 10.0, 'C', TRUE),
('Sanju Samson', 6, 'Wicket-Keeper', 11.0, 'C', TRUE);

-- Insert players (Bowlers)
INSERT INTO players (name, real_team_id, role, cost, rating, is_active) VALUES
('Jasprit Bumrah', 1, 'Bowler', 15.0, 'A', TRUE),
('Rashid Khan', 7, 'Bowler', 14.0, 'A', TRUE),
('Yuzvendra Chahal', 6, 'Bowler', 12.0, 'B', TRUE),
('Mohammed Shami', 7, 'Bowler', 13.0, 'B', TRUE),
('Kagiso Rabada', 10, 'Bowler', 13.0, 'B', TRUE),
('Trent Boult', 6, 'Bowler', 12.0, 'B', TRUE),
('Bhuvneshwar Kumar', 9, 'Bowler', 10.0, 'C', TRUE);

-- Insert players (All-Rounders)
INSERT INTO players (name, real_team_id, role, cost, rating, is_active) VALUES
('Hardik Pandya', 7, 'All-Rounder', 14.0, 'A', TRUE),
('Andre Russell', 4, 'All-Rounder', 13.0, 'B', TRUE),
('Ravindra Jadeja', 2, 'All-Rounder', 13.0, 'B', TRUE),
('Glenn Maxwell', 3, 'All-Rounder', 12.0, 'B', TRUE),
('Axar Patel', 5, 'All-Rounder', 10.0, 'C', TRUE),
('Krunal Pandya', 8, 'All-Rounder', 9.0, 'D', TRUE),
('Washington Sundar', 9, 'All-Rounder', 8.0, 'D', TRUE),
('Sam Curran', 10, 'All-Rounder', 11.0, 'C', TRUE),
('Moeen Ali', 2, 'All-Rounder', 10.0, 'C', TRUE),
('Venkatesh Iyer', 4, 'All-Rounder', 9.0, 'D', TRUE);

-- Insert gameweeks
INSERT INTO gameweeks (gameweek_number, name, start_date, end_date, is_active, is_completed) VALUES
(1, 'Gameweek 1', '2025-10-01', '2025-10-07', FALSE, TRUE),
(2, 'Gameweek 2', '2025-10-08', '2025-10-14', FALSE, TRUE),
(3, 'Gameweek 3', '2025-10-15', '2025-10-21', TRUE, FALSE),
(4, 'Gameweek 4', '2025-10-22', '2025-10-28', FALSE, FALSE),
(5, 'Gameweek 5', '2025-10-29', '2025-11-04', FALSE, FALSE);

-- Insert fixtures for Gameweek 1
INSERT INTO fixtures (gameweek_id, home_team_id, away_team_id, match_date, venue, status) VALUES
(1, 1, 2, '2025-10-01 19:30:00', 'Wankhede Stadium, Mumbai', 'Completed'),
(1, 3, 4, '2025-10-02 19:30:00', 'M. Chinnaswamy Stadium, Bangalore', 'Completed'),
(1, 5, 6, '2025-10-03 15:30:00', 'Arun Jaitley Stadium, Delhi', 'Completed'),
(1, 7, 8, '2025-10-03 19:30:00', 'Narendra Modi Stadium, Ahmedabad', 'Completed'),
(1, 9, 10, '2025-10-04 19:30:00', 'Rajiv Gandhi Intl. Stadium, Hyderabad', 'Completed');

-- Insert fixtures for Gameweek 2
INSERT INTO fixtures (gameweek_id, home_team_id, away_team_id, match_date, venue, status) VALUES
(2, 2, 3, '2025-10-08 19:30:00', 'M. A. Chidambaram Stadium, Chennai', 'Completed'),
(2, 4, 5, '2025-10-09 19:30:00', 'Eden Gardens, Kolkata', 'Completed'),
(2, 6, 7, '2025-10-10 15:30:00', 'Sawai Mansingh Stadium, Jaipur', 'Completed'),
(2, 8, 9, '2025-10-10 19:30:00', 'BRSABV Ekana Stadium, Lucknow', 'Completed'),
(2, 10, 1, '2025-10-11 19:30:00', 'PCA Stadium, Mohali', 'Completed');

-- Insert fixtures for Gameweek 3 (upcoming)
INSERT INTO fixtures (gameweek_id, home_team_id, away_team_id, match_date, venue, status) VALUES
(3, 1, 3, '2025-10-15 19:30:00', 'Wankhede Stadium, Mumbai', 'Scheduled'),
(3, 2, 4, '2025-10-16 19:30:00', 'M. A. Chidambaram Stadium, Chennai', 'Scheduled'),
(3, 5, 7, '2025-10-17 15:30:00', 'Arun Jaitley Stadium, Delhi', 'Scheduled'),
(3, 6, 8, '2025-10-17 19:30:00', 'Sawai Mansingh Stadium, Jaipur', 'Scheduled'),
(3, 9, 10, '2025-10-18 19:30:00', 'Rajiv Gandhi Intl. Stadium, Hyderabad', 'Scheduled');

-- Insert sample fantasy teams
INSERT INTO fantasy_teams (user_id, team_name) VALUES
(2, 'Johns Champions'),
(3, 'Jane Warriors'),
(4, 'Mike Fighters');

-- Insert sample leagues
INSERT INTO leagues (league_name, league_code, created_by_user_id, is_public, max_members) VALUES
('Global League', 'GLOBAL2025', 1, TRUE, 1000),
('Friends League', 'FRIENDS2025', 2, FALSE, 50),
('Office League', 'OFFICE2025', 3, TRUE, 100);

-- Insert league memberships
INSERT INTO league_memberships (league_id, fantasy_team_id) VALUES
(1, 1), (1, 2), (1, 3),  -- All teams in global league
(2, 1), (2, 2),           -- Teams 1 and 2 in friends league
(3, 2), (3, 3);           -- Teams 2 and 3 in office league

-- Insert sample player gameweek points for Gameweek 1
-- MI vs CSK - Player performances
INSERT INTO player_gameweek_points (player_id, gameweek_id, fixture_id, runs_scored, fours, sixes, is_duck, wickets, maiden_overs, dot_balls, catches, stumpings, run_outs) VALUES
-- Rohit Sharma (MI) - Good batting performance
(2, 1, 1, 75, 8, 2, FALSE, 0, 0, 0, 1, 0, 0),
-- MS Dhoni (CSK) - Decent innings
(9, 1, 1, 45, 4, 1, FALSE, 0, 0, 0, 0, 1, 0),
-- Jasprit Bumrah (MI) - Excellent bowling
(14, 1, 1, 5, 0, 0, FALSE, 4, 2, 12, 0, 0, 0);

-- RCB vs KKR
INSERT INTO player_gameweek_points (player_id, gameweek_id, fixture_id, runs_scored, fours, sixes, is_duck, wickets, maiden_overs, dot_balls, catches, stumpings, run_outs) VALUES
-- Virat Kohli (RCB) - Century
(1, 1, 2, 102, 10, 3, FALSE, 0, 0, 0, 0, 0, 0),
-- Andre Russell (KKR) - All-round performance
(22, 1, 2, 58, 4, 4, FALSE, 2, 0, 8, 1, 0, 0);

-- DC vs RR
INSERT INTO player_gameweek_points (player_id, gameweek_id, fixture_id, runs_scored, fours, sixes, is_duck, wickets, maiden_overs, dot_balls, catches, stumpings, run_outs) VALUES
-- Jos Buttler (RR) - Big score
(8, 1, 3, 88, 9, 3, FALSE, 0, 0, 0, 0, 0, 0),
-- Rishabh Pant (DC) - Duck
(10, 1, 3, 0, 0, 0, TRUE, 0, 0, 0, 0, 0, 0),
-- Yuzvendra Chahal (RR) - 5-wicket haul
(16, 1, 3, 2, 0, 0, FALSE, 5, 1, 15, 0, 0, 0);

-- Update computed points based on scoring rules
UPDATE player_gameweek_points SET
    batting_points = (runs_scored * 1) + (fours * 2) + (sixes * 3) + (CASE WHEN is_duck = TRUE THEN -2 ELSE 0 END),
    bowling_points = (wickets * 25) + (maiden_overs * 8) + (dot_balls * 4) + 
        (CASE 
            WHEN wickets >= 5 THEN 20
            WHEN wickets = 4 THEN 15
            WHEN wickets = 3 THEN 10
            ELSE 0
        END),
    fielding_points = (catches * 8) + (stumpings * 12) + (run_outs * 6),
    total_points = 
        (runs_scored * 1) + (fours * 2) + (sixes * 3) + (CASE WHEN is_duck = TRUE THEN -2 ELSE 0 END) +
        (wickets * 25) + (maiden_overs * 8) + (dot_balls * 4) + 
        (CASE 
            WHEN wickets >= 5 THEN 20
            WHEN wickets = 4 THEN 15
            WHEN wickets = 3 THEN 10
            ELSE 0
        END) +
        (catches * 8) + (stumpings * 12) + (run_outs * 6)
WHERE gameweek_id IN (1, 2);
