# Security Playbook Builder

A full-stack application for creating and managing security automation playbooks. Built with React 18, NestJS, and PostgreSQL.

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
- NestJS with TypeScript
- TypeORM
- PostgreSQL
- JWT authentication
- bcrypt for password hashing

**Infrastructure:**
- Docker & Docker Compose
- PostgreSQL 15

## Prerequisites

- Node.js 20 (use `.nvmrc` if you have nvm: `nvm use`)
- Docker and Docker Compose
- npm or yarn

## Quick Start

The easiest way to run the project is with Docker Compose:

```bash
# Clone the repository
git clone https://github.com/Avichai997/Infinity-Playblocks
cd "Infinity Playblocks"

# Production mode
./docker-compose.sh up --build

# Development mode (with hot-reload)
./docker-compose.sh up --build --dev
```

**How it works:**
- The `docker-compose.sh` script handles the `--dev` flag
- Dockerfiles automatically detect `NODE_ENV` and run the appropriate command:
  - **Production**: Builds and runs production servers
  - **Development**: Runs dev servers with hot-reload (no build needed)

**Development mode features:**
- Server runs with `npm run start:dev` (hot-reload enabled)
- Client runs with `npm run dev` (Vite dev server with HMR)
- Source code is mounted as volumes for live updates
- Changes reflect immediately without rebuild

That's it! The application will be available at:
- **Client**: http://localhost:5173
- **Server API**: http://localhost:3001/api
- **Database**: localhost:5432

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
- `DELETE /api/playbooks/:id` - Delete a playbook
- `GET /api/playbooks/simulate?trigger=TRIGGER_TYPE` - Simulate event

## Project Structure

```
.
├── client/          # React frontend
│   ├── src/
│   │   ├── api/    # API calls
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/  # Zustand stores
│   │   └── types/
│   └── package.json
├── server/         # NestJS backend
│   ├── src/
│   │   ├── auth/   # Authentication module
│   │   ├── users/  # Users module
│   │   ├── playbooks/ # Playbooks module
│   │   └── common/ # Shared utilities
│   └── package.json
├── docker-compose.yml
└── README.md
```

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

```bash
# Production mode
./docker-compose.sh up              # Start services
./docker-compose.sh up -d           # Start in background
./docker-compose.sh up --build      # Rebuild and start
./docker-compose.sh down            # Stop services

# Development mode (add --dev flag)
./docker-compose.sh up --dev         # Start in dev mode
./docker-compose.sh up --build --dev # Rebuild and start in dev mode
./docker-compose.sh logs -f --dev   # View logs in dev mode
./docker-compose.sh down --dev      # Stop dev services
```

**Note:** The Dockerfiles automatically detect `NODE_ENV` and run the appropriate commands. No need to manually set `SERVER_COMMAND` or `CLIENT_COMMAND`.

## Troubleshooting

**Port already in use:**
- Change ports in `.env` or `docker-compose.yml`

**Database connection errors:**
- Make sure PostgreSQL is running
- Check database credentials in `.env`

**bcrypt build errors (local development):**
- This is normal - bcrypt will build correctly in Docker
- For local dev, you may need build tools installed

**CSRF token errors:**
- Make sure you're fetching the CSRF token before making POST/PUT/DELETE requests
- Check that cookies are being sent with requests

## License

Private project - All rights reserved
