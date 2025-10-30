# Scoring System - Fantasy Cricket Platform

This document explains the exact scoring logic used in the Fantasy Cricket platform.

## Overview

The scoring system calculates points for fantasy teams based on real player performances in cricket matches. Points are awarded across three categories: Batting, Bowling, and Fielding.

## Scoring Categories

### 1. Batting Points

| Action | Points |
|--------|--------|
| Run | +1 per run |
| Four | +2 per boundary |
| Six | +3 per six |
| Duck | -2 (only if batted and out for 0) |

**Examples:**
- Player scores 50 runs with 5 fours and 2 sixes: `50 + (5×2) + (2×3) = 66 points`
- Player scores 0 and gets out (duck): `-2 points`
- Player scores 0 but remains not out: `0 points` (no penalty)

**Duck Penalty Rules:**
- Applied ONLY when:
  - Player batted (came to crease)
  - Scored 0 runs
  - Got out (not "not out")
- NOT applied when:
  - Player didn't bat
  - Player scored 0 but remained not out
  - Player is a bowler who didn't get to bat

### 2. Bowling Points

| Action | Points |
|--------|--------|
| Wicket | +25 per wicket |
| Maiden Over | +8 per maiden |
| Dot Ball | +4 per dot ball |
| 3-wicket haul | +10 bonus |
| 4-wicket haul | +15 bonus |
| 5+ wicket haul | +20 bonus |

**Important Notes:**
- Wickets exclude run-outs (run-outs are counted in fielding)
- Haul bonuses are cumulative with wicket points
- Only one haul bonus applies (the highest one)

**Examples:**
- Player takes 3 wickets, bowls 1 maiden, 15 dot balls:
  - Wickets: `3 × 25 = 75`
  - Maiden: `1 × 8 = 8`
  - Dots: `15 × 4 = 60`
  - Haul bonus: `10`
  - **Total: 153 points**

- Player takes 5 wickets, bowls 2 maidens, 20 dot balls:
  - Wickets: `5 × 25 = 125`
  - Maidens: `2 × 8 = 16`
  - Dots: `20 × 4 = 80`
  - Haul bonus: `20` (5+ wicket haul)
  - **Total: 241 points**

### 3. Fielding Points

| Action | Points |
|--------|--------|
| Catch | +8 per catch |
| Stumping | +12 per stumping |
| Run-out | +6 per run-out (direct or assist) |

**Examples:**
- Player takes 2 catches: `2 × 8 = 16 points`
- Wicketkeeper takes 1 catch and 1 stumping: `8 + 12 = 20 points`
- Player effects 1 run-out: `1 × 6 = 6 points`

## Total Player Points

The total points for a player in a gameweek are the sum of all three categories:

```
Total Points = Batting Points + Bowling Points + Fielding Points
```

### All-Round Performance Example

Player has the following performance:
- Batting: 45 runs, 4 fours, 1 six
- Bowling: 2 wickets, 0 maidens, 10 dot balls
- Fielding: 1 catch

**Calculation:**
```
Batting:  (45 × 1) + (4 × 2) + (1 × 3) = 45 + 8 + 3 = 56
Bowling:  (2 × 25) + (0 × 8) + (10 × 4) = 50 + 0 + 40 = 90
Fielding: (1 × 8) = 8

Total: 56 + 90 + 8 = 154 points
```

## Captain & Vice-Captain Multipliers

Fantasy teams must designate a Captain and Vice-Captain from their 11 players.

### Captain Rule
The Captain's base points are **multiplied by 2**.

**Example:**
- Player scores 85 base points
- As Captain: `85 × 2 = 170 points`

### Vice-Captain Rule
The Vice-Captain's points are multiplied by 2 **ONLY** if the Captain scored 0 base points.

**Scenarios:**

1. **Captain scores > 0:**
   - Captain: Gets 2x multiplier
   - Vice-Captain: Gets normal 1x points
   
   Example:
   - Captain: 50 base points → 100 points
   - Vice-Captain: 60 base points → 60 points

2. **Captain scores exactly 0:**
   - Captain: Gets 0 points (0 × 2 = 0)
   - Vice-Captain: Gets 2x multiplier
   
   Example:
   - Captain: 0 base points → 0 points
   - Vice-Captain: 60 base points → 120 points

3. **Captain scores negative (duck penalty):**
   - Captain: Gets -4 points (-2 × 2)
   - Vice-Captain: Gets normal 1x points (not 2x, because -2 ≠ 0)
   
   Example:
   - Captain: -2 base points → -4 points
   - Vice-Captain: 60 base points → 60 points

### Important Note
The vice-captain multiplier applies when the captain's **base_points = 0**, not when final points after multiplier = 0.

## Team Total Calculation

The total points for a fantasy team in a gameweek is calculated as:

