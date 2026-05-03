import React, { useState } from "react";
import api from "../../../api/api";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  AlertTriangle,
  Trash2,
  FileText,
  CheckCircle,
  Inbox,
  ShieldCheck,
} from "lucide-react";

const reasonStyles = {
  spoiler: "text-yellow-400 border-yellow-500/30 bg-yellow-500/5",
  abusive: "text-red-400 border-red-500/30 bg-red-500/5",
  harassment: "text-red-400 border-red-500/30 bg-red-500/5",
  spam: "text-zinc-400 border-zinc-500/30 bg-zinc-500/5",
  irrelevant: "text-zinc-400 border-zinc-500/30 bg-zinc-500/5",
  misleading: "text-blue-400 border-blue-500/30 bg-blue-500/5",
  sensitive: "text-purple-400 border-purple-500/30 bg-purple-500/5",
};

const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.03);
    border-radius: 10px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(16, 185, 129, 0.3);
    border-radius: 10px;
    transition: background 0.2s ease;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(16, 185, 129, 0.6);
  }

  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(16, 185, 129, 0.3) rgba(255, 255, 255, 0.03);
  }
`;

if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = scrollbarStyles;
  document.head.appendChild(styleSheet);
}

function ReviewContent({ content, reviewUser, reviewId }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = content.length > 220;
  const displayText =
    expanded || !isLong ? content : content.slice(0, 220) + "...";

  return (
    <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
      <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap break-words">
        "{displayText}"
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-xs text-emerald-400 hover:text-emerald-300 transition"
        >
          {expanded ? "Read Less ↑" : "Show More ↓"}
        </button>
      )}
    </div>
  );
}

export default function ReportsTable({ reports, refresh }) {
  const [loadingId, setLoadingId] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);

  const getActionMessage = (action) => {
    switch (action) {
      case "hide":
        return "Review hidden";
      case "unhide":
        return "Review is now visible";
      case "spoiler":
        return "Marked as spoiler";
      case "unspoiler":
        return "Spoiler removed";
      case "delete":
        return "Review deleted";
      default:
        return "Action completed";
    }
  };

  const handleAction = async (reviewId, action) => {
    if (!reviewId) return toast.error("Invalid review ID");
    try {
      setLoadingId(reviewId);
      await api.patch(`/reports/admin/reviews/${reviewId}/action/`, { action });
      toast.success(getActionMessage(action));
      await refresh();
    } catch (err) {
      toast.error(err.response?.data?.error || "Action failed");
    } finally {
      setLoadingId(null);
      setConfirmAction(null);
    }
  };

  if (!reports.length)
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative overflow-hidden rounded-[2.5rem] bg-black border border-white/[0.08] shadow-2xl"
      >
        {/* High-Contrast Grid Overlay */}
        <div className="absolute inset-0 pointer-events-none rounded-4xl">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        </div>

        <div className="relative text-center py-32 px-8 rounded-4xl">
          {/* Glowing Icon Core */}
          <motion.div
            animate={{
              boxShadow: [
                "0 0 20px rgba(16,185,129,0)",
                "0 0 40px rgba(16,185,129,0.1)",
                "0 0 20px rgba(16,185,129,0)",
              ],
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="inline-flex items-center justify-center mb-10"
          >
            <div className="relative rounded-full">
              {" "}
              {/* Changed to rounded-full */}
              {/* Main Icon Container */}
              <div className="relative w-24 h-24 rounded-full bg-black border border-emerald-500/30 flex items-center justify-center group">
                {" "}
                {/* Changed to rounded-full */}
                <ShieldCheck className="w-12 h-12 text-emerald-500 rounded-full stroke-[1.25] transition-transform duration-700 group-hover:rotate-[360deg]" />
              </div>
            </div>
          </motion.div>

          {/* High-Contrast Typography */}
          <div className="max-w-md mx-auto space-y-4">
            <div className="flex flex-col gap-1">
              <h3 className="text-3xl font-light tracking-tight text-white">
                All{" "}
                <span className="text-emerald-500 font-medium not-italic">
                  Cleared
                </span>
              </h3>
              <div className="h-[2px] w-12 bg-emerald-500 mx-auto rounded-full" />
            </div>

            <p className="text-sm text-zinc-400 font-medium tracking-wide max-w-[280px] mx-auto leading-relaxed">
              All reports have been reviewed.
            </p>
          </div>

          {/* Minimalist Scanning Line Animation */}
          <motion.div
            initial={{ top: 0 }}
            animate={{ top: "100%" }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-[100px] bg-gradient-to-b from-transparent via-emerald-500/[0.03] to-transparent pointer-events-none"
          />
        </div>
      </motion.div>
    );

  return (
    <>
      <div className="bg-[#0a0a0a] rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="p-6 text-xs font-medium uppercase tracking-wider text-zinc-500">
                  User
                </th>
                <th className="p-6 text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Reporter
                </th>
                <th className="p-6 text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Classification
                </th>
                <th className="p-6 text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Review Status
                </th>
                <th className="p-6 text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Timestamp
                </th>
                <th className="p-6 text-xs font-medium uppercase tracking-wider text-zinc-500 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {reports.map((report) => {
                const reviewId = report.review_id || report.review?.id;
                const isLoading = loadingId === reviewId;
                const isHidden = report.is_hidden;
                const isSpoiler = report.is_spoiler;

                let reviewStatusText = "";
                let reviewStatusColor = "";

                if (isHidden) {
                  reviewStatusText = "Hidden";
                  reviewStatusColor =
                    "text-red-400 bg-red-500/10 border-red-500/20";
                } else if (isSpoiler) {
                  reviewStatusText = "Spoiler";
                  reviewStatusColor =
                    "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
                } else {
                  reviewStatusText = "Visible";
                  reviewStatusColor =
                    "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
                }

                return (
                  <tr
                    key={report.id}
                    className="group hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-400 text-sm">
                          @{report.review_user}
                        </span>
                        <button
                          onClick={() => setSelectedReport(report)}
                          className="p-1 hover:bg-white/10 rounded transition-colors"
                          title="View review content"
                        >
                          <FileText
                            size={14}
                            className="text-zinc-500 hover:text-emerald-400 transition-colors"
                          />
                        </button>
                      </div>
                    </td>
                    <td className="p-6 text-sm font-mono text-zinc-500">
                      {report.reporter_email}
                    </td>
                    <td className="p-6">
                      <span
                        className={`px-3 py-1 text-xs uppercase tracking-wide border rounded-md ${reasonStyles[report.reason] || "border-white/10 text-zinc-400"}`}
                      >
                        {report.reason}
                      </span>
                    </td>
                    <td className="p-6">
                      <span
                        className={`px-3 py-1 text-xs uppercase tracking-wide border rounded-md ${reviewStatusColor}`}
                      >
                        {reviewStatusText}
                      </span>
                    </td>
                    <td className="p-6 text-xs font-mono text-zinc-600">
                      {new Date(report.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-6">
                      <div className="flex justify-center items-center gap-1">
                        {!isHidden ? (
                          <button
                            disabled={isLoading}
                            onClick={() => handleAction(reviewId, "hide")}
                            className="p-2 rounded-lg text-zinc-600 hover:text-white hover:bg-white/5 transition-all active:scale-90"
                            title="Hide Review"
                          >
                            <EyeOff size={14} />
                          </button>
                        ) : (
                          <button
                            disabled={isLoading}
                            onClick={() => handleAction(reviewId, "unhide")}
                            className="p-2 rounded-lg text-emerald-400 hover:text-emerald-300 hover:bg-white/5 transition-all active:scale-90"
                            title="Unhide Review"
                          >
                            <Eye size={14} />
                          </button>
                        )}

                        {!isSpoiler ? (
                          <button
                            disabled={isLoading}
                            onClick={() => handleAction(reviewId, "spoiler")}
                            className="p-2 rounded-lg text-zinc-600 hover:text-yellow-400 hover:bg-white/5 transition-all active:scale-90"
                            title="Mark as Spoiler"
                          >
                            <AlertTriangle size={14} />
                          </button>
                        ) : (
                          <button
                            disabled={isLoading}
                            onClick={() => handleAction(reviewId, "unspoiler")}
                            className="p-2 rounded-lg text-yellow-400 hover:text-yellow-300 hover:bg-white/5 transition-all active:scale-90"
                            title="Remove Spoiler Mark"
                          >
                            <CheckCircle size={14} />
                          </button>
                        )}

                        <button
                          disabled={isLoading}
                          onClick={() =>
                            setConfirmAction({
                              reviewId,
                              action: "delete",
                              reportId: report.id,
                            })
                          }
                          className="p-2 rounded-lg text-zinc-600 hover:text-red-500 hover:bg-white/5 transition-all active:scale-90"
                          title="Delete Review"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {/* DELETE CONFIRMATION MODAL */}
        {confirmAction && (
          <div
            className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[300] p-4"
            onClick={() => setConfirmAction(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0a0a0a] border border-red-500/20 rounded-2xl p-6 max-w-md w-full"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-red-500/10 rounded-full flex items-center justify-center text-red-500">
                  <Trash2 size={18} />
                </div>
                <div>
                  <h2 className="text-base font-medium text-white">
                    Delete Review Permanently
                  </h2>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    This action cannot be undone
                  </p>
                </div>
              </div>
              <p className="text-sm text-zinc-400 mb-6">
                This will permanently remove the review from the database. All
                associated reports will also be deleted.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmAction(null)}
                  className="flex-1 py-2.5 text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAction(confirmAction.reviewId, "delete")}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
                >
                  Delete Forever
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* REVIEW DETAIL MODAL */}
        {selectedReport && (
          <div
            className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[300] p-4 overflow-y-auto custom-scrollbar"
            onClick={() => setSelectedReport(null)}
          >
            <div className="min-h-full flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 40, scale: 0.94 }}
                transition={{
                  duration: 0.3,
                  ease: [0.25, 0.1, 0.25, 1],
                  scale: { duration: 0.25, ease: "easeOut" },
                }}
                onClick={(e) => e.stopPropagation()}
                className="relative bg-gradient-to-b from-[#0a0a0a] to-[#050505] w-full max-w-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden my-8"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.08),transparent_60%)]"
                />

                {/* HEADER */}
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.05 }}
                  className="sticky top-0 z-10 backdrop-blur-md bg-black/60 border-b border-white/10"
                >
                  <div className="flex justify-between items-start p-6 pb-4">
                    <div>
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="text-emerald-400 text-xs font-mono tracking-widest"
                      >
                        REVIEW DETAILS
                      </motion.span>
                      <motion.h3
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.15 }}
                        className="text-xl font-semibold text-white mt-1"
                      >
                        Moderation Panel
                      </motion.h3>
                    </div>
                    <motion.button
                      initial={{ opacity: 0, rotate: -90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      transition={{ duration: 0.2, delay: 0.1 }}
                      whileHover={{
                        scale: 1.05,
                        backgroundColor: "rgba(255,255,255,0.1)",
                      }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedReport(null)}
                      className="text-zinc-500 hover:text-white transition-all duration-200 w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                    >
                      ×
                    </motion.button>
                  </div>
                </motion.div>

                {/* CONTENT */}
                <div className="max-h-[calc(100vh-180px)] overflow-y-auto custom-scrollbar">
                  {/* REVIEW CONTENT */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="p-6 border-b border-white/10"
                  >
                    <label className="text-xs text-zinc-500 mb-3 block font-mono tracking-widest">
                      REVIEW CONTENT
                    </label>
                    <ReviewContent
                      content={selectedReport.review_content || ""}
                      reviewUser={selectedReport.review_user}
                      reviewId={
                        selectedReport.review_id || selectedReport.review?.id
                      }
                    />
                  </motion.div>

                  {/* STATUS */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.25 }}
                    className="p-6 border-b border-white/10"
                  >
                    <label className="text-xs text-zinc-500 mb-3 block font-mono tracking-widest">
                      CURRENT STATUS
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {selectedReport.is_hidden ? (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2, delay: 0.3 }}
                          className="px-3 py-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2"
                        >
                          <EyeOff size={12} /> Hidden
                        </motion.span>
                      ) : (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2, delay: 0.3 }}
                          className="px-3 py-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-2"
                        >
                          <Eye size={12} /> Visible
                        </motion.span>
                      )}
                      {selectedReport.is_spoiler ? (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2, delay: 0.35 }}
                          className="px-3 py-2 text-xs text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-center gap-2"
                        >
                          <AlertTriangle size={12} /> Spoiler
                        </motion.span>
                      ) : (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2, delay: 0.35 }}
                          className="px-3 py-2 text-xs text-zinc-400 bg-zinc-500/10 border border-zinc-500/20 rounded-lg flex items-center gap-2"
                        >
                          <CheckCircle size={12} /> Clean
                        </motion.span>
                      )}
                    </div>
                  </motion.div>

                  {/* REPORT INFO */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="p-8 relative overflow-hidden bg-[#050505] border-b border-white/5"
                  >
                    {/* Ambient Background Glow */}
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_10%_10%,rgba(16,185,129,0.03),transparent_50%)] pointer-events-none" />

                    <div className="grid grid-cols-12 gap-6">
                      {/* LEFT COLUMN: REPORTER & REASON (Stacked) */}
                      <div className="col-span-12 md:col-span-7 space-y-4">
                        {/* Reporter Card */}
                        <motion.div
                          whileHover={{ x: 4 }}
                          className="group flex items-center gap-4 p-4 rounded-2xl bg-zinc-900/40 border border-white/5 hover:border-emerald-500/30 transition-all duration-300"
                        >
                          <div className="w-12 h-12 rounded-4xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
                            <svg
                              className="w-5 h-5 text-ewhite-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[9px] text-zinc-500 font-bold tracking-widest uppercase mb-0.5">
                              Reported By
                            </p>
                            <p className="text-sm text-zinc-200 font-mono truncate selection:bg-emerald-500/30">
                              {selectedReport.reporter_email}
                            </p>
                          </div>
                        </motion.div>

                        {/* Reason Card */}
                        <motion.div
                          whileHover={{ x: 4 }}
                          className={`group p-4 rounded-2xl border transition-all duration-300 bg-zinc-900/40 ${
                            selectedReport.reason === "abusive"
                              ? "border-red-500/20 hover:border-red-500/40"
                              : selectedReport.reason === "spoiler"
                                ? "border-yellow-500/20 hover:border-yellow-500/40"
                                : "border-white/5 hover:border-emerald-500/30"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <p className="text-[9px] text-zinc-500 font-bold tracking-widest uppercase">
                                Reason of the Report
                              </p>
                              <h4
                                className={`text-lg font-mono font-bold tracking-tighter uppercase ${
                                  selectedReport.reason === "abusive"
                                    ? "text-red-400"
                                    : selectedReport.reason === "spoiler"
                                      ? "text-yellow-400"
                                      : "text-emerald-400"
                                }`}
                              >
                                {selectedReport.reason || "General Flag"}
                              </h4>
                            </div>
                            <div className="text-right">
                              <div
                                className={`text-[10px] font-mono px-2 py-0.5 rounded border mb-2 inline-block ${
                                  selectedReport.reason === "abusive"
                                    ? "bg-red-500/10 border-red-500/20 text-red-400"
                                    : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                }`}
                              >
                                {selectedReport.reason === "abusive"
                                  ? "PRIORITY_01"
                                  : "STABLE"}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </div>

                      {/* RIGHT COLUMN: BIG DATE UI */}
                      <div className="col-span-12 md:col-span-5">
                        <div className="h-full relative group">
                          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                          <div className="h-full p-6 rounded-2xl bg-zinc-900/40 border border-white/5 flex flex-col justify-center items-center text-center relative overflow-hidden">
                            {/* Calendar Icon Background Decoration */}
                            <svg
                              className="absolute -bottom-4 -right-4 w-24 h-24 text-white/5 transform -rotate-12"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z" />
                            </svg>

                            <p className="text-[9px] text-zinc-500 font-bold tracking-widest uppercase mb-4">
                              Reported on
                            </p>

                            <div className="space-y-0">
                              <div className="text-3xl font-mono font-light text-white tracking-tighter">
                                {new Date(
                                  selectedReport.created_at,
                                ).toLocaleDateString("en-US", {
                                  day: "2-digit",
                                  month: "short",
                                })}
                              </div>
                              <div className="text-4xl font-mono font-black text-emerald-500 tracking-tighter">
                                {new Date(
                                  selectedReport.created_at,
                                ).getFullYear()}
                              </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-white/5 w-full flex justify-center gap-4 text-[11px] font-mono text-zinc-400">
                              <span className="flex items-center gap-1.5">
                                <div className="w-1 h-1 rounded-full bg-emerald-500" />
                                {new Date(
                                  selectedReport.created_at,
                                ).toLocaleTimeString("en-US", {
                                  hour12: true,
                                  hour: "numeric",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* ACTIONS */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                    className="p-6"
                  >
                    <label className="text-xs text-zinc-500 mb-3 block font-mono tracking-widest">
                      MODERATION ACTIONS
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        animate={{ opacity: 1, y: 0 }}
                        initial={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2, delay: 0.55 }}
                        onClick={() => {
                          handleAction(
                            selectedReport.review_id ||
                              selectedReport.review?.id,
                            selectedReport.is_hidden ? "unhide" : "hide",
                          );
                          setSelectedReport(null);
                        }}
                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-sm text-zinc-300 transition"
                      >
                        {selectedReport.is_hidden ? (
                          <>
                            <Eye size={14} /> Unhide
                          </>
                        ) : (
                          <>
                            <EyeOff size={14} /> Hide
                          </>
                        )}
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        animate={{ opacity: 1, y: 0 }}
                        initial={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2, delay: 0.6 }}
                        onClick={() => {
                          handleAction(
                            selectedReport.review_id ||
                              selectedReport.review?.id,
                            selectedReport.is_spoiler ? "unspoiler" : "spoiler",
                          );
                          setSelectedReport(null);
                        }}
                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-sm text-zinc-300 transition"
                      >
                        {selectedReport.is_spoiler ? (
                          <>
                            <CheckCircle size={14} /> Remove Spoiler
                          </>
                        ) : (
                          <>
                            <AlertTriangle size={14} /> Mark Spoiler
                          </>
                        )}
                      </motion.button>

                      <div className="col-span-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          animate={{ opacity: 1, y: 0 }}
                          initial={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2, delay: 0.65 }}
                          onClick={() => {
                            setConfirmAction({
                              reviewId:
                                selectedReport.review_id ||
                                selectedReport.review?.id,
                              action: "delete",
                              reportId: selectedReport.id,
                            });
                            setSelectedReport(null);
                          }}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 transition"
                        >
                          <Trash2 size={14} />
                          Delete Permanently
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
