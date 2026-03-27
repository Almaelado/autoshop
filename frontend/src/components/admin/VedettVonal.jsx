import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ belepett, children }) {
  if (!belepett) {
    return <Navigate to="/bejelentkez" replace />;
  }

  return children;
}