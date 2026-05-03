import { Navigate, Outlet, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const isTokenValid = (token) => {
  if (!token) return false;
  try {
    const { exp } = jwtDecode(token);
    return Date.now() < exp * 1000 - 10000; // 10s buffer
  } catch {
    return false;
  }
};

export default function ProtectedRoute() {
  const location = useLocation();
  const token = localStorage.getItem("access");
  const refresh = localStorage.getItem("refresh");

  console.log("=== PROTECTED ROUTE ===");
  console.log("access token:", token ? "EXISTS" : "MISSING");
  console.log("refresh token:", refresh ? "EXISTS" : "MISSING");
  console.log("token valid:", isTokenValid(token));

  if (!token && !refresh) {
    if (refresh) {
      return <Navigate to="/login" replace />;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
