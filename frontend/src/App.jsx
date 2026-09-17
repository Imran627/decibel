import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./components/Toast";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";

import Login from "./pages/auth/Login";
import Dashboard from "./pages/Dashboard";
import EmployeeList from "./pages/employees/EmployeeList";
import EmployeeForm from "./pages/employees/EmployeeForm";
import EmployeeProfile from "./pages/employees/EmployeeProfile";
import Departments from "./pages/departments/Departments";
import Attendance from "./pages/attendance/Attendance";
import LeaveRequests from "./pages/leave/LeaveRequests";
import Holidays from "./pages/Holidays";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />

              <Route path="employees" element={<ProtectedRoute permission="employees.view"><EmployeeList /></ProtectedRoute>} />
              <Route path="employees/new" element={<ProtectedRoute permission="employees.create"><EmployeeForm /></ProtectedRoute>} />
              <Route path="employees/:id" element={<ProtectedRoute permission="employees.view"><EmployeeProfile /></ProtectedRoute>} />
              <Route path="employees/:id/edit" element={<ProtectedRoute permission="employees.edit"><EmployeeForm /></ProtectedRoute>} />

              <Route path="departments" element={<Departments />} />

              <Route path="attendance" element={<ProtectedRoute permission="attendance.view"><Attendance /></ProtectedRoute>} />
              <Route path="leave" element={<ProtectedRoute permission="leaves.view"><LeaveRequests /></ProtectedRoute>} />
              <Route path="holidays" element={<Holidays />} />
              <Route path="settings" element={<ProtectedRoute permission="settings.manage"><Settings /></ProtectedRoute>} />
            </Route>

            <Route path="*" element={<Dashboard />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
