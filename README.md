# Fantasy Cricket Platform

A production-quality Fantasy Cricket platform built with modern architecture, comprehensive features, and robust security.

## 🚀 Features

- **User Authentication**: Secure JWT-based authentication with bcrypt password hashing
- **Fantasy Teams**: Create and manage fantasy cricket teams
- **Live Scoring**: Real-time player performance tracking and scoring
- **Leagues**: Join public leagues or create private leagues with friends
- **Leaderboards**: Per-league rankings with detailed statistics
- **Admin Dashboard**: Comprehensive admin tools for managing gameweeks, fixtures, and player points
- **Modern UI**: Beautiful, responsive interface with TailwindCSS and dark mode support
- **Security**: Rate limiting, input validation, parameterized queries, and request sanitization

## 🏗️ Tech Stack

### Frontend
- **React 18** with hooks
- **Vite** for fast development and optimized builds
- **TailwindCSS 3** for modern styling
- **React Router 6** for navigation
- **Axios** for API communication

### Backend
- **Node.js 18+** with ES modules
- **Express** web framework
- **MySQL 8+** database with window functions and views
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Winston** for structured logging
- **Joi** for input validation

### Database
- Fully normalized schema (3NF/BCNF)
- SQL views for complex scoring calculations
- Strategic indexes for performance
- Comprehensive seed data

## 📋 Prerequisites

- Node.js 18 or higher
- MySQL 8 or higher
- npm or yarn

## 🔧 Installation

### 1. Clone the repository

```bash
git clone https://github.com/rasakahmed/Fantasy-Cricket.git
cd Fantasy-Cricket
```

### 2. Set up the database

```bash
# Create database
mysql -u root -p -e "CREATE DATABASE fantasy_cricket;"

# Create database user (optional but recommended)
mysql -u root -p -e "CREATE USER 'fantasy_user'@'localhost' IDENTIFIED BY 'your_password';"
mysql -u root -p -e "GRANT ALL PRIVILEGES ON fantasy_cricket.* TO 'fantasy_user'@'localhost';"
mysql -u root -p -e "FLUSH PRIVILEGES;"

# Run migrations in order
mysql -u fantasy_user -p fantasy_cricket < database/migrations/001_schema.sql
mysql -u fantasy_user -p fantasy_cricket < database/migrations/002_seed.sql
mysql -u fantasy_user -p fantasy_cricket < database/migrations/003_views_scoring.sql
mysql -u fantasy_user -p fantasy_cricket < database/migrations/004_indexes.sql
```

### 3. Backend setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your database credentials and JWT secret

# Start the backend server
npm start
# Or for development with auto-reload:
npm run dev
```

The backend API will be available at `http://localhost:3001`

### 4. Frontend setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 🔐 Environment Variables

### Backend (.env)

```env
NODE_ENV=development
PORT=3001

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=fantasy_user
DB_PASSWORD=your_password_here
DB_NAME=fantasy_cricket

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_this_in_production
JWT_REFRESH_EXPIRES_IN=30d

# CORS
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload
MAX_FILE_SIZE=5242880
```

## 📖 API Documentation

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "secure_password",
  "full_name": "John Doe"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "secure_password"
}
```

#### Verify Token
```http
GET /api/auth/verify
Authorization: Bearer <token>
```

### Admin Routes (Require admin role)

All admin routes require `Authorization: Bearer <admin_token>`

- `GET /api/admin/gameweeks` - List gameweeks
- `POST /api/admin/gameweeks` - Create gameweek
- `GET /api/admin/fixtures` - List fixtures
- `POST /api/admin/fixtures` - Create fixture
- `POST /api/admin/player-points` - Add player points
- `POST /api/admin/player-points/bulk` - Bulk upload player points

### Leagues

- `GET /api/leagues` - List all leagues
- `GET /api/leagues/:id/leaderboard` - Get league leaderboard with rankings

### Players

- `GET /api/players` - List all active players

### Teams

- `GET /api/teams` - Get user's fantasy teams

### Fixtures

- `GET /api/fixtures` - List fixtures

## 🎮 Scoring System

### Batting Points
- **Runs**: +1 per run
- **Fours**: +2 per four
- **Sixes**: +3 per six
- **Duck Penalty**: -2 (only if player batted and out for 0)

### Bowling Points
- **Wickets**: +25 per wicket (excludes run-outs)
- **Maiden Overs**: +8 per maiden over
- **Dot Balls**: +4 per dot ball
- **Haul Bonus**:
  - 3 wickets: +10
  - 4 wickets: +15
  - 5+ wickets: +20

### Fielding Points
- **Catches**: +8 per catch
- **Stumpings**: +12 per stumping
- **Run-outs**: +6 per run-out (direct or assist)

### Captain & Vice-Captain
- **Captain**: Points ×2
- **Vice-Captain**: Points ×2 only if captain scored 0 base points

## 🗄️ Database Schema

The database follows a normalized design (3NF/BCNF) with the following main tables:

- `users` - User accounts and authentication
- `real_teams` - Cricket teams (e.g., MI, CSK, RCB)
- `players` - Real cricket players
- `gameweeks` - Tournament rounds
- `fixtures` - Matches
- `fantasy_teams` - User-created fantasy teams
- `fantasy_team_squads` - Team composition per gameweek
- `fantasy_team_squad_players` - Individual players in squads
- `leagues` - Competition leagues
- `league_memberships` - Team memberships in leagues
- `player_gameweek_points` - Player performance and scoring

See `database/diagrams/schema.dbml` for the complete schema diagram (visualize at https://dbdiagram.io)

## 🧪 Testing

### Frontend Tests

```bash
cd frontend
npm test
```

### Backend Tests

```bash
cd backend
npm test
```

## 🔒 Security Features

- **Password Hashing**: bcrypt with 12 rounds
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Prevents brute force attacks
- **Input Validation**: Joi schema validation on all inputs
- **SQL Injection Prevention**: Parameterized queries with mysql2
- **CORS**: Configured cross-origin resource sharing
- **Helmet**: Security headers middleware

## 👥 Admin User

The seed data creates a default admin user:
- **Email**: admin@fantasycricket.com
- **Password**: admin123

⚠️ **Important**: Change this password in production!

To promote an existing user to admin:

```sql
UPDATE users SET is_admin = TRUE WHERE email = 'user@example.com';
```

## 📱 Features Overview

### For Players
- Create and manage fantasy teams
- Select 11 players within budget
- Choose captain and vice-captain
- Join multiple leagues
- Track live scores and rankings
- View detailed statistics

### For Admins
- Manage gameweeks and fixtures
- Add player performance data
- Bulk upload points via CSV
- View analytics and insights
- Manage users and leagues

## 🚢 Deployment

### Production Build

```bash
# Frontend
cd frontend
npm run build
# Outputs to frontend/dist

# Backend
cd backend
# Set NODE_ENV=production in .env
# Use a process manager like PM2
pm2 start server.js --name fantasy-cricket-api
```

### Environment Setup

1. Set up MySQL database on production server
2. Run all migrations
3. Configure environment variables with production values
4. Use strong JWT secrets
5. Enable HTTPS
6. Configure reverse proxy (nginx/Apache)
7. Set up logging and monitoring

## 📄 License

ISC

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please use the GitHub issue tracker.

---

Built with ❤️ for cricket fans worldwide
