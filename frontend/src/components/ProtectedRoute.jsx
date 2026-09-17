import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader } from "./Feedback";

export default function ProtectedRoute({ children, permission }) {
  const { user, loading, can } = useAuth();

  if (loading) return <Loader label="Checking session..." />;
  if (!user) return <Navigate to="/login" replace />;
  if (permission && !can(permission)) {
    return (
      <div className="text-center py-20">
        <p className="font-display font-bold text-navy text-lg">Access restricted</p>
        <p className="text-sm text-slate mt-1">You don't have permission to view this page.</p>
      </div>
    );
  }
  return children;
}