```sql
Sum of all 11 players' points with captain/vice-captain logic applied
```

### Example Team Calculation

11-player squad with following base points:
- Player 1 (Captain): 75 points
- Player 2 (Vice-Captain): 60 points  
- Players 3-11: 45, 40, 38, 35, 30, 28, 25, 22, 20

**Calculation:**
```
Player 1 (Captain):  75 × 2 = 150
Player 2 (VC):       60 × 1 = 60  (captain scored > 0)
Player 3:            45 × 1 = 45
Player 4:            40 × 1 = 40
Player 5:            38 × 1 = 38
Player 6:            35 × 1 = 35
Player 7:            30 × 1 = 30
Player 8:            28 × 1 = 28
Player 9:            25 × 1 = 25
Player 10:           22 × 1 = 22
Player 11:           20 × 1 = 20

Total Team Points: 493
```

## Database Implementation

The scoring system is implemented using MySQL views for efficient calculation:

### 1. v_player_gw_base_points

Calculates base points for each player per gameweek:

```sql
base_points = 
  (runs_scored × 1) +
  (fours × 2) +
  (sixes × 3) +
  (CASE WHEN is_duck THEN -2 ELSE 0 END) +
  (wickets × 25) +
  (maiden_overs × 8) +
  (dot_balls × 4) +
  (haul_bonus) +
  (catches × 8) +
  (stumpings × 12) +
  (run_outs × 6)
```

### 2. v_fantasy_team_gw_points

Calculates total points for fantasy teams with captain logic:

```sql
SUM(
  CASE
    WHEN player = captain THEN base_points × 2
    WHEN player = vice_captain AND captain_base_points = 0 THEN base_points × 2
    ELSE base_points
  END
)
```

### 3. v_league_leaderboard

Provides per-league rankings using RANK() window function:

```sql
RANK() OVER (
  PARTITION BY league_id 
  ORDER BY total_points DESC
) as league_rank
```

## Scoring Constants Reference

For easy reference and updates, here are all scoring constants:

```javascript
const SCORING_CONSTANTS = {
  batting: {
    RUN: 1,
    FOUR: 2,
    SIX: 3,
    DUCK_PENALTY: -2
  },
  bowling: {
    WICKET: 25,
    MAIDEN_OVER: 8,
    DOT_BALL: 4,
    HAUL_3_WICKETS: 10,
    HAUL_4_WICKETS: 15,
    HAUL_5_PLUS_WICKETS: 20
  },
  fielding: {
    CATCH: 8,
    STUMPING: 12,
    RUN_OUT: 6
  },
  multipliers: {
    CAPTAIN: 2,
    VICE_CAPTAIN_IF_CAPTAIN_ZERO: 2,
    NORMAL: 1
  }
};
```

## Edge Cases

### 1. Player Did Not Play
- All stats are 0
- Base points = 0
- No duck penalty (didn't bat)

### 2. Player Batted But Didn't Face Ball
- Runs = 0, but not out
- Base points = 0
- No duck penalty (not out)

### 3. Bowler Who Didn't Bat Gets Out for Duck
- This is theoretically possible but rare
- Duck penalty DOES apply if they batted and got out for 0

### 4. Both Captain and Vice-Captain Score 0
- Captain: 0 × 2 = 0
- Vice-Captain: 0 × 2 = 0 (vice rule applies)
- Team still gets points from other 9 players

### 5. Captain Scores Negative (Duck)
- Captain: -2 × 2 = -4
- Vice-Captain: Normal points (not doubled, as -2 ≠ 0)

## Validation Rules

When entering player stats, the following validations apply:

1. All numeric stats must be >= 0
2. `is_duck` can only be TRUE if runs_scored = 0
3. Wickets don't include run-outs
4. A player can't be both captain and vice-captain
5. Captain and vice-captain must be in the 11-player squad
6. Squad must have exactly 11 players

## Testing the Scoring System

Sample test case:

```sql
-- Insert test performance
INSERT INTO player_gameweek_points 
  (player_id, gameweek_id, fixture_id, runs_scored, fours, sixes, 
   is_duck, wickets, maiden_overs, dot_balls, catches)
VALUES 
  (1, 1, 1, 102, 10, 3, FALSE, 0, 0, 0, 0);

-- Expected result from view:
-- Batting: (102 × 1) + (10 × 2) + (3 × 3) = 131
-- Bowling: 0
-- Fielding: 0
-- Total: 131 base points
-- As captain: 131 × 2 = 262 points

-- Verify
SELECT * FROM v_player_gw_base_points WHERE player_id = 1 AND gameweek_id = 1;
-- Should show base_points = 131
```

---

This scoring system is designed to reward all aspects of cricket performance while keeping calculations transparent and verifiable. For implementation details, see the SQL views in `database/migrations/003_views_scoring.sql`.
