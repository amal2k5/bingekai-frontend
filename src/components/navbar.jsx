import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Bell,
  Users,
  LayoutGrid,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { FaUsers } from "react-icons/fa";

import {
  getPendingRequests,
  acceptFollowRequest,
  declineFollowRequest,
} from "../services/followService";
import api from "../api/api";

export default function Navbar() {
  const { token, logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const isAdmin = user?.is_staff;

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [requests, setRequests] = useState([]);
  const [count, setCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (token) fetchRequests();
    const handleUpdate = () => fetchRequests();
    window.addEventListener("followUpdated", handleUpdate);
    return () => window.removeEventListener("followUpdated", handleUpdate);
  }, [token]);

  const fetchRequests = async () => {
    try {
      const res = await getPendingRequests();
      setRequests(res.data);
      setCount(res.data.length);
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

const handleLogoutConfirm = () => {
  logout();
  setShowLogoutModal(false);
  navigate("/login", { replace: true }); 
};
  return (
    <>
<motion.nav
  initial={{ y: 0 }}
  animate={{ y: 0 }}
  className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
    scrolled
      ? "bg-black/80 backdrop-blur-xl border-b border-white/5 py-3 shadow-2xl"
      : "bg-transparent py-6"
  }`}
  style={{
    transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
    backdropFilter: scrolled ? "blur(12px)" : "blur(0px)"
  }}
/>
        <div className="max-w-7xl mx-auto px-10 flex items-center justify-between">
          {/* Logo Section */}
          <Link to="/" className="group flex items-center gap-2">
            <div className="text-2xl font-black tracking-tighter flex items-center">
              <span className="text-white group-hover:text-[#22c55e] transition-colors duration-300">
                BINGE
              </span>
              <span className="text-[#22c55e] group-hover:text-white transition-colors duration-300">
                KAI
              </span>
            </div>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-16">
            {token ? (
              <div className="flex items-center gap-14">
                <div className="flex items-center gap-8">
                  {isAdmin && (
                    <div className="relative group">
                      <motion.button
                        whileHover={{ y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate("/admin")}
                        className="relative px-4 py-2.5 bg-transparent border-b-2 border-transparent hover:border-[#22c55e] transition-all duration-300"
                      >
                        <ShieldCheck
                          size={18}
                          strokeWidth={1.5}
                          className="text-gray-400 group-hover:text-[#22c55e] transition-colors duration-300"
                        />
                      </motion.button>
                      <div className="absolute left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 pt-2 whitespace-nowrap">
                        <div className="bg-[#1a1a1a]/90 backdrop-blur-sm px-2.5 py-1 border border-white/10 rounded">
                          <span className="text-[9px] font-mono font-medium tracking-wider text-gray-300 whitespace-nowrap">
                            Admin Panel
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="relative group">
                    <motion.button
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate("/follow-requests")}
                      className="relative px-4 py-2.5 bg-transparent border-b-2 border-transparent hover:border-[#22c55e] transition-all duration-300"
                    >
                      <Users
                        size={18}
                        strokeWidth={1.5}
                        className="text-gray-400 group-hover:text-[#22c55e] transition-colors duration-300"
                      />
                      {count > 0 && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-[#22c55e] text-black text-[9px] font-mono font-black flex items-center justify-center"
                        >
                          {count > 99 ? "99+" : count}
                        </motion.div>
                      )}
                    </motion.button>
                    <div className="absolute left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 pt-2 whitespace-nowrap">
                      <div className="bg-[#1a1a1a]/90 backdrop-blur-sm px-2.5 py-1 border border-white/10 rounded">
                        <span className="text-[9px] font-mono font-medium tracking-wider text-gray-300 whitespace-nowrap">
                          Follow Requests
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="relative group">
                    <motion.button
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate("/users")}
                      className="relative px-4 py-2.5 bg-transparent border-b-2 border-transparent hover:border-[#22c55e] transition-all duration-300"
                    >
                      <LayoutGrid
                        size={18}
                        strokeWidth={1.5}
                        className="text-gray-400 group-hover:text-[#22c55e] transition-colors duration-300"
                      />
                    </motion.button>
                    <div className="absolute left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 pt-2 whitespace-nowrap">
                      <div className="bg-[#1a1a1a]/90 backdrop-blur-sm px-2.5 py-1 border border-white/10 rounded">
                        <span className="text-[9px] font-mono font-medium tracking-wider text-gray-300 whitespace-nowrap">
                          Explore Users
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="relative group">
                    <motion.button
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate("/profile")}
                      className="relative px-4 py-2.5 bg-transparent border-b-2 border-transparent hover:border-[#22c55e] transition-all duration-300"
                    >
                      <User
                        size={18}
                        strokeWidth={1.5}
                        className="text-gray-400 group-hover:text-[#22c55e] transition-colors duration-300"
                      />
                    </motion.button>
                    <div className="absolute left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 pt-2 whitespace-nowrap">
                      <div className="bg-[#1a1a1a]/90 backdrop-blur-sm px-2.5 py-1 border border-white/10 rounded">
                        <span className="text-[9px] font-mono font-medium tracking-wider text-gray-300 whitespace-nowrap">
                          My Profile
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative group ml-6">
                  <motion.button
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowLogoutModal(true)}
                    className="relative px-8 py-2.5 text-[10px] font-light tracking-[0.4em] text-white/70 bg-transparent transition-all duration-500 ease-in-out overflow-hidden group border border-white/[0.1] hover:border-red-600"
                  >
                    {/* The Premium Background Fill Layer */}
                    <div className="absolute inset-0 bg-red-600 translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-[0.19,1,0.22,1]" />

                    {/* Subtle Inner Shadow for Depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Text Layer */}
                    <span className="relative z-10 font-semibold group-hover:text-white transition-colors duration-300">
                      LOGOUT
                    </span>

                    {/* Corner Micro-Accents (Optional for added detail) */}
                    <div className="absolute top-0 left-0 w-1 h-1 border-t border-l border-white/20 group-hover:border-white/50" />
                    <div className="absolute bottom-0 right-0 w-1 h-1 border-b border-r border-white/20 group-hover:border-white/50" />
                  </motion.button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-14">
                <div className="flex items-center gap-8">
                  {/* Sign In - Minimalist Underline Style */}
                  <motion.button
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate("/login")}
                    className="relative text-[10px] font-semibold tracking-[0.3em] text-white/90 hover:text-white transition-colors duration-300 group"
                  >
                    LOGIN
                    <motion.div className="absolute -bottom-1 left-0 right-0 h-[1px] bg-[#22c55e] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </motion.button>

                  {/* Register - Premium Green Liquid Fill */}
                  <motion.button
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate("/register")}
                    className="relative h-9 px-8 text-[10px] font-light tracking-[0.3em] text-[#22c55e] bg-transparent border border-[#22c55e]/20 overflow-hidden group transition-all duration-500"
                  >
                    {/* The Green Liquid Fill */}
                    <div className="absolute inset-0 bg-[#22c55e] translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-[0.19,1,0.22,1]" />

                    {/* Text Layer */}
                    <span className="relative z-10 font-semibold group-hover:text-black transition-colors duration-300">
                      REGISTER
                    </span>

                    {/* Precision Hardware Corners */}
                    <div className="absolute top-0 left-0 w-[4px] h-[1px] bg-[#22c55e] opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 right-0 w-[4px] h-[1px] bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.button>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Logout Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-[360px] bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 shadow-2xl"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
            >
              <h2 className="text-xl font-bold text-white mb-3">
                Wait a minute!
              </h2>
              <p className="text-white/50 text-sm mb-8 leading-relaxed">
                Are you sure you want to end your session?
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleLogoutConfirm}
                  className="w-full py-3 bg-red-500/10 text-red-500 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all duration-300"
                >
                  Yes, Log Out
                </button>
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="w-full py-3 text-white/40 hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
