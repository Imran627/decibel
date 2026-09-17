# Decibel HRM — Frontend (React Admin)

The employee-facing/admin React app: dashboard, employee management,
departments & designations, attendance, leave requests, holidays, and an
RBAC settings screen. Styled to match the Decibel brand (navy `#16305C`,
blue `#3B6FB6`, orange `#F59A04`, Plus Jakarta Sans + Inter).

This **does build successfully** (`npm run build` verified) against the API
contract defined in `../backend`. It has not been run against a live Laravel
server in this environment — do that locally to confirm end-to-end behavior.

## Setup

```bash
cd frontend
npm install
cp .env.example .env      # point VITE_API_URL at your running Laravel API
npm run dev
```

Runs at `http://localhost:5173`.

## What's included

- **Auth** — token-based login (Sanctum), persisted in `localStorage`,
  auto-redirect to `/login` on 401
- **RBAC on the frontend** — `useAuth().can('permission.name')` hides nav
  items and action buttons; the backend is still the real enforcement point
- **Dashboard** — live stats from `/api/dashboard`
- **Employees** — searchable/filterable/paginated list, add/edit form,
  profile view with leave balances
- **Departments & Designations** — inline CRUD
- **Attendance** — daily view, filter by employee/date, quick check-in/out
- **Leave Requests** — submit, filter by status, approve/reject
- **Holidays** — simple CRUD calendar
- **Settings** — create users, assign roles, edit role permissions
  (only visible/reachable with `settings.manage`)

## Structure

```
src/
├── components/     Shared UI: Icons, Feedback (loader/empty/error), Toast,
│                   Modal (confirm + pagination), Badges, ProtectedRoute
├── context/         AuthContext (user, permissions, login/logout)
├── layouts/          AdminLayout (sidebar + header)
├── pages/            Dashboard, employees/, attendance/, leave/,
│                     departments/, Holidays, Settings, auth/Login
├── services/         api.js (Axios instance) + one service file per domain
```

## Extending

Payroll, Performance, and Recruitment pages aren't built yet (matching the
backend's current scope). Follow the existing pattern:
1. Add a `xService.js` in `services/`
2. Add a page in `pages/<domain>/`
3. Wire the route in `App.jsx` and a nav entry in `layouts/AdminLayout.jsx`
   (with a `perm` if it should be gated)
