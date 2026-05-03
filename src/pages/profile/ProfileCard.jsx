import { motion, AnimatePresence } from "framer-motion";
import { 
  UserPlus, 
  Star, 
  MessageSquare, 
  Folder, 
  Check,
  Settings,
  Heart,
  Users,
  Award,
  Sparkles,
  Activity
} from "lucide-react";
import { useState } from "react";

export default function ProfileCard({
  profile,
  followStatus,
  followLoading,
  onFollow,
  navigate,
  userId,
  currentUserId
}) {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isOwnProfile = currentUserId && userId && currentUserId == userId;

  const avatarUrl = profile?.user?.avatar;
  const username = profile?.user?.username;
  const displayName = profile?.user?.display_name || username;


  const stats = [
    { label: "Ratings", value: profile?.stats?.total_ratings, icon: Star, color: "#eab308" },
    { label: "Reviews", value: profile?.stats?.total_reviews, icon: MessageSquare, color: "#3b82f6" },
    { label: "Lists", value: profile?.stats?.total_lists, icon: Folder, color: "#a855f7" },
  ];

  const socials = [
    { label: "Followers", count: profile?.stats?.followers_count, path: "followers", icon: Users },
    { label: "Following", count: profile?.stats?.following_count, path: "following", icon: Heart },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        ease: [0.21, 0.45, 0.27, 0.9],
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      whileHover={{ y: -6 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="w-full max-w-[400px]"
    >
      {/* Main Card with Glass Morphism - Increased Height */}
      <div className="relative backdrop-blur-xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl transition-all duration-400">
        
        {/* Glass Shade Effect Layer - Inside Card Only */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-[#22c55e]/5 via-transparent to-transparent rounded-2xl"
          animate={{ 
            opacity: isHovered ? 0.15 : 0.05,
          }}
          transition={{ duration: 0.4 }}
        />
        
        {/* Animated Glass Reflection - Inside Card */}
        <motion.div 
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-2xl"
          animate={{ 
            x: isHovered ? ['-100%', '200%'] : '-100%',
          }}
          transition={{ 
            duration: 1.2, 
            ease: "easeInOut",
            repeat: isHovered ? 1 : 0
          }}
          style={{ pointerEvents: 'none' }}
        />

        {/* Top Ambient Glow - Inside Card */}
        <motion.div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-40 bg-gradient-to-b from-[#22c55e]/20 via-[#22c55e]/5 to-transparent rounded-full blur-3xl"
          animate={{ 
            opacity: isHovered ? 0.6 : 0.3,
            scale: isHovered ? 1.1 : 1
          }}
          transition={{ duration: 0.4 }}
        />

        {/* Header Area - Increased Height */}
        <div className="relative h-32 bg-gradient-to-b from-[#22c55e]/10 via-transparent to-transparent">
          {/* Subtle Pattern Overlay */}
          <div className="absolute inset-0 opacity-10" 
               style={{ 
                 backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(34,197,94,0.3) 1px, transparent 1px)',
                 backgroundSize: '16px 16px'
               }} 
          />
        </div>

        <div className="relative px-6 pb-8">
          {/* Avatar Section - Larger */}
          <div className="flex flex-col items-center -mt-16 mb-6">
            <motion.div 
              className="relative mb-5"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              {/* Outer Ring */}
              <motion.div 
                className="absolute -inset-1.5 rounded-2xl bg-gradient-to-r from-[#22c55e] via-emerald-400 to-[#22c55e] opacity-0"
                animate={{ opacity: isHovered ? 0.3 : 0 }}
                transition={{ duration: 0.3 }}
              />
              
              {/* Avatar Container - Larger */}
              <div className="relative w-28 h-28 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 p-[2px] shadow-xl">
                <div className="w-full h-full rounded-2xl overflow-hidden bg-zinc-900">
                  {avatarUrl && !imageError ? (
                    <motion.img 
                      src={avatarUrl} 
                      alt={username}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.25 }}
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#22c55e]/20 to-[#22c55e]/5">
                      <span className="text-3xl font-bold text-[#22c55e]/50">
                        {username?.[0]?.toUpperCase() || "U"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Indicator */}
              <motion.div 
                className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-gradient-to-r from-[#22c55e] to-emerald-500 rounded-full border-2 border-black flex items-center justify-center shadow-md"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
              >
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              </motion.div>
            </motion.div>

            {/* User Info */}
            <div className="text-center space-y-2">
              <motion.h2 
                className="text-2xl font-bold text-white tracking-tight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {displayName}
              </motion.h2>
              <motion.p 
                className="text-xs text-[#22c55e]/70 font-mono tracking-wide"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
              >
                @{username?.toLowerCase()}
              </motion.p>
              
            </div>
          </div>

          {/* Stats Grid - Larger */}
          <motion.div 
            className="grid grid-cols-3 gap-3 mb-8 p-3 rounded-xl bg-white/[0.02] border border-white/[0.03]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            {stats.map((stat, i) => (
              <motion.div 
                key={i}
                className="flex flex-col items-center gap-1.5 py-2 rounded-lg"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.15 }}
              >
                <div 
                  className="p-2 rounded-lg bg-white/[0.02]"
                  style={{ color: stat.color }}
                >
                  <stat.icon size={15} strokeWidth={1.5} />
                </div>
                <span className="text-base font-bold text-white">
                  {stat.value ?? 0}
                </span>
                <span className="text-[9px] text-white/30 uppercase tracking-wider font-medium">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Social Connections */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex gap-3">
              {socials.map((social, i) => (
                <motion.button
                  key={i}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(`/users/${userId}/connections?tab=${social.path}`)}
                  className="flex-1 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] hover:border-[#22c55e]/20 transition-all duration-200"
                >
                  <social.icon size={12} className="text-white/30 mx-auto mb-1 group-hover:text-[#22c55e] transition-colors" />
                  <p className="text-[10px] text-white/30 uppercase tracking-wider mb-0.5">{social.label}</p>
                  <p className="text-sm text-white/80 font-semibold">{social.count ?? 0}</p>
                </motion.button>
              ))}
            </div>

            {/* Action Button - Larger Padding */}
            {!isOwnProfile ? (
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                disabled={followLoading}
                onClick={() => followStatus !== "requested" && onFollow()}
                className={`relative w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 overflow-hidden ${
                  followStatus === "following" 
                    ? "bg-white/[0.03] text-white/50 border border-white/05" 
                    : followStatus === "requested"
                    ? "bg-[#22c55e]/10 text-[#22c55e]/40 border border-[#22c55e]/10 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#22c55e] to-emerald-500 text-black hover:shadow-md hover:shadow-[#22c55e]/20"
                }`}
              >
                {/* Quick Shine Effect */}
                {followStatus !== "following" && followStatus !== "requested" && (
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12"
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  />
                )}
                
                {followLoading ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mx-auto" />
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    {followStatus === "following" ? (
                      <>
                        <Check size={15} strokeWidth={2} />
                        <span>Following</span>
                      </>
                    ) : followStatus === "requested" ? (
                      <>
                        <UserPlus size={15} strokeWidth={1.5} />
                        <span>Requested</span>
                      </>
                    ) : (
                      <>
                        <UserPlus size={15} strokeWidth={2} />
                        <span>Follow</span>
                      </>
                    )}
                  </span>
                )}
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/profile/settings")}
                className="w-full py-3 rounded-xl bg-white/[0.02] border border-white/[0.05] text-white/30 text-xs font-semibold tracking-wide uppercase flex items-center justify-center gap-2 hover:bg-white/[0.04] hover:text-white/50 transition-all duration-200"
              >
                <Settings size={13} />
                Edit Profile
              </motion.button>
            )}
          </motion.div>
        </div>

        {/* Bottom Glow Line */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#22c55e]/40 to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        />
      </div>
    </motion.div>
  );
}