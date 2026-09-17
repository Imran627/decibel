# Decibel HRM — Backend (Laravel API)

REST API for the Decibel HRM system: employees, departments, designations,
attendance, leave management, holidays, announcements, and role-based access
control, authenticated with Laravel Sanctum.

> **This code was written outside a runnable PHP/Composer/MySQL environment
> and has not been executed.** It follows standard Laravel 11 conventions,
> but budget time to install, migrate, and smoke-test it locally before
> trusting it in any real deployment.

## What's included

- Auth: Sanctum token login/logout/current-user
- Employees: full CRUD, search, filter by department/status, sort, pagination
- Departments & Designations: CRUD, guarded against deleting ones in use
- Attendance: check-in/out, manual correction, work-hours & overtime computed
  server-side
- Leave: leave types, leave requests, approve/reject with balance
  enforcement, per-employee balances
- Holidays & Announcements: CRUD
- Dashboard: real aggregate stats (headcount, present/absent today, pending
  leave, upcoming birthdays/holidays)
- RBAC: roles + permissions tables, `permission:*` middleware enforced on
  every sensitive route, Super Admin bypass
- Activity log for key HR actions

**Not included in this pass** (flagged so nothing is assumed working):
Payroll, Performance Reviews, Recruitment, Document management,
Notifications beyond the DB log. These follow the same
model → service → controller → resource pattern already in place, so they're
straightforward to add next.

## Local setup

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate

# create a MySQL database matching .env (DB_DATABASE=decibel_hrm) first
php artisan migrate
php artisan db:seed
php artisan storage:link

php artisan serve
```

API will be at `http://localhost:8000/api`.

### Seeded login

```
admin@decibel.test / password        (Super Admin)
hr.manager@decibel.test / password   (HR Manager, linked to an Employee record)
```

Change or remove these before any real deployment.

## Project structure

```
app/
├── Http/
│   ├── Controllers/Api/          Employee, Department, Attendance, Leave...
│   ├── Controllers/Api/Admin/    User & Role management
│   ├── Requests/                 Form validation
│   ├── Resources/                JSON response shaping
│   └── Middleware/HasPermission.php
├── Models/
├── Services/                     LeaveService, AttendanceService, ActivityLogger
database/
├── migrations/
└── seeders/
routes/api.php
```

## API response format

Success:
```json
{ "success": true, "message": "...", "data": { } }
```

Validation error (422):
```json
{ "success": false, "message": "Validation failed", "errors": { } }
```

## Security notes

- CORS is locked to `FRONTEND_URL` in `config/cors.php` — do not switch to `*`.
- Salary and attendance work-hours are always computed/validated server-side,
  never trusted from the client.
- Sensitive routes require both `auth:sanctum` and a `permission:*` check.
- Set `APP_DEBUG=false` and a real `APP_KEY` before deploying anywhere public.

## Next steps

1. `composer install` and get migrations running against a real MySQL instance.
2. Wire up the `frontend/` React app's `.env` (`VITE_API_URL`) to this API.
3. Add Payroll / Performance / Recruitment modules following the existing
   Service + Controller + Resource pattern once the core slice is verified.
