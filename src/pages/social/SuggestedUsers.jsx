import { motion } from "framer-motion";
import { Users, Search, TrendingUp, ArrowRight, Sparkles, UserPlus, Compass } from "lucide-react";
import UserSearch from "../../components/search/UserSearch";

export default function UsersPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Premium Grid Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/5 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-emerald-500/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        {/* Header Section - Premium */}
<div className="flex flex-col items-center justify-center text-center space-y-4 mt-8 mb-8">
  {/* Badge */}

  {/* Main Title */}
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.1 }}
    className="space-y-2"
  >
    <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
      <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
        Discover
      </span>
      <br />
      <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
        Movie Enthusiasts
      </span>
    </h1>
    <p className="text-zinc-400 text-sm max-w-md mx-auto leading-relaxed">
      Find and connect with people who share your cinematic passion
    </p>
  </motion.div>
</div>

        {/* Search Section - Premium Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative max-w-3xl mx-auto"
        >
          {/* Glow Effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-emerald-500/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Main Card */}
          <div className="relative bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 rounded-2xl overflow-hidden">
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
            
            {/* Corner Decorations */}
            <div className="absolute top-3 left-3 w-8 h-8 border-t border-l border-emerald-500/30 rounded-tl-xl" />
            <div className="absolute bottom-3 right-3 w-8 h-8 border-b border-r border-emerald-500/30 rounded-br-xl" />
            
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-zinc-800/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10">
                    <Search size={16} className="text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-white">Find Users</h2>
                    <p className="text-[11px] text-zinc-400 font-mono">Enter username to search</p>
                  </div>
                </div>

              </div>
            </div>
            
            {/* Search Component */}
            <div className="p-6">
              <UserSearch />
            </div>
          </div>
        </motion.div>

        {/* Footer - Premium Suggestions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 max-w-3xl mx-auto"
        >

        </motion.div>
      </div>
    </div>
  );
}