# API Documentation - Fantasy Cricket Platform

Base URL: `http://localhost:3001/api`

All endpoints return JSON responses in the following format:

```json
{
  "success": true|false,
  "message": "Description of the result",
  "data": { ... } // Optional, contains response data
}
```

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### Register

Create a new user account.

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "secure_password",
  "full_name": "John Doe"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "full_name": "John Doe",
      "is_admin": false
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login

Authenticate a user and receive a JWT token.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "secure_password"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "full_name": "John Doe",
      "is_admin": false
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Verify Token

Verify the current JWT token is valid.

**Endpoint:** `GET /auth/verify`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "is_admin": false
    }
  }
}
```

## Admin Routes

All admin routes require authentication and admin role.

### Gameweeks

#### List Gameweeks

**Endpoint:** `GET /admin/gameweeks`

**Headers:** `Authorization: Bearer <admin_token>`

**Query Parameters:**
- `is_active` (optional): Filter by active status

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "gameweek_number": 1,
      "name": "Gameweek 1",
      "start_date": "2025-10-01",
      "end_date": "2025-10-07",
      "is_active": false,
      "is_completed": true
    }
  ]
}
```

#### Create Gameweek

**Endpoint:** `POST /admin/gameweeks`

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "gameweek_number": 3,
  "name": "Gameweek 3",
  "start_date": "2025-10-15",
  "end_date": "2025-10-21"
}
```

**Response:** `201 Created`

#### Update Gameweek

**Endpoint:** `PATCH /admin/gameweeks/:id`

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "is_active": true,
  "is_completed": false
}
```

**Response:** `200 OK`

### Fixtures

#### List Fixtures

**Endpoint:** `GET /admin/fixtures`

**Headers:** `Authorization: Bearer <admin_token>`

**Query Parameters:**
- `gameweek_id` (optional): Filter by gameweek

**Response:** `200 OK`

#### Create Fixture

**Endpoint:** `POST /admin/fixtures`

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "gameweek_id": 1,
  "home_team_id": 1,
  "away_team_id": 2,
  "match_date": "2025-10-15T19:30:00",
  "venue": "Wankhede Stadium, Mumbai"
}
```

**Response:** `201 Created`

### Player Points

#### Add Player Points

**Endpoint:** `POST /admin/player-points`

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "player_id": 1,
  "gameweek_id": 1,
  "fixture_id": 1,
  "runs_scored": 75,
  "fours": 8,
  "sixes": 2,
  "is_duck": false,
  "wickets": 0,
  "maiden_overs": 0,
  "dot_balls": 0,
  "catches": 1,
  "stumpings": 0,
  "run_outs": 0
}
```

**Response:** `201 Created`

#### Bulk Upload Player Points

**Endpoint:** `POST /admin/player-points/bulk`

**Headers:** 
- `Authorization: Bearer <admin_token>`
- `Content-Type: multipart/form-data`

**Request Body:** Form data with CSV file

CSV Format:
```csv
player_id,gameweek_id,fixture_id,runs_scored,fours,sixes,is_duck,wickets,maiden_overs,dot_balls,catches,stumpings,run_outs
1,1,1,75,8,2,0,0,0,0,1,0,0
2,1,1,45,4,1,0,0,0,0,0,1,0
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Bulk upload completed",
  "data": {
    "inserted": 2,
    "updated": 0,
    "errors": []
  }
}
```

## Leagues

### List Leagues

Get all public leagues or leagues the user is a member of.

