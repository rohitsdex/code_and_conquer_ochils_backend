# Code & Conquer Ochils Backend

This is the professional Node.js (Express + TypeScript + TypeORM) backend architecture for the **Constraint-Driven Scheduling System**.

## 🏗️ Architecture Stack
- **Framework:** Express.js + Node.js
- **Language:** TypeScript
- **Database ORM:** TypeORM
- **Database:** PostgreSQL (Preferred)
- **Validation:** Zod / Class-Validator (Incoming)

## 🧊 Domain Model (TypeORM Entities)
The backend exactly maps to the frontend constraint engine architecture:
1. `Block`: The top-level isolation period mapping Date Ranges.
2. `EventInstance`: The Session logic rigidly constrained within its parent Block ID.
3. `Assignment`: Staff members attached to Event Instances tracking their scheduling state (`DRAFT`, `INVITED`, `ACCEPTED`, `CONFIRMED`).

## 🔄 Availability Aggregator & Constraint Checks
In subsequent sprints, you will port the Frontend `AvailabilityAggregator` (Bookio / Zoho mock adapters) into this backend.
When an Assignment is triggered on `/api/assignments`, the Backend must physically execute the:
1. Shift Overlaps Check (±30m)
2. Weekly Hours Cap Constraint
3. Leave/Booking External Validation (Zoho/Bookio HR Systems integration)

## 🛠️ Getting Started

### 1. Database Setup
Ensure you have a PostgreSQL or SQLite instance running. Update your `.env` file (or hardcode standard values during dev in `src/config/database.ts`).

### 2. Installation
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

This will run `nodemon` connecting to `src/index.ts`. TypeORM will automatically synchronize your entity models directly into rigid SQL Data Tables.

### 4. Build for Production
```bash
npm run build
npm start
``` 
