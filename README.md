# Finance Data Processing and Access Control Backend

Backend API for a finance dashboard with JWT auth, role-based access control, records CRUD, and summary analytics. Swagger UI is available at `/swagger`.

## Stack
- Node.js + TypeScript + Express
- PostgreSQL (Neon)
- Prisma ORM
- Zod validation
- Swagger UI

## Modular Architecture (Feature-Based)
Each feature lives in its own module folder under `src/modules`.

```
src/
  modules/
    auth/          # login
    users/         # user management
    records/       # finance records CRUD
    summary/       # dashboard analytics
  shared/
    config/        # env config
    lib/           # db
    middleware/    # auth, role guard, error handler
    types/         # constants
    utils/         # helpers
```

## Quick Start
```bash
npm install
npx prisma migrate dev --name init
npm run seed
npm run dev
```

Server runs at `http://localhost:3000` and Swagger UI at `http://localhost:3000/swagger`.

## Environment
Create a `.env` file (already provided) and adjust as needed:
```
DATABASE_URL="postgresql://..."
JWT_SECRET="change-this-secret"
JWT_EXPIRES_IN="7d"
PORT=3000
ADMIN_EMAIL="admin@example.com"
ADMIN_NAME="Admin"
ADMIN_PASSWORD="admin123"
```

## Authentication
- `POST /auth/login` returns a JWT token.
- Use `Authorization: Bearer <token>` for protected endpoints.

Roles:
- `VIEWER`: read-only records and summary
- `ANALYST`: read records and summary
- `ADMIN`: full CRUD + user management

## Core Endpoints
- `POST /auth/login`
- `GET /users` (ADMIN)
- `POST /users` (ADMIN)
- `PATCH /users/:id` (ADMIN)
- `GET /records`
- `POST /records` (ADMIN)
- `PATCH /records/:id` (ADMIN)
- `DELETE /records/:id` (ADMIN)
- `GET /summary/totals`
- `GET /summary/categories`
- `GET /summary/trends`
- `GET /summary/recent`

## Seeding Admin User
```bash
npm run seed
```

## Tests
```bash
npm test
```

Note: tests truncate `User` and `Record` tables in the connected database. Use a dedicated test database/schema if needed.

## Vercel Deployment
The API is set up for Vercel using `api/index.ts` and `vercel.json`. After deploying, access:
- `/swagger` for Swagger UI
- `/swagger.json` for the OpenAPI spec

## Assumptions
- Neon Postgres is available for development and deployment.
- No soft delete; records are deleted directly.
- Monthly trends are grouped by `YYYY-MM` based on the record date.
