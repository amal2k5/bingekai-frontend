import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  
  if (!user) {
    return <Navigate to="/login" replace />;
  }


  if (!user.is_staff) {
    return <Navigate to="/" replace />;
  }

  return children;
}