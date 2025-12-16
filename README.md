# Security Playbook Builder

A full-stack application for creating and managing security automation playbooks. Built with React 18, NestJS, and PostgreSQL.

## Quick Start

### Development Mode (with hot-reload)

The easiest way to run the project is with Docker Compose:

```bash
# Clone the repository
git clone https://github.com/Avichai997/Infinity-Playblocks
cd "Infinity-Playblocks"

# Production mode
docker-compose up --build

# Development mode (with hot-reload)
NODE_ENV=development DOCKERFILE=Dockerfile.dev docker-compose up --build
```

That's it! The application will be available at:

- **Client**: http://localhost:5173
- **Server API**: http://localhost:3001/api
- **API Documentation (Swagger)**: http://localhost:3001/api/docs
- **Database**: localhost:5432

## Features

- User authentication with JWT and HTTP-only cookies
- Create, view, and delete security playbooks
- Simulate events to see which playbooks match
- Secure API with CSRF protection, CORS, and XSS prevention
- Dockerized setup for easy deployment

## Tech Stack

**Frontend:**

- React 18 with TypeScript
- Vite
- React Query v4
- Zustand
- Tailwind CSS

**Backend:**

- NestJS 11 with TypeScript
- TypeORM
- PostgreSQL
- JWT authentication
- bcrypt for password hashing
- Swagger/OpenAPI for API documentation

**Infrastructure:**

- Docker & Docker Compose
- PostgreSQL 15

## Prerequisites

- Node.js 20 (use `.nvmrc` if you have nvm: `nvm use`)
- Docker and Docker Compose
- npm or yarn

## Manual Setup (Development)

If you prefer to run services locally without Docker:

### 1. Database Setup

Start PostgreSQL (or use Docker for just the database):

```bash
docker-compose up db
```

### 2. Backend Setup

```bash
cd server
npm install
npm run start:dev
```

The server will run on http://localhost:3001

### 3. Frontend Setup

```bash
cd client
npm install
npm run dev
```

The client will run on http://localhost:5173

## Environment Variables

Create a `.env` file in the root directory (or copy from `.env.example`):

```env
# Database
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=playbook_db
DB_PORT=5432

# Server
SERVER_PORT=3001
NODE_ENV=development
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# Client
CLIENT_URL=http://localhost:5173
CLIENT_PORT=5173
VITE_API_URL=http://localhost:3001
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login (sets HTTP-only cookie)
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user
- `GET /api/auth/csrf-token` - Get CSRF token

### Playbooks

- `GET /api/playbooks` - Get all user's playbooks
- `POST /api/playbooks` - Create a new playbook
- `PATCH /api/playbooks/:id` - Update a playbook
- `DELETE /api/playbooks/:id` - Delete a playbook
- `GET /api/playbooks/simulate?trigger=TRIGGER_TYPE` - Simulate event

## API Documentation (OpenAPI/Swagger)

The server includes auto-generated OpenAPI/Swagger documentation for all API endpoints.

### Access the Documentation

Once the server is running, visit:

- **Swagger UI**: http://localhost:3001/api/docs

### Features

- **Interactive API Testing**: Try out endpoints directly from the browser
- **Request/Response Schemas**: View detailed schemas for all DTOs
- **Authentication Support**:
  - JWT Bearer token authentication
  - Cookie-based authentication (access_token)
- **Complete Endpoint Documentation**: All endpoints with descriptions, parameters, and examples

### Using the Documentation

1. **View Endpoints**: Browse all available API endpoints organized by tags (Authentication, Playbooks, Health)
2. **Test Endpoints**: Click "Try it out" on any endpoint to test it directly
3. **Authenticate**: Use the "Authorize" button at the top to set your JWT token or cookie
4. **View Schemas**: Check the "Schemas" section to see all data models and DTOs

The documentation is automatically generated from your code using decorators and will stay up-to-date as you modify your controllers and DTOs.

## Running Tests

```bash
# Backend tests
cd server
npm test

# With coverage
npm run test:cov
```

## Code Quality

The project uses ESLint and Prettier with Husky git hooks:

- **Pre-commit**: Runs lint-staged (ESLint + Prettier on staged files)
- **Pre-push**: Runs full lint and build checks

To format code manually:

```bash
# Server
cd server
npm run format
npm run lint

# Client
cd client
npm run lint
```

## Docker Commands

### Start Services

```bash
# Development mode (with hot-reload)
NODE_ENV=development DOCKERFILE=Dockerfile.dev docker-compose up --build

# Production mode
docker-compose up --build

# Run in background (detached mode)
docker-compose up -d --build
```

### Stop Services

```bash
docker-compose down
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f server
docker-compose logs -f client
docker-compose logs -f db
```

### Other Useful Commands

```bash
# Check running containers
docker-compose ps

# Rebuild specific service
docker-compose build server
docker-compose build client

# Restart a service
docker-compose restart server
```
