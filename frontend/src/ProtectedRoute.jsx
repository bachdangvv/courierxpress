import { Navigate } from "react-router-dom";
import { useAuth } from "./auth";

export default function ProtectedRoute({ children }) {
  const { user, booted } = useAuth();

  if (!booted) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;

  return children;
}
