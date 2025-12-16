import { Navigate } from "react-router-dom";

export default function AdminRoute({ belepett, isAdmin, children }) {


  if (!belepett) {
    return <Navigate to="/bejelentkez" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}