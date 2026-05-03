import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  X, 
  Check, 
  Fingerprint, 
  CircleDot,
  UserPlus,
  Clock
} from "lucide-react";
import api from "../../api/api";
import { acceptFollowRequest, declineFollowRequest, getPendingRequests } from "../../services/followService";

export default function FollowRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState(new Set());
  const [avatarErrors, setAvatarErrors] = useState({});

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await getPendingRequests();
      
      // The response should have follower_avatar from your FollowListSerializer
      setRequests(res.data);
    } catch (err) {
      console.error("Failed to fetch requests:", err);
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  };

  const handleAccept = async (id) => {
    setProcessingIds(prev => new Set(prev).add(id));
    try {
      await acceptFollowRequest(id);
      setRequests(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error("Failed to accept:", err);
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleReject = async (id) => {
    setProcessingIds(prev => new Set(prev).add(id));
    try {
      await declineFollowRequest(id);
      setRequests(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error("Failed to reject:", err);
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleAvatarError = (requestId) => {
    setAvatarErrors(prev => ({ ...prev, [requestId]: true }));
  };

  
  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div 
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-4"
        >
          <Fingerprint className="text-emerald-500 w-12 h-12 stroke-[1px]" />
          <span className="text-[10px] tracking-[0.3em] uppercase text-emerald-500/60 font-medium">Loading requests</span>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-emerald-500/30">
      {/* Ambient Background Bloom */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-900/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative pt-32 pb-20 px-8">
        <div className="max-w-3xl mx-auto">
          
          {/* Minimalist Header */}
          <motion.header 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex items-end justify-between mb-16 border-b border-zinc-800/50 pb-8"
          >
            <div>
              <h1 className="text-4xl font-light tracking-tight mb-2">
                Follow <span className="text-emerald-500 font-medium">Requests</span>
              </h1>
              <div className="flex items-center gap-2 text-zinc-500 text-xs tracking-widest uppercase">
                <CircleDot className="w-3 h-3 text-emerald-500 animate-pulse" />
                {requests.length} Pending {requests.length === 1 ? 'request' : 'requests'}
              </div>
            </div>
            <ShieldCheck className="w-10 h-10 text-zinc-800 stroke-[1px]" />
          </motion.header>

          <AnimatePresence mode="popLayout">
            {requests.length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-32 text-center"
              >
                <div className="w-16 h-16 bg-zinc-900/30 border border-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <UserPlus className="text-zinc-600 w-6 h-6" />
                </div>
                <h3 className="text-zinc-400 font-light tracking-wide">No pending requests</h3>
                <p className="text-zinc-600 text-xs mt-1">When someone follows you, you'll see it here.</p>
              </motion.div>
            ) : (
              <motion.div className="space-y-3">
                {requests.map((req, idx) => {
                  const isProcessing = processingIds.has(req.id);
                  const hasAvatarError = avatarErrors[req.id];
                  
                  // Get follower data from the serializer
                  const followerId = req.follower_id;
                  const followerUsername = req.follower_username || req.follower_name;
                  const followerAvatar = req.follower_avatar;
                  const createdAt = req.created_at;

                  return (
                    <motion.div
                      key={req.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.6, delay: idx * 0.05, ease: "easeOut" }}
                      className="group relative"
                    >
                      <div className="flex items-center justify-between p-5 bg-[#080808] border border-zinc-900 rounded-2xl hover:bg-[#0C0C0C] hover:border-zinc-800 transition-all duration-700 ease-in-out group">
                        
                        {/* Profile Section */}
                        <div className="flex items-center gap-5 flex-1">
                          {/* Avatar with image support */}
                          <div className="relative">
                            <div className="w-12 h-12 rounded-full overflow-hidden border border-zinc-800 bg-black transition-all duration-700 group-hover:border-emerald-500/30">
                              {followerAvatar && !hasAvatarError ? (
                                <img
                                  src={followerAvatar}
                                  alt={followerUsername}
                                  className="w-full h-full object-cover"
                                  onError={() => handleAvatarError(req.id)}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-500/20 to-emerald-600/20">
                                  <span className="text-sm font-medium text-emerald-400">
                                    {followerUsername?.[0]?.toUpperCase() || "?"}
                                  </span>
                                </div>
                              )}
                            </div>
                            {/* Active indicator */}
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-black" />
                          </div>
                          
                          <div className="flex flex-col">
                            <h4 className="text-[15px] font-normal text-zinc-300 tracking-tight group-hover:text-white transition-colors duration-500">
                              @{followerUsername}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Clock className="w-3 h-3 text-zinc-600" />
                              <span className="text-[10px] text-zinc-500">
                                Requested {getRelativeTime(createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Control Section */}
                        <div className="flex items-center gap-3">
                          {/* Decline Button */}
                          <button
                            onClick={() => handleReject(req.id)}
                            disabled={isProcessing}
                            className="
                              relative p-3 rounded-full 
                              text-zinc-600 border border-transparent
                              hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20
                              active:scale-95
                              transition-all duration-700 ease-in-out
                              disabled:opacity-20 disabled:cursor-not-allowed
                              group/btn
                            "
                            title="Decline"
                          >
                            <X className="w-4 h-4 stroke-[1.5px] transition-transform duration-700 group-hover/btn:rotate-90" />
                          </button>
                          
                          {/* Accept Button */}
                          <button
                            onClick={() => handleAccept(req.id)}
                            disabled={isProcessing}
                            className="relative overflow-hidden px-6 py-2.5 bg-emerald-500 text-black rounded-lg text-[11px] font-semibold uppercase tracking-widest hover:bg-emerald-400 hover:scale-105 transition-all duration-700 disabled:bg-zinc-900 disabled:text-zinc-700 disabled:hover:scale-100"
                          >
                            {isProcessing ? (
                              <CircleDot className="w-4 h-4 animate-spin mx-auto" />
                            ) : (
                              <span className="relative z-10 flex items-center gap-2">
                                <Check className="w-3 h-3" />
                                Accept
                              </span>
                            )}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}