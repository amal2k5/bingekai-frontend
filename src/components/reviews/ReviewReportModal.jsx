import { useState } from "react";
import api from "../../api/api";
import { motion, AnimatePresence } from "framer-motion";

export default function ReviewReportModal({
  review,
  isOpen,
  onClose,
  onSuccess,
}) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  if (!review) return null;

  const handleSubmit = async () => {
    if (!reason) return;
    try {
      setLoading(true);
      await api.post("/reports/", { review: review.id, reason });
      onSuccess?.("Report submitted successfully");
      onClose();
      setReason("");
    } catch (err) {
      onSuccess?.(err.response?.data || "Failed to report", "error");
    } finally {
      setLoading(false);
    }
  };

  const reasons = ["spoiler", "abusive", "harassment", "spam", "irrelevant", "misleading", "sensitive"];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop: Slow fade with blur */}
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0 bg-black/80"
            onClick={onClose}
          />

          {/* Modal Card - Height Optimized */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.95, y: 10, filter: "blur(10px)" }}
            transition={{ 
              duration: 0.6, 
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative w-full max-w-md bg-[#09090b] rounded-3xl shadow-[0_0_50px_-12px_rgba(16,185,129,0.25)] border border-white/10 overflow-hidden"
          >
            {/* Compact Header */}
            <div className="px-8 pt-6 pb-4 text-center">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "40px" }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="h-[2px] bg-emerald-500 mx-auto mb-4"
              />
              <h3 className="text-xl font-bold text-white tracking-widest uppercase italic">
                Report <span className="text-emerald-500">Review</span>
              </h3>
              <p className="text-zinc-500 text-[10px] mt-1 tracking-widest uppercase font-medium">
                Internal Security Protocol
              </p>
            </div>

            <div className="px-8 pb-6">
              {/* Reasons List - Tighter spacing */}
              <div className="space-y-1.5 mb-6">
                {reasons.map((r, i) => (
                  <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    key={r}
                    onClick={() => setReason(r)}
                    className={`group w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-300 ${
                      reason === r
                        ? "bg-emerald-500/10 border-emerald-500/40 border shadow-[inset_0_0_15px_rgba(16,185,129,0.05)]"
                        : "bg-zinc-900/40 border border-white/5 hover:border-white/20"
                    }`}
                  >
                    <span className={`text-xs font-semibold capitalize tracking-wide ${
                      reason === r ? "text-emerald-400" : "text-zinc-400"
                    }`}>
                      {r}
                    </span>
                    <div className={`h-1.5 w-1.5 rounded-full transition-all duration-500 ${
                      reason === r ? "bg-emerald-500 shadow-[0_0_10px_#10b981]" : "bg-zinc-800"
                    }`} />
                  </motion.button>
                ))}
              </div>

              {/* Action Buttons - Tighter */}
<div className="flex flex-col gap-3 mt-4">
  <button
    disabled={!reason || loading}
    onClick={handleSubmit}
    className={`
      w-full py-4 rounded-xl font-bold text-xs tracking-[0.15em] uppercase 
      transition-all duration-200
      ${
        !reason || loading
          ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" 
          : "bg-emerald-500 text-black hover:bg-emerald-400 active:scale-[0.98]"
      }
    `}
  >
    {loading ? (
      <div className="flex items-center justify-center gap-2">
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span>Processing</span>
      </div>
    ) : (
      "Submit Report"
    )}
  </button>

  <button
    onClick={onClose}
    className="w-full py-2 text-zinc-500 hover:text-white transition-colors text-[11px] font-bold uppercase tracking-widest"
  >
    Cancel Request
  </button>
</div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}