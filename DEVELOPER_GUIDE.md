# Developer Guide - Fantasy Cricket Platform

This guide provides detailed information for developers working on the Fantasy Cricket platform.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Development Setup](#development-setup)
3. [Database Management](#database-management)
4. [API Development](#api-development)
5. [Frontend Development](#frontend-development)
6. [Testing](#testing)
7. [Code Style](#code-style)
8. [Common Tasks](#common-tasks)

## Project Structure

```
Fantasy-Cricket/
├── backend/                 # Node.js/Express backend
│   ├── config/             # Configuration files
│   │   └── database.js     # Database connection pool
│   ├── controllers/        # Request handlers
│   │   └── auth.controller.js
│   ├── middleware/         # Express middleware
│   │   ├── auth.js         # JWT authentication
│   │   ├── validate.js     # Input validation
│   │   ├── rateLimiter.js  # Rate limiting
│   │   └── errorHandler.js # Error handling
│   ├── routes/             # API route definitions
│   │   ├── auth.routes.js
│   │   ├── admin.routes.js
│   │   ├── league.routes.js
│   │   └── ...
│   ├── services/           # Business logic
│   ├── models/             # Database models
│   ├── utils/              # Utility functions
│   │   ├── logger.js       # Winston logger
│   │   └── validators.js   # Joi validation schemas
│   ├── tests/              # Backend tests
│   ├── .env.example        # Environment template
│   ├── server.js           # Entry point
│   └── package.json
├── frontend/               # React/Vite frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── assets/         # Static assets
│   │   ├── data/           # Mock/static data
│   │   ├── App.jsx         # Main app component
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Global styles
│   ├── public/             # Public assets
│   ├── tailwind.config.js  # Tailwind configuration
│   ├── vite.config.js      # Vite configuration
│   └── package.json
└── database/               # Database files
    ├── migrations/         # SQL migration files
    │   ├── 001_schema.sql
    │   ├── 002_seed.sql
    │   ├── 003_views_scoring.sql
    │   └── 004_indexes.sql
    └── diagrams/           # Database diagrams
        └── schema.dbml
```

## Development Setup

### Initial Setup

1. **Install dependencies**

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

2. **Set up MySQL database**

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE fantasy_cricket;

# Create user
CREATE USER 'fantasy_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON fantasy_cricket.* TO 'fantasy_user'@'localhost';
FLUSH PRIVILEGES;
```

3. **Run migrations**

```bash
# From project root
mysql -u fantasy_user -p fantasy_cricket < database/migrations/001_schema.sql
mysql -u fantasy_user -p fantasy_cricket < database/migrations/002_seed.sql
mysql -u fantasy_user -p fantasy_cricket < database/migrations/003_views_scoring.sql
mysql -u fantasy_user -p fantasy_cricket < database/migrations/004_indexes.sql
```

4. **Configure environment**

```bash
cd backend
cp .env.example .env
# Edit .env with your settings
```

5. **Start development servers**

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Development Workflow

1. Create a feature branch
2. Make changes
3. Run linters: `npm run lint`
4. Run tests: `npm test`
5. Build: `npm run build`
6. Commit and push

## Database Management

### Creating Migrations

Always create migrations for schema changes. Use sequential numbering:

```sql
-- database/migrations/005_add_new_feature.sql
ALTER TABLE users ADD COLUMN phone VARCHAR(20);
```

### Running Migrations

```bash
mysql -u fantasy_user -p fantasy_cricket < database/migrations/005_add_new_feature.sql
```

### Rolling Back

Create a rollback script:

```sql
-- database/migrations/005_add_new_feature_rollback.sql
ALTER TABLE users DROP COLUMN phone;
```

### Useful Queries

```sql
-- Check database structure
SHOW TABLES;
DESCRIBE users;

-- View data
SELECT * FROM users LIMIT 10;

-- Check view definitions
SHOW CREATE VIEW v_player_gw_base_points;

-- Test scoring view
SELECT * FROM v_player_gw_base_points WHERE gameweek_id = 1;

-- Test leaderboard view
SELECT * FROM v_league_leaderboard WHERE league_id = 1 ORDER BY league_rank;
```

## API Development

### Creating a New Endpoint

1. **Define validation schema** (`utils/validators.js`)

```javascript
export const createGameweekSchema = Joi.object({
  gameweek_number: Joi.number().integer().min(1).required(),
  name: Joi.string().max(100).required(),
  start_date: Joi.date().required(),
  end_date: Joi.date().greater(Joi.ref('start_date')).required()
});
```

2. **Create controller** (`controllers/gameweek.controller.js`)

```javascript
import db from '../config/database.js';
import { logger } from '../utils/logger.js';

export const createGameweek = async (req, res, next) => {
  try {
    const { gameweek_number, name, start_date, end_date } = req.validatedData;
    
    const [result] = await db.query(
      'INSERT INTO gameweeks (gameweek_number, name, start_date, end_date) VALUES (?, ?, ?, ?)',
      [gameweek_number, name, start_date, end_date]
    );
    
    logger.info('Gameweek created', { id: result.insertId, name });
    
    res.status(201).json({
      success: true,
      message: 'Gameweek created successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    next(error);
  }
};
```

3. **Create route** (`routes/admin.routes.js`)

```javascript
import { createGameweek } from '../controllers/gameweek.controller.js';
import { validate } from '../middleware/validate.js';
import { createGameweekSchema } from '../utils/validators.js';

router.post('/gameweeks', 
  validate(createGameweekSchema), 
  createGameweek
);
```

### Testing API Endpoints

```bash
# Using curl
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@fantasycricket.com","password":"admin123"}'

# Using httpie
http POST localhost:3001/api/auth/login \
  email=admin@fantasycricket.com \
  password=admin123
```

## Frontend Development

### Creating Components

Follow this pattern for new components:

```jsx
// src/components/MyComponent.jsx
import { useState } from 'react';

function MyComponent({ prop1, prop2 }) {
  const [state, setState] = useState(initialValue);
  
  return (
    <div className="p-4 rounded-lg bg-white dark:bg-gray-800">
      {/* Component content */}
    </div>
  );
}

export default MyComponent;
```

### TailwindCSS Best Practices

```jsx
// Use semantic utility classes
<button className="btn-primary">Click me</button>

// Responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// Dark mode support
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">

// Hover states
<button className="hover:bg-blue-700 transition-colors duration-200">
```

### Making API Calls

```jsx
import { useState, useEffect } from 'react';

function MyComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3001/api/endpoint', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) throw new Error('Request failed');
        
        const result = await response.json();
        setData(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return <div>{/* Render data */}</div>;
}
```

## Testing

### Backend Unit Tests

```javascript
// tests/auth.controller.test.js
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../server.js';

describe('Auth Controller', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        full_name: 'Test User'
      });
    
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.token).toBeDefined();
  });
});
```

### Frontend Component Tests

```jsx
// src/components/__tests__/Button.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../Button';

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
  
  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## Code Style

### Backend

- Use ES modules (`import/export`)
- Use async/await for asynchronous code
- Always use parameterized queries
- Log important events with Winston
- Handle errors with try/catch and next(error)
- Validate all inputs with Joi

### Frontend

- Use functional components with hooks
- Destructure props
- Keep components small and focused
- Use TailwindCSS utilities
- Handle loading and error states
- Clean up effects with return functions

## Common Tasks

### Promoting a User to Admin

```sql
UPDATE users SET is_admin = TRUE WHERE email = 'user@example.com';
```

### Resetting Database

```bash
# Drop and recreate
mysql -u root -p -e "DROP DATABASE IF EXISTS fantasy_cricket; CREATE DATABASE fantasy_cricket;"

# Run all migrations
mysql -u fantasy_user -p fantasy_cricket < database/migrations/001_schema.sql
mysql -u fantasy_user -p fantasy_cricket < database/migrations/002_seed.sql
mysql -u fantasy_user -p fantasy_cricket < database/migrations/003_views_scoring.sql
mysql -u fantasy_user -p fantasy_cricket < database/migrations/004_indexes.sql
```

### Adding New Dependencies

```bash
# Backend
cd backend
npm install package-name
# Check for vulnerabilities
npm audit

# Frontend
cd frontend
npm install package-name
```

### Debugging

**Backend:**
```bash
# Enable debug logging
LOG_LEVEL=debug npm run dev

# Check logs
tail -f backend/logs/combined.log
```

**Frontend:**
```javascript
// Use React DevTools browser extension
// Add console.logs for debugging
console.log('Component state:', state);
```

### Performance Optimization

**Database:**
- Add indexes for frequently queried columns
- Use EXPLAIN to analyze query performance
- Use views for complex calculations
- Consider caching for expensive queries

**Frontend:**
- Use React.memo for expensive components
- Implement virtual scrolling for long lists
- Lazy load routes and components
- Optimize images and assets

## Security Checklist

- [ ] All inputs validated with Joi
- [ ] SQL queries use parameterized statements
- [ ] Passwords hashed with bcrypt (12+ rounds)
- [ ] JWT secrets are strong and environment-specific
- [ ] Rate limiting enabled on auth routes
- [ ] CORS configured properly
- [ ] Helmet middleware enabled
- [ ] Error messages don't leak sensitive info
- [ ] Admin routes check is_admin flag
- [ ] File uploads validated and size-limited

## Troubleshooting

### Common Issues

**Database connection fails:**
- Check MySQL is running: `systemctl status mysql`
- Verify credentials in .env
- Check firewall rules

**JWT token issues:**
- Ensure JWT_SECRET is set in .env
- Check token expiration time
- Verify Authorization header format

**CORS errors:**
- Update CORS_ORIGIN in backend .env
- Check frontend API URL configuration

**Build fails:**
- Clear node_modules and reinstall
- Check for syntax errors
- Verify all dependencies are installed

---

For more information, see the main README.md or create an issue on GitHub.
