# GameVault API (Backend)

REST API for the GameVault application, built with **Node.js**, **Express** and **Prisma**.

The API handles:
- User authentication (JWT)
- Game CRUD operations
- Filtering, search and pagination
- Per-user data isolation (each user only sees their own games)

Database: **PostgreSQL**

---

## Tech Stack

- Node.js
- Express
- Prisma ORM
- PostgreSQL
- JSON Web Tokens (JWT)
- bcrypt (password hashing)

---

## Installation

Install dependencies:

npm install

---

## Environment Variables

Create a `.env` file at the root of the project:

PORT=4000
JWT_SECRET=your-secret-key
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/gamevault"

---

## Database Setup

Run Prisma migrations:

npx prisma migrate dev
npx prisma generate

Open prisma studio : npx prisma studio

---

## Running the Server

Start the API in development mode:

npm run dev
or
npm run dev:watch

The server will be available at:
http://localhost:4000

---

## Authentication

Authentication is handled using JWT.

- Users must register and login to access protected routes
- The token must be sent in the Authorization header

Example:

Authorization: Bearer YOUR_JWT_TOKEN

---

## Main Endpoints

Auth:
- POST /api/auth/register
- POST /api/auth/login

Games (protected):
- GET    /api/games
- POST   /api/games
- PUT    /api/games/:id
- DELETE /api/games/:id

---

## Data Ownership

Each game is linked to its owner (user).

- A user can only see their own games
- A user can only modify or delete their own games
- Ownership is enforced at the API level

---

## Notes

- Frontend repository: GameVault (React + Vite + Tailwind)
- Authentication is mandatory for all game-related routes
- PostgreSQL is used as the main database