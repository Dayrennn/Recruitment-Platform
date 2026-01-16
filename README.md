# Recruitment Platform API

Backend REST API untuk sistem rekrutment berbasis **multi-tenancy, RBAC,** dan **JWT authentication.**

# Tech Stack

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- SuperTest + Jest

# Setup Instructions

## Clone Repository

```bash
git clone https://github.com/Dayrennn/Recruitment-Platform.git
cd Recruitment-Platform
```

## Install Dependencies

```bash
npm install
```

## Setup Environtment

Buat file .env

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/recruitment"
JWT_SECRET="your_jwt_secret_key"
PORT=3000
```

## Setup Database

```bash
npx prisma migrate dev
```

## Run Server

```bash
npm run dev
```

Server akan berjalan di http://localhost:3000

## Run Prisma Studio

```bash
npx prisma studio
```

Server akan berjalan di http://localhost:5000

## Authentication

buka postman, pada tab headers gunakan **Authorization dan Bearer (Token)** yang didapat dari login kecuali applicant creation

```bash
Authorization: Bearer <token>
```

## API Endpoints

### Authentication

- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me
- POST /api/auth/logout

### User Management

- POST /api/users
- GET /api/users
- GET /api/users/:id
- DELETE /api/users/:id

### Position Management

- POST /api/positions
- GET /api/positions
- GET /api/positions/:id
- PUT /api/positions/:id
- DELETE /api/positions/:id

### Applicant Management

- POST /api/applicants (Public)
- GET /api/applicants
- GET /api/applicants/:id
- PATCH /api/applicants/:id/status
- PATCH /api/applicants/:id/notes
- DELETE /api/applicants/:id

## Testing

Untuk testing menggunakan Jest + Supertest
Jalankan :

```bash
npm run test
```

## Notes

- Applicant endpoint bersifat public (no auth)
- Semua endpoint lain dilindungi dengan JWT
- Data terisolasi per company

# Final Assessment

API ini dirancang untuk mengikuti tes technical test

- Secure
- Type-safe
- Scalable
- Testable

# Struktur Folder

```bash
RECRUITMENT-PLATFORM
├── prisma/                   # Database & ORM
│   ├── migrations/
│   └── schema.prisma
│
├── src/                      # Source code backend
│   ├── controllers/          # Logic untuk route
│   │   ├── applicants.controllers.ts
│   │   ├── auth.controllers.ts
│   │   └── positions.controllers.ts
│   │
│   ├── libs/                 # Reusable library
│   │   └── prisma.ts
│   │
│   ├── middleware/           # Proteksi endpoint
│   │   └── auth.middleware.ts
│   │
│   ├── routes/               # Endpoint HTTP
│   │   ├── applicants.routes.ts
│   │   ├── auth.routes.ts
│   │   ├── position.routes.ts
│   │   └── user.routes.ts
│   │
│   ├── utils/                # Helper, JWT generator
│   │
│   └── server.ts             # Entry point
│
├── tests/                    # Unit & Integration tests
│   ├── auth.test.ts
│   ├── user.test.ts
│   ├── position.test.ts
│   └── applicant.test.ts
│
├── .env
├── package.json
├── tsconfig.json
└── Recruitment API.postman_collection.json

```
