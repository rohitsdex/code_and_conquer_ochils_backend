# Sahayak Staff Flow - Backend API

Professional Node.js (Express + TypeScript + TypeORM) backend for the **Sahayak Constraint-Driven Scheduling System**.

## 🏗️ Architecture Stack
- **Framework:** Express.js + Node.js
- **Language:** TypeScript
- **Database ORM:** TypeORM
- **Database:** SQL.js (SQLite WASM for local development)
- **API Documentation:** Swagger UI (OpenAPI 3.0)

## 🧊 Domain Model (TypeORM Entities)
1. `Block`: Container for scheduling periods (e.g., "Easter 2026").
2. `EventInstance`: Individual sessions (ASC, DRAMA, etc.) within a Block.
3. `Assignment`: Staff assigned to sessions with statuses (`INVITED`, `ACCEPTED`, `CONFIRMED`).
4. `Staff`: Staff members with qualifications, availability, and weekly hour caps.
5. `Location`: Venue details for sessions.
6. `Notification`: System-wide logs and alerts.

## 🛠️ Getting Started

### 1. Installation
```bash
npm install
```

### 2. Database Initialization & Seeding
This project uses SQLite powered by **SQL.js**. Before running the server, you **must** seed the database with mock data to match the frontend expectations.
```bash
npm run seed
```
*Note: This will delete the existing `staffflow.sqlite` (if any) and recreate it with fresh mock data.*

### 3. Run Development Server
```bash
npm run dev
```
The server will start on `http://localhost:4000`.

### 4. API Documentation
Once the server is running, you can access the interactive Swagger UI at:
👉 **[http://localhost:4000/api-docs](http://localhost:4000/api-docs)**

---

## 🔄 Business Logic & Constraints
The backend handles the core "Eligibility Engine":
- **Quals Check**: Verifies if staff has required tags.
- **Availability Check**: Matches event day-of-week against staff availability.
- **Leave Check**: Prevents assignment during staff leave periods.
- **Hours Cap**: Prevents assigning shifts that exceed weekly contracted hours.
