# PPMP — Project Portfolio Management Platform

Manage projects, track tasks and milestones, and turn your work into a public portfolio — all in one platform built for developers.

## Screenshots

### Home

![PPMP home](screenshots/home.png)

### Login

![PPMP login](screenshots/login.png)

### Register

![PPMP register](screenshots/register.png)

## Structure

```
ppmp/
├── ppmp-backend/   # Spring Boot 3 REST API (Java 25, PostgreSQL, Flyway)
└── ppmp-frontend/  # Next.js 16 web app (React 19, Tailwind CSS v4, TypeScript)
```

## Backend

- Spring Boot 3.5.3 · Java 25 · Maven
- PostgreSQL + Flyway migrations in `src/main/resources/db/migration`
- Swagger UI available at `/swagger-ui.html`

```bash
cd ppmp-backend
mvn spring-boot:run
```

Configuration via environment variables (`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`, `SMTP_*`, `REDIS_*`, `AWS_*`) — see `src/main/resources/application-dev.yml`.

### Default admin account

Seeded by the Flyway migration `V13__seed_data.sql`:

| Username | Password     | Role        |
| -------- | ------------ | ----------- |
| `admin`  | `Admin1234!` | SUPER_ADMIN |

## Frontend

- Next.js 16 · React 19 · TypeScript · Tailwind CSS v4
- API base URL defaults to `http://localhost:8080/api/v1` (override with `NEXT_PUBLIC_API_BASE_URL`)

```bash
cd ppmp-frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
