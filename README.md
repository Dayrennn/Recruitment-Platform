# Recruitment Platform API

Backend REST API untuk sistem rekrutment berbasis **multi-tenancy, RBAC,** dan **JWT authentication.**

# Tech Stack

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication

# Setup Instructions

## Clone Repository

''' sh
git clone https://github.com/Dayrennn/Recruitment-Platform.git
cd Recruitment-Platform
'''

## Install Dependencies

'''npm install

## Setup Environtment

Buat file .env
'''DATABASE_URL="postgresql://user:password@localhost:5432/recruitment_db"
'''JWT_SECRET="your_secret_key"

## Setup Database

'''npx prisma migrate dev

## Run Server

'''npm run dev

## Run Prisma Studio

'''npx prisma studio

## Authentication

gunakan **Bearer Token:**
'''Authorization: Bearer <token>

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

RECRUITMENT-PLATFORM
├── prisma/ // Berisi konfigurasi database dan ORM
│ ├── migrations/
│ └── schema.prisma
│
├── src/ // Source code utama backend
│ ├── controllers/
│ │ ├── applicants.controllers.ts
│ │ ├── auth.controllers.ts
│ │ └── positions.controllers.ts
│ │
│ ├── libs/ // Library internal reusable
│ │ └── prisma.ts
│ │
│ ├── middleware/ // Proteksi endpoint
│ │ └── auth.middleware.ts
│ │
│ ├── routes/ // Endpoint HTTP
│ │ ├── applicants.routes.ts
│ │ ├── auth.routes.ts
│ │ ├── position.routes.ts
│ │ └── user.routes.ts
│ │
│ ├── utils/ // Entry point
│ |
│ └── server.ts
│
├── .env
├── package.json
├── README.md
|── Recruitment API.postman_collection.json //export postman
└── tsconfig.json
