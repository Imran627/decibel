# Decibel HRM

A full-stack Human Resource Management system:

```
React.js (frontend/)  ──Axios──►  Laravel API (backend/)  ──Eloquent──►  MySQL
```

Styled consistently with the Decibel brand (see `../decibel-hcm-site.html`
in this project's marketing site).

## Contents

- **`backend/`** — Laravel 11 REST API: Auth (Sanctum), Employees,
  Departments, Designations, Attendance, Leave Management, Holidays,
  Announcements, Role-Based Access Control. See `backend/README.md`.
- **`frontend/`** — React 19 + Vite admin app consuming that API: dashboard,
  employee CRUD, attendance, leave approvals, RBAC settings. See
  `frontend/README.md`. **This half builds successfully** (`npm run build`
  verified in this environment).

## Honest status

- The **frontend is a real, buildable Vite project** — dependencies
  installed and `npm run build` passes.
- The **backend is complete, convention-correct Laravel code** (migrations,
  models, services, controllers, routes, seeders) but this sandbox has no
  PHP/Composer/MySQL, so it has **not been executed**. Run it locally to
  confirm before trusting it.
- Scope is intentionally the HRM core: Auth, Employees, Departments,
  Designations, Attendance, Leave, Holidays, Announcements, RBAC. Payroll,
  Performance Reviews, Recruitment, and Document management are **not**
  built — both READMEs flag this so nothing is assumed working that isn't.

## Quick start

```bash
# Backend
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan storage:link
php artisan serve            # http://localhost:8000

# Frontend (separate terminal)
cd frontend
npm install
cp .env.example .env
npm run dev                  # http://localhost:5173
```

Seeded login: `admin@decibel.test` / `password`

## Next steps

1. Get the backend running against real MySQL and smoke-test each endpoint
   in `backend/routes/api.php`.
2. Confirm the frontend talks to it end-to-end (login → dashboard →
   employees → attendance → leave approve/reject).
3. Add Payroll / Performance / Recruitment following the existing
   Service → Controller → Resource → Route pattern.