**Endpoint:** `GET /leagues`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `is_public` (optional): Filter by public/private

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "league_name": "Global League",
      "league_code": "GLOBAL2025",
      "is_public": true,
      "max_members": 1000,
      "current_members": 245
    }
  ]
}
```

### Get League Details

**Endpoint:** `GET /leagues/:id`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

### Get League Leaderboard

Get rankings for a specific league.

**Endpoint:** `GET /leagues/:id/leaderboard`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `gameweek_id` (optional): Filter by specific gameweek
- `limit` (optional): Limit results (default: 100)
- `offset` (optional): Pagination offset

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "league": {
      "id": 1,
      "league_name": "Global League",
      "league_code": "GLOBAL2025"
    },
    "leaderboard": [
      {
        "rank": 1,
        "fantasy_team_id": 5,
        "team_name": "Dream Team",
        "owner_username": "cricket_fan",
        "owner_full_name": "John Doe",
        "total_points": 1245,
        "latest_gw_points": 85
      },
      {
        "rank": 2,
        "fantasy_team_id": 12,
        "team_name": "Champions",
        "owner_username": "jane_doe",
        "owner_full_name": "Jane Doe",
        "total_points": 1198,
        "latest_gw_points": 92
      }
    ]
  }
}
```

### Join League

**Endpoint:** `POST /leagues/:id/join`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "fantasy_team_id": 5
}
```

**Response:** `200 OK`

## Players

### List Players

Get all active players available for fantasy selection.

**Endpoint:** `GET /players`

**Query Parameters:**
- `role` (optional): Filter by role (Batsman, Bowler, All-Rounder, Wicket-Keeper)
- `team_id` (optional): Filter by real team
- `max_cost` (optional): Filter by maximum cost

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Virat Kohli",
      "real_team_id": 3,
      "team_code": "RCB",
      "role": "Batsman",
      "cost": 15.0,
      "rating": "A",
      "is_active": true
    }
  ]
}
```

### Get Player Details

**Endpoint:** `GET /players/:id`

**Response:** `200 OK`

### Get Player Stats

**Endpoint:** `GET /players/:id/stats`

**Query Parameters:**
- `gameweek_id` (optional): Filter by gameweek

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "player": {
      "id": 1,
      "name": "Virat Kohli",
      "role": "Batsman"
    },
    "stats": {
      "total_points": 245,
      "matches_played": 5,
      "average_points": 49.0,
      "recent_form": [85, 42, 58, 35, 25]
    }
  }
}
```

## Fantasy Teams

### List User's Teams

**Endpoint:** `GET /teams`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

### Create Fantasy Team

**Endpoint:** `POST /teams`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "team_name": "Dream Team"
}
```

**Response:** `201 Created`

### Update Team Squad

**Endpoint:** `POST /teams/:id/squads`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "gameweek_id": 3,
  "player_ids": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  "captain_player_id": 1,
  "vice_captain_player_id": 14
}
```

**Response:** `201 Created`

## Fixtures

### List Fixtures

Get all fixtures or filter by gameweek/status.

**Endpoint:** `GET /fixtures`

**Query Parameters:**
- `gameweek_id` (optional): Filter by gameweek
- `status` (optional): Filter by status (Scheduled, In Progress, Completed, Cancelled)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "gameweek_id": 1,
      "gameweek_number": 1,
      "home_team": "MI",
      "away_team": "CSK",
      "match_date": "2025-10-01T19:30:00",
      "venue": "Wankhede Stadium, Mumbai",
      "status": "Completed",
      "home_score": "185/6",
      "away_score": "178/8"
    }
  ]
}
```

## Meta/Statistics

### Dashboard Stats

Get aggregate statistics for dashboard.

**Endpoint:** `GET /meta/stats`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "total_users": 1250,
    "total_teams": 1450,
    "total_leagues": 85,
    "active_gameweek": {
      "id": 3,
      "gameweek_number": 3,
      "name": "Gameweek 3"
    },
    "top_players": [
      {
        "id": 1,
        "name": "Virat Kohli",
        "total_points": 245
      }
    ]
  }
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Must be a valid email address"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Access token required"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Admin access required"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 409 Conflict
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

### 429 Too Many Requests
```json
{
  "success": false,
  "message": "Too many requests, please try again later"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

## Rate Limiting

- Default: 100 requests per 15 minutes per IP
- Auth endpoints: 5 requests per 15 minutes per IP
- Headers included in response:
  - `X-RateLimit-Limit`: Maximum requests
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Timestamp when limit resets

## Pagination

Endpoints that return lists support pagination:

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

**Response includes:**
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

---

For more information, see the main README.md or Developer Guide.
