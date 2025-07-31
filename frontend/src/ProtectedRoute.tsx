import { Outlet, Navigate } from "react-router-dom";

export default function ProtectedRoute() {
  if (localStorage.getItem("token") !== null) {
    return <Outlet />;
  } else {
    return <Navigate to="/login" />;
  }
}
