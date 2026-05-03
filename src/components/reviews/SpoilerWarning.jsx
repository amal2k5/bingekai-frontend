import { useState, useCallback } from "react";
import { 
  Eye, 
  EyeOff, 
  ShieldAlert, 
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SpoilerWarning({ content, confidence }) {
  const [revealed, setRevealed] = useState(false);

  
  const toggleReveal = useCallback(() => setRevealed((prev) => !prev), []);

  if (!content) return null;

  const isHighRisk = confidence > 0.85;
  const riskLabel = isHighRisk ? "Spoiler Alert" : "Potential Spoiler";

  return (
    <div className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
      <AnimatePresence mode="wait" initial={false}>
        {!revealed ? (
          <motion.div
            key="warning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="p-1.5"
          >
            <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-900/40 border border-zinc-800/50">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-md border ${isHighRisk ? 'border-red-500/20 text-red-500' : 'border-zinc-700 text-zinc-400'} bg-zinc-950`}>
                  <ShieldAlert size={18} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-semibold text-zinc-100 tracking-tight">
                    {riskLabel}
                  </span>
                  <span className="text-xs text-zinc-500 font-medium">
                    Content hidden for spoiler protection
                  </span>
                </div>
              </div>

              <button
                onClick={toggleReveal}
                className="group flex items-center gap-2 px-4 py-2 bg-zinc-100 hover:bg-white text-zinc-950 rounded-md text-xs font-bold transition-all duration-200 active:scale-95"
              >
                Reveal
                <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex flex-col"
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-900 bg-zinc-900/20">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                User Review
              </span>
              <button
                onClick={toggleReveal}
                className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 hover:text-zinc-200 transition-colors uppercase tracking-tight"
              >
                <EyeOff size={12} />
                Hide
              </button>
            </div>

            <div className="p-6">
              <p className="text-[15px] text-zinc-300 leading-relaxed selection:bg-zinc-800 selection:text-white">
                {content}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}