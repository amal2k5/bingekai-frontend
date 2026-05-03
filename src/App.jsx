import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Register from "./auth/Register";
import VerifyEmail from "./auth/VerifyEmail";
import Login from "./auth/Login";
import Home from "./pages/Home";
import Navbar from "./components/navbar";
import { Toaster } from "react-hot-toast";
import Profile from "./pages/Profile";
import EnableMFA from "./pages/EnableMFA";
import VerifyMFA from "./pages/VerifyMFA";
import MFA from "./pages/MFA";
import ProtectedRoute from "./routes/ProtectedRoute";
import MovieDetail from "./pages/MovieDetail";
import Movies from "./pages/Movies";
import WatchlistPage from "./pages/WatchlistPage";
import ActivityPage from "./pages/OwnUserRRPage";
import MyListsPage from "./pages/MyListsPage";
import ListDetailPage from "./pages/ListDetailPage";
import PublicProfilePage from "./pages/profile/PublicProfile";
import FollowRequestsPage from "./pages/profile/FollowRequestsPage";
import UserConnectionsPage from "./pages/profile/UserConnectionsPage";
import ConnectionsPage from "./pages/social/ConnectionsPage";
import ActivityFeedPage from "./pages/profile/ActivityFeedPage";
import UsersPage from "./pages/social/SuggestedUsers";
import Recommendations from "./pages/social/MovieRecommendations";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRoute from "./routes/AdminRoute";
import AdminLayout from "./components/admin/layouts/AdminLayout";
import AdminUsersPage from "./pages/admin/UsersManagement";
import AdminReportsPage from "./pages/admin/reports/AdminReports";

function AppRoutes() {
  const location = useLocation();

  const hideNavbarRoutes = [
    "/login",
    "/register",
    "/mfa",
    "/verify-mfa",
    "/verify-email",
  ];

  const hideNavbar =
    hideNavbarRoutes.includes(location.pathname) ||
    location.pathname.startsWith("/admin");

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mfa" element={<MFA />} />
        <Route path="/verify-mfa" element={<VerifyMFA />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/users/:id" element={<PublicProfilePage />} />
        <Route path="/lists/public/:id" element={<ListDetailPage />} />
        <Route path="/follow-requests" element={<FollowRequestsPage />} />
        <Route path="/users/:id/followers" element={<UserConnectionsPage />} />
        <Route path="/users/:id/following" element={<UserConnectionsPage />} />
        <Route path="/users/:id/connections" element={<ConnectionsPage />} />
        <Route path="/connections/:id" element={<ConnectionsPage />} />
        <Route path="/feed" element={<ActivityFeedPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/recommendations" element={<Recommendations />} />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="reports" element={<AdminReportsPage />} />
        </Route>

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/enable-mfa" element={<EnableMFA />} />
          <Route path="/watchlist" element={<WatchlistPage />} />
          <Route path="/watchlist/:collectionId" element={<WatchlistPage />} />
          <Route path="/activity" element={<ActivityPage />} />
          <Route path="/lists" element={<MyListsPage />} />
          <Route path="/lists/:id" element={<ListDetailPage />} />
        </Route>
      </Routes>
    </>
  );
}

function App() {


  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#121212",
            color: "#fff",
            border: "1px solid #00ff88"
          }
        }}
      />
      <AppRoutes />
    </>
  );
}

export default App;