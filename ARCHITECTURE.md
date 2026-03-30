# Sahayak - Full System Architecture & Data Flow

## 🌟 Vision
Sahayak (Sanskrit for "Helper") is a premium scheduling and payroll engine. It simplifies management for complex organizations where staff work across diverse locations with different qualification requirements, availability windows, and strict weekly hour caps.

---

## 🏗️ Technical Architecture

### 1. Frontend: React + Vite + Shadcn
The frontend is built for both **Admin** (schedulers) and **Staff** (responders).
- **Theme**: Sahara Modern (Custom HSL-based Tailwind tokens).
- **Pattern**: `Adapter Pattern`. All services (Staff, Block, Event, Assignment) have dual implementations:
  - `MockAdapter`: In-memory JS data for rapid UI prototyping.
  - `ApiAdapter`: Real Axios-based requests to the Node/Express backend.
- **State**: React Query manages the server-state synchronization (invalidating lists when an assignment changes).

### 2. Backend: Express + TypeORM + SQLite
The backend serves as the source of truth for all persistent data.
- **Engine**: The **Eligibility Engine** runs on the server to prevent over-scheduling or unqualified assignments.
- **Database**: SQLite manages 6 main entities with strict relational constraints:
  - `Block` (1:N) -> `EventInstance`
  - `Staff` (1:N) -> `Assignment`
  - `EventInstance` (1:N) -> `Assignment`
- **Controller/Service Pattern**: Keeps API logic separate from business logic (Staffing eligibility, calculation of weekly hours, etc).

---

## 🛰️ API Layer (Swagger UI)
The API follows a RESTful design.
- **Base URL**: `http://localhost:4000/api`
- **Documentation**: [Interactive Swagger UI](http://localhost:4000/api-docs) provides a living sandbox to test all endpoints.

---

## 🔄 Lifecycle of a Schedule (Data Flow)

### Step 1: Initialize Planning Period
1. Admin creates a **Block** ("Christmas Holidays").
2. The `BlockService` creates the record and, if configured, auto-generates recurring training sessions (Fridays).
3. `EventInstances` are created in the database, linked to their parent block.

### Step 2: Staffing & Validation
1. Admin opens an event detail page.
2. The frontend calls `GET /api/assignments/event/:id/eligible`.
3. The **Eligibility Engine** performs SQL queries to find all staff *not* on leave, *not* over hours, and *with* the required tags.
4. If an admin tries to force an assignment through `POST /api/assignments`, the server performs a second validation pass before saving.

### Step 3: Notification & Acceptance
1. `Sessional` staff are sent `INVITED` assignments.
2. In the frontend, the staff member sees a notification and can **Accept/Reject**.
3. Status updates in the database, triggered via `PUT /api/assignments/:id`.

### Step 4: Finalization (The Freeze)
1. Once all sessions meet `requiredStaffCount`, the block can be **Published**.
2. Once published, sessions are locked to ensure stable payroll reporting.
3. Roster is exported as CSV for physical distribution.
