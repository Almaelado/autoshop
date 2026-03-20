import { Navigate } from "react-router-dom";

export default function AdminVonal({ belepett, isAdmin, children }) {
  // Betöltés, amíg nem tudjuk
  if (isAdmin === null) return <div>Betöltés...</div>;

  if (!belepett) return <Navigate to="/bejelentkez" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return children;
}
