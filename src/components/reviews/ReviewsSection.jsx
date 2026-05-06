import React, { useEffect, useState } from "react"; 
import {
  Trash2,
  Edit3,
  X,
  MessageSquarePlus,
  CheckCircle2,
  AlertCircle,
  Quote,
  Calendar,
  Star,
  ChevronRight,
  Heart,
} from "lucide-react";
import {
  Trash2,
  Edit3,
  X,
  MessageSquarePlus,
  CheckCircle2,
  AlertCircle,
  Quote,
  Calendar,
  Star,
  ChevronRight,
  Heart,
} from "lucide-react";
import {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
  toggleLike,
} from "../../services/reviewService";
import { useNavigate } from "react-router-dom";
import SpoilerWarning from "./SpoilerWarning";
import api from "../../api/api";
import ReviewReportModal from "./ReviewReportModal";

export default function ReviewsSection({ movieId, rating }) {
  const [reviews, setReviews] = useState([]);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [sort, setSort] = useState("top");
  const navigate = useNavigate();
  const [reportModal, setReportModal] = useState(null);

  const token = localStorage.getItem("access");

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 4000);
  };

  const fetchReviews = async (sortType = sort) => {
    try {
      setLoading(true);
      const res = await getReviews(movieId, sortType);
      const reviewsData = res.data;

      if (Array.isArray(reviewsData)) {
        setReviews(reviewsData);
      } else if (reviewsData?.results && Array.isArray(reviewsData.results)) {
        setReviews(reviewsData.results);
      } else if (typeof reviewsData === "object" && reviewsData !== null) {
        const possibleArray =
          reviewsData.reviews || reviewsData.items || reviewsData.data || [];
        setReviews(Array.isArray(possibleArray) ? possibleArray : []);
      } else {
        setReviews([]);
      }
    } catch (err) {
      showToast("Failed to load reviews", "error");
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReportSubmit = async () => {
    if (!reportReason) {
      showToast("Select a reason", "error");
      return;
    }

    try {
      await api.post("/reports/", {
        review: reportModal.id,
        reason: reportReason,
        message: reportMessage || "",
      });

      showToast("Report submitted");
      setReportModal(null);
      setReportReason("");
      setReportMessage("");
    } catch (err) {
      showToast(err.response?.data || "Failed to report", "error");
    }
  };

  useEffect(() => {
    if (movieId) fetchReviews(sort);
  }, [movieId, sort]);

  const handleSubmit = async () => {
    if (!text.trim()) {
      showToast("Review text is required", "error");
      return;
    }

    if (!rating) {
      showToast("Please rate the movie first", "error");
      return;
    }

    try {
      setSubmitting(true);

      const reviewContent = text.trim();

      if (editingId) {
        await updateReview(
          editingId,
          { content: reviewContent, rating },
          token,
        );
        showToast("Review updated successfully");
      } else {
        await createReview(
          { movie_id: movieId, content: reviewContent, rating },
          token,
        );
        showToast("Review posted successfully");
      }

      closeModal();
      fetchReviews(sort);
    } catch (err) {
      console.error("❌ Error:", err.response?.data);
      const errorMessage =
        err.response?.data?.non_field_errors?.[0] ||
        err.response?.data?.error ||
        err.response?.data?.detail ||
        (err.response?.status === 400
          ? "You already reviewed this movie"
          : "Action failed");
      showToast(errorMessage, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteReview(id, token);
      setReviews((prev) => prev.filter((r) => r.id !== id));
      showToast("Review deleted");
    } catch (err) {
      showToast("Delete failed", "error");
    }
  };

  const handleEdit = (review) => {
    setEditingId(review.id);
    setText(review.content);
    setIsModalOpen(true);
  };

  const handleLike = async (reviewId) => {
    if (!token) {
      showToast("Login to like reviews", "error");
      return;
    }

    setReviews((prev) =>
      prev.map((r) => {
        if (r.id !== reviewId) return r;
        return {
          ...r,
          is_liked: !r.is_liked,
          like_count: r.is_liked ? r.like_count - 1 : r.like_count + 1,
        };
      }),
    );

    try {
      await toggleLike(reviewId, token);
    } catch (err) {
      setReviews((prev) =>
        prev.map((r) => {
          if (r.id !== reviewId) return r;
          return {
            ...r,
            is_liked: !r.is_liked,
            like_count: r.is_liked ? r.like_count - 1 : r.like_count + 1,
          };
        }),
      );
      showToast("Failed to like review", "error");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setText("");
    setEditingId(null);
  };

  return (
    <div className="mt-20 max-w-4xl mx-auto px-6 pb-20 relative">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] animate-in fade-in slide-in-from-top-2 duration-300">
          <div
            className={`flex items-center gap-2.5 px-5 py-3 rounded-full backdrop-blur-xl shadow-2xl ${
              toast.type === "error"
                ? "bg-red-500/15 border border-red-500/30 text-red-300"
                : "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300"
            }`}
          >
            {toast.type === "error" ? (
              <AlertCircle size={18} />
            ) : (
              <CheckCircle2 size={18} />
            )}
            <span className="text-sm font-medium tracking-wide">
              {toast.message}
            </span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-end justify-between mb-12">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-emerald-400/80 uppercase tracking-wider mb-2">
            <div className="w-6 h-px bg-emerald-500/50" />
            <span>Community voices</span>
          </div>
          <h2 className="text-4xl font-light tracking-tight text-white">
            Reviews
            <span className="text-sm font-normal text-gray-500 ml-3">
              ({reviews.length})
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {/* Sort Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setSort("top")}
              className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                sort === "top"
                  ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm"
                  : "bg-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              Top
            </button>
            <button
              onClick={() => setSort("latest")}
              className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                sort === "latest"
                  ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm"
                  : "bg-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              Latest
            </button>
          </div>

          {/* Write Review Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-300 border border-white/10 hover:border-emerald-500/30 text-gray-300 hover:text-white text-sm font-medium backdrop-blur-sm"
          >
            <MessageSquarePlus size={18} />
            <span>Write review</span>
          </button>
        </div>
      </div>

      {/* Reviews List */}
      {/* Reviews List */}
      <div className="space-y-6">
        {loading ? (
          <div className="space-y-5">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-32 bg-white/[0.03] rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="py-20 text-center rounded-3xl bg-gradient-to-br from-white/[0.02] to-transparent border border-white/10">
            <MessageSquarePlus
              size={36}
              className="mx-auto mb-4 text-emerald-400/40"
            />
            <h3 className="text-xl font-semibold text-white">No Reviews Yet</h3>
          </div>
        ) : (
          reviews.map((r, index) => {
            // Move useState inside the map but ensure each review has its own state
            const [isExpanded, setIsExpanded] = React.useState(false);
            const contentLength = r.content?.length || 0;
            const shouldTruncate = contentLength > 300;
            const displayContent =
              shouldTruncate && !isExpanded
                ? r.content?.slice(0, 300) + "..."
                : r.content;

            return (
              <div
                key={r.id}
                className="group relative animate-in fade-in slide-in-from-bottom-3 duration-500"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="relative bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-sm rounded-2xl border border-white/10 hover:border-emerald-500/30 transition-all duration-500 overflow-hidden p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-500/30">
                        {r.user?.avatar ? (
                          <img
                            src={r.user.avatar}
                            alt={r.user.username}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-500/30 to-green-500/30 text-emerald-400 font-bold">
                            {r.user?.username?.[0]?.toUpperCase() || "U"}
                          </div>
                        )}
                      </div>
                      <div>
                        <h4
                          onClick={() => navigate(`/users/${r.user?.id}`)}
                          className="text-white font-semibold cursor-pointer hover:text-emerald-400 transition"
                        >
                          {r.user?.username || "Anonymous"}
                        </h4>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {r.is_owner ? (
                        <div className="flex flex-col items-center justify-center gap-1.5 px-3 py-2 min-w-[60px]">
                          <Heart size={18} className="text-gray-500" />
                          <span className="text-xs font-medium text-gray-400">
                            {r.like_count || 0}{" "}
                            {r.like_count === 1 ? "like" : "likes"}
                          </span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleLike(r.id)}
                          className="flex flex-col items-center justify-center gap-1.5 px-3 py-2 rounded-lg transition-all duration-300 group/like hover:bg-white/5 min-w-[60px]"
                        >
                          <Heart
                            size={18}
                            className={`transition-all duration-300 ${
                              r.is_liked
                                ? "fill-green-400 text-green-400 scale-110"
                                : "text-gray-500 hover:text-green-400 group-hover/like:scale-110"
                            }`}
                          />
                          <span
                            className={`text-xs font-medium transition-colors duration-300 ${
                              r.is_liked ? "text-green-400" : "text-gray-400"
                            }`}
                          >
                            {r.like_count || 0}{" "}
                            {r.like_count === 1 ? "like" : "likes"}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Rating Display */}
                  <div className="flex items-center gap-1 mb-3 ml-8">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={`${
                          i < Math.floor(r.rating || 0)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-600"
                        }`}
                      />
                    ))}
                    <span className="text-xs text-gray-400 ml-2">
                      ({r.rating?.toFixed(1) || "0.0"})
                    </span>
                  </div>

                  <div className="relative pl-8">
                    <Quote
                      size={18}
                      className="absolute left-0 top-0 text-emerald-500/40"
                    />

                    <div className="relative pl-8">
                      <Quote
                        size={18}
                        className="absolute left-0 top-0 text-emerald-500/40"
                      />

                      {r.is_spoiler === true ? (
                        <SpoilerWarning content={r.content} confidence={1} />
                      ) : r.has_spoiler === true ? (
                        <SpoilerWarning
                          content={r.content}
                          confidence={r.spoiler_confidence}
                        />
                      ) : (
                        <div className="space-y-3">
                          <p className="text-gray-300 leading-relaxed whitespace-pre-wrap break-words">
                            {displayContent}
                          </p>
                          {shouldTruncate && (
                            <button
                              onClick={() => setIsExpanded(!isExpanded)}
                              className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-all duration-300 group/readmore"
                            >
                              <span className="relative">
                                {isExpanded ? "Show less" : "Read more"}
                                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gradient-to-r from-emerald-400 to-transparent transition-all duration-300 group-hover/readmore:w-full"></span>
                              </span>
                              <svg
                                className={`w-3.5 h-3.5 transition-transform duration-300 ${
                                  isExpanded ? "rotate-180" : ""
                                }`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/5">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar size={12} />
                      <span>
                        {r.created_at
                          ? new Date(r.created_at).toLocaleDateString()
                          : "Recent"}
                      </span>
                    </div>

                    {r.is_owner && (
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEdit(r)}
                          className="p-2 text-gray-500 hover:text-emerald-400 transition-colors"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}

                    {!r.is_owner && (
                      <button
                        onClick={() => setReportModal(r)}
                        className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                        title="Report review"
                      >
                        <AlertCircle size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-[#0a0a0a]/90 backdrop-blur-md animate-in fade-in duration-700"
            onClick={closeModal}
          />
          <div className="relative w-full max-w-xl bg-[#121212] border border-white/[0.08] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] rounded-xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-12 duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
            {/* Header */}
            <div className="px-10 pt-10 pb-6 flex justify-between items-baseline">
              <div className="space-y-1.5">
                <h3 className="text-xl font-medium text-white tracking-tight">
                  {editingId ? "Edit Review" : "Write a Review"}
                </h3>
                <p className="text-[13px] text-white/60 font-normal leading-relaxed">
                  {editingId
                    ? "Refine your perspective on this title."
                    : "Tell the community what you enjoyed or disliked."}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="text-white/70 hover:text-white transition-all duration-300 p-1.5 hover:bg-white/5 rounded-full"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Input Area */}
            <div className="px-10 pb-2">
              <div className="relative rounded-lg border border-white/[0.15] bg-white/[0.02] shadow-inner">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Share your experience..."
                  className="w-full min-h-[240px] bg-transparent text-[15px] text-white/90 placeholder:text-white/50 leading-relaxed resize-none outline-none p-5 whitespace-pre-wrap" // Added whitespace-pre-wrap
                  autoFocus
                  style={{ whiteSpace: "pre-wrap" }}
                />
                <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-white/10 rounded-tl-lg" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-white/10 rounded-br-lg" />
              </div>
            </div>

            {/* Footer */}
            <div className="px-10 py-8 flex items-center justify-end gap-8">
              <button
                onClick={closeModal}
                className="text-[13px] font-medium text-white/70 hover:text-white transition-colors tracking-wide"
              >
                Discard
              </button>
              <button
                onClick={handleSubmit}
                disabled={!text.trim() || submitting}
                className="group relative flex items-center gap-3 px-8 py-3 bg-white text-black text-[13px] font-bold rounded-full hover:bg-[#22c55e] hover:text-white disabled:opacity-20 transition-all duration-500 overflow-hidden"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    Processing
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    {editingId ? "Update Entry" : "Post Review"}
                    <ChevronRight
                      size={14}
                      className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                    />
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <ReviewReportModal
        review={reportModal}
        isOpen={!!reportModal}
        onClose={() => setReportModal(null)}
        onSuccess={(msg, type = "success") => showToast(msg, type)}
      />
    </div>
  );
}
