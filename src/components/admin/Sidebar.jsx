import { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ChevronLeft,
  LogOut,
  Shield,
  Flag,
} from "lucide-react";

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <div
        className={`
          fixed lg:relative z-50 h-screen 
          bg-[#050505] border-r border-white/5 
          transition-all duration-500 ease-[0.22, 1, 0.36, 1]
          ${isOpen ? "w-72" : "w-20"}
        `}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute -right-3 top-12 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)] z-50"
        >
          <ChevronLeft
            className={`w-3.5 h-3.5 text-black transition-transform duration-500 ${!isOpen && "rotate-180"}`}
            strokeWidth={3}
          />
        </button>

        {/* Branding Area - Logo Only */}
        <div className="h-24 flex items-center px-6 mb-4">
          <div className="flex items-center gap-4">
            <div className="min-w-[40px] h-10 rounded-4xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Shield className="w-5 h-5 text-black" strokeWidth={2.5} />
            </div>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="overflow-hidden whitespace-nowrap"
              >
                <h2 className="text-white uppercase font-medium tracking-wider text-lg">
                  Binge<span className="text-emerald-500">KAI</span>
                </h2>
                <p className="text-[10px] text-white uppercase tracking-[0.2em] font-medium">
                  Admin Panel
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="px-3 space-y-1.5">
          <NavItem
            to="/admin"
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            isOpen={isOpen}
          />
          <NavItem
            to="/admin/users"
            icon={<Users size={20} />}
            label="User Records"
            isOpen={isOpen}
          />
          <NavItem
            to="/admin/reports"
            icon={<Flag size={20} />}
            label="Moderation Hub"
            isOpen={isOpen}
          />
        </nav>

        {/* Bottom Utility Area */}
        <div className="absolute bottom-6 left-0 right-0 px-4">
          {/* A more visible, elegant separator */}
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-gray-700/50 to-transparent mb-6" />

          <button
            onClick={() => setShowLogoutModal(true)}
            className={`
      relative overflow-hidden group flex items-center gap-3 w-full px-4 py-3.5 rounded-xl
      transition-all duration-300 ease-in-out
      ${!isOpen ? "justify-center" : "justify-start"}
      /* Glass Background - subtle but solid enough to see */
      bg-white/[0.03] border border-white/[0.08]
      hover:bg-red-500/[0.08] hover:border-red-500/40
      shadow-lg hover:shadow-red-900/20
    `}
          >
            {/* Glow: Increased opacity for better visibility */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_center,_rgba(239,68,68,0.15)_0%,_transparent_70%)]" />

            <LogOut
              size={20}
              strokeWidth={2}
              className="
        relative z-10
        text-gray-400 group-hover:text-red-400 
        transition-all duration-300
      "
            />

            {isOpen && (
              <div className="flex flex-col items-start relative z-10 text-left">
                <span
                  className="
          text-sm font-semibold tracking-tight
          text-gray-200 group-hover:text-white 
          transition-colors duration-300
        "
                >
                  Secure Logout
                </span>
                <span
                  className="
          text-[10px] uppercase tracking-[0.05em] font-medium
          text-gray-500 group-hover:text-red-300/60 
          transition-colors duration-300
        "
                >
          
                </span>
              </div>
            )}

            {/* Status Indicator */}
            {isOpen && (
              <div className="ml-auto relative z-10">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-red-500 group-hover:shadow-[0_0_8px_rgba(239,68,68,0.8)] transition-all duration-300" />
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-96"
            >
              <div className="bg-[#0a0a0a] rounded-xl border border-white/10 shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="p-6 pb-4 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
                    <LogOut className="w-5 h-5 text-red-400" />
                  </div>
                  <h3 className="text-lg text-white font-medium mb-2">
                    Logout
                  </h3>
                  <p className="text-sm text-zinc-300">
                    Are you sure you want to logout?
                  </p>
                </div>

                {/* Actions */}
                <div className="p-4 pt-0 flex gap-3">
                  <button
                    onClick={() => setShowLogoutModal(false)}
                    className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function NavItem({ to, icon, label, isOpen }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `
        relative flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-500 group
        ${
          isActive
            ? "text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.02)]"
            : "text-white/40 hover:text-white hover:bg-white/[0.02] border border-transparent"
        }
        ${!isOpen && "justify-center"}
      `}
    >
      <div className="min-w-[20px] transition-transform duration-300 group-hover:scale-110">
        {icon}
      </div>

      {isOpen && (
        <span className="text-sm font-light tracking-wide whitespace-nowrap">
          {label}
        </span>
      )}

      {/* Active Indicator Pillar */}
      {({ isActive }) =>
        isActive && (
          <motion.div
            layoutId="activePillar"
            className="absolute left-0 w-[2px] h-5 bg-emerald-500 rounded-full"
          />
        )
      }
    </NavLink>
  );
}
