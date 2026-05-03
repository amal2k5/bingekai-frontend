import { Outlet } from "react-router-dom";
import AdminSidebar from "../Sidebar";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-black text-white">


      <AdminSidebar />

      <div className="flex-1 p-6">
        <Outlet />
      </div>

    </div>
  );
}