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
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ 
          duration: 0.5, 
          ease: [0.16, 1, 0.3, 1],
          type: "spring",
          stiffness: 120,
          damping: 20
        }}
        // className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        //   scrolled
        //     ? "bg-black/80 backdrop-blur-xl border-b border-white/10 py-3 shadow-2xl"
        //     : "bg-transparent py-5"
        // }`}
      >
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
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/admin")}
                        className="relative px-4 py-2 bg-transparent transition-all duration-300"
                      >
                        <ShieldCheck
                          size={18}
                          strokeWidth={1.5}
                          className="text-gray-400 group-hover:text-[#22c55e] transition-colors duration-300"
                        />
                      </motion.button>
                      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 whitespace-nowrap">
                        <div className="bg-[#1a1a1a]/90 backdrop-blur-sm px-2.5 py-1 border border-white/10 rounded text-[10px] font-mono text-gray-300">
                          Admin Panel
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="relative group">
                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate("/follow-requests")}
                      className="relative px-4 py-2 bg-transparent transition-all duration-300"
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
                          className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-[#22c55e] text-black text-[9px] font-mono font-black flex items-center justify-center rounded"
                        >
                          {count > 99 ? "99+" : count}
                        </motion.div>
                      )}
                    </motion.button>
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 whitespace-nowrap">
                      <div className="bg-[#1a1a1a]/90 backdrop-blur-sm px-2.5 py-1 border border-white/10 rounded text-[10px] font-mono text-gray-300">
                        Follow Requests
                      </div>
                    </div>
                  </div>

                  <div className="relative group">
                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate("/users")}
                      className="relative px-4 py-2 bg-transparent transition-all duration-300"
                    >
                      <LayoutGrid
                        size={18}
                        strokeWidth={1.5}
                        className="text-gray-400 group-hover:text-[#22c55e] transition-colors duration-300"
                      />
                    </motion.button>
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 whitespace-nowrap">
                      <div className="bg-[#1a1a1a]/90 backdrop-blur-sm px-2.5 py-1 border border-white/10 rounded text-[10px] font-mono text-gray-300">
                        Explore Users
                      </div>
                    </div>
                  </div>

                  <div className="relative group">
                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate("/profile")}
                      className="relative px-4 py-2 bg-transparent transition-all duration-300"
                    >
                      <User
                        size={18}
                        strokeWidth={1.5}
                        className="text-gray-400 group-hover:text-[#22c55e] transition-colors duration-300"
                      />
                    </motion.button>
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 whitespace-nowrap">
                      <div className="bg-[#1a1a1a]/90 backdrop-blur-sm px-2.5 py-1 border border-white/10 rounded text-[10px] font-mono text-gray-300">
                        My Profile
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative group ml-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setShowLogoutModal(true)}
                    className="relative px-6 py-2 text-[11px] font-medium tracking-[0.2em] text-red-400 bg-red-500/5 border border-red-500/30 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300"
                  >
                    LOGOUT
                  </motion.button>
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 whitespace-nowrap">
                    <div className="bg-red-500/90 backdrop-blur-sm px-2.5 py-1 rounded text-[10px] font-mono text-white">
                      End Session
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-8">
                <motion.button
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/login")}
                  className="relative text-[11px] font-medium tracking-[0.2em] text-white/70 hover:text-white transition-colors duration-300 group"
                >
                  SIGN IN
                  <motion.div 
                    className="absolute -bottom-1 left-0 right-0 h-px bg-[#22c55e] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                  />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/register")}
                  className="px-6 py-2 text-[11px] font-medium tracking-[0.2em] text-[#22c55e] border border-[#22c55e]/30 rounded-lg hover:bg-[#22c55e] hover:text-black transition-all duration-300"
                >
                  GET STARTED
                </motion.button>
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