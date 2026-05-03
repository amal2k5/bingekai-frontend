import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Film, Star, TrendingUp, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

function NewUserEmptyState({ onGenerate, hasActivity }) {
  const navigate = useNavigate();
  const [showButton, setShowButton] = useState(true);

  // If user has activity, this component should not be visible
  if (hasActivity) return null;

  const handleBrowseMovies = () => {
    navigate("/movies");
  };

  const handleRateMovies = () => {
    navigate("/movies?tab=rated");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-[70vh] w-full px-6"
    >
      {/* Animated background effect */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500/10 to-green-600/5 border border-white/10 flex items-center justify-center">
          <Sparkles size={32} className="text-emerald-400 animate-pulse" strokeWidth={1.5} />
        </div>
      </div>

      {/* Main message */}
      <div className="text-center max-w-md space-y-4 mb-10">
        <h2 className="text-3xl md:text-4xl font-light tracking-tight text-white">
          Ready for <span className="text-emerald-400 font-medium">personalized</span> picks?
        </h2>
        
        <div className="space-y-3 mt-6">
          <p className="text-zinc-400 text-sm leading-relaxed">
            To get movie recommendations tailored just for you, we need to understand your taste first.
          </p>
          
          <div className="flex items-center justify-center gap-3 text-xs text-zinc-500">
            <div className="flex items-center gap-1">
              <Star size={12} className="text-emerald-400" />
              <span>Rate movies</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-zinc-700" />
            <div className="flex items-center gap-1">
              <Film size={12} className="text-emerald-400" />
              <span>Add to watchlist</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-zinc-700" />
            <div className="flex items-center gap-1">
              <TrendingUp size={12} className="text-emerald-400" />
              <span>Write reviews</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleBrowseMovies}
          className="group flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-medium shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-300"
        >
          <Film size={18} />
          <span>Browse Movies</span>
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleRateMovies}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-zinc-900/50 border border-white/10 text-white rounded-xl font-medium hover:bg-zinc-800/50 hover:border-emerald-500/30 transition-all duration-300"
        >
          <Star size={18} />
          <span>Rate & Review</span>
        </motion.button>
      </div>


    </motion.div>
  );
}

export default NewUserEmptyState;