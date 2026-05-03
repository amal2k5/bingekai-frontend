import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft, Users, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api/api";

export default function ConnectionsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "followers";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    fetchUsers();
  }, [activeTab, id]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        activeTab === "followers"
          ? `/social/follow/followers/?user_id=${id}`
          : `/social/follow/following/?user_id=${id}`
      );
      setUsers(res.data);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setTimeout(() => setLoading(false), 600);
    }
  };

  const getUserId = (user) => (activeTab === "followers" ? user.follower_id : user.following_id);
  const getUsername = (user) => (activeTab === "followers" ? user.follower_username : user.following_username);
  const getUserAvatar = (user) => (activeTab === "followers" ? user.follower_avatar : user.following_avatar);

  const handleImageError = (userId) => {
    setImageErrors((prev) => ({ ...prev, [userId]: true }));
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased">
      <div className="max-w-2xl mx-auto pt-20 pb-20 px-6">
        
        {/* Header - Aligned Left */}
        <header className="flex items-center gap-5 mb-12">
          <button 
            onClick={() => navigate(-1)}
            className="group flex items-center justify-center w-10 h-10 rounded-full border border-zinc-800 hover:border-emerald-500 transition-all duration-500"
          >
            <ChevronLeft size={18} className="group-hover:text-emerald-500 transition-colors" />
          </button>
          <div>
            <h1 className="text-2xl font-medium tracking-tight text-white">Connections</h1>
            <p className="text-zinc-500 text-xs tracking-wide">Manage your network and community</p>
          </div>
        </header>

        {/* Tab Navigation - Minimalist Style */}
        <div className="flex border-b border-zinc-900 mb-10">
          {["followers", "following"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative pb-4 px-6 text-sm transition-all duration-700 capitalize ${
                activeTab === tab ? "text-emerald-500" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div 
                  layoutId="underline"
                  className="absolute bottom-0 left-0 right-0 h-[1px] bg-emerald-500"
                  transition={{ type: "spring", stiffness: 40, damping: 15 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Content Section */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 animate-pulse">
                  <div className="w-12 h-12 rounded-full bg-zinc-900" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-1/3 bg-zinc-900 rounded" />
                    <div className="h-2 w-1/4 bg-zinc-900 rounded" />
                  </div>
                </div>
              ))}
            </motion.div>
          ) : users.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="py-20 text-center border border-zinc-900 rounded-2xl"
            >
              <Users className="mx-auto text-zinc-800 mb-4" size={32} strokeWidth={1} />
              <p className="text-zinc-500 text-sm">No accounts found in this list.</p>
            </motion.div>
          ) : (
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.08 } }
              }}
              className="space-y-2"
            >
              {users.map((user) => {
                const userId = getUserId(user);
                const username = getUsername(user);
                const avatarUrl = getUserAvatar(user);
                const hasImageError = imageErrors[userId];

                return (
                  <motion.div
                    key={userId}
                    variants={{
                      hidden: { opacity: 0, y: 15 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="group flex items-center justify-between p-4 rounded-xl hover:bg-zinc-900/40 transition-colors duration-500 border border-transparent hover:border-zinc-800"
                  >
                    <div className="flex items-center gap-4">
                      {/* Avatar with image support */}
                      <div className="w-11 h-11 rounded-full overflow-hidden border border-zinc-800 bg-black group-hover:border-emerald-500/50 transition-all duration-700">
                        {avatarUrl && !hasImageError ? (
                          <img
                            src={avatarUrl}
                            alt={username}
                            className="w-full h-full object-cover"
                            onError={() => handleImageError(userId)}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-xs font-medium text-zinc-400 group-hover:text-emerald-500 transition-colors">
                              {username?.[0]?.toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-normal text-zinc-200 group-hover:text-white transition-colors">
                          {username}
                        </h4>
                        <p className="text-[11px] text-zinc-600 uppercase tracking-widest">
                          {activeTab === "followers" ? "Member" : "Following"}
                        </p>
                      </div>
                    </div>

                    {/* Minimalist Button */}
                    <button 
                      onClick={() => navigate(`/users/${userId}`)}
                      className="flex items-center gap-2 px-4 py-2 text-[11px] font-medium tracking-widest uppercase border border-zinc-800 text-zinc-400 hover:text-white hover:border-white transition-all duration-700 rounded-md"
                    >
                      View
                      <ArrowRight size={12} />
                    </button>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}