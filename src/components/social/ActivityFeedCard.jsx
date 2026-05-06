import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toggleLike } from "../../services/reviewService";
import toast from "react-hot-toast";
import SpoilerWarning from "../reviews/SpoilerWarning";
import api from "../../api/api";
import ReviewReportModal from "../reviews/ReviewReportModal";

function ActivityFeedCard({ item }) {
  const [movieData, setMovieData] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(item.is_liked);
  const [likeCount, setLikeCount] = useState(item.like_count || 0);
  const [reportModal, setReportModal] = useState(null);
  const [avatarError, setAvatarError] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  if (!item || !item.user) return null;

  const { user, movie_id, rating, review, created_at, review_id } = item;
  const username = user.username;
  const userId = user.id;
  const avatarUrl = user.avatar;

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movie_id}?api_key=${import.meta.env.VITE_TMDB_API_KEY}`,
        );
        const data = await response.json();
        setMovieData(data);
      } catch (error) {
        console.error("Error fetching movie data:", error);
      }
    };
    if (movie_id) fetchMovieData();
  }, [movie_id]);

  const handleLikeClick = async (e) => {
    e.stopPropagation();
    if (!token) {
      toast.error("Login to like reviews");
      return;
    }

    const prevLiked = isLiked;
    const prevCount = likeCount;

    setIsLiked(!prevLiked);
    setLikeCount(prevLiked ? prevCount - 1 : prevCount + 1);

    try {
      await toggleLike(review_id, token);
    } catch (err) {
      setIsLiked(prevLiked);
      setLikeCount(prevCount);
      toast.error("Failed to update like");
    }
  };

  const posterUrl = movieData?.poster_path
    ? `https://image.tmdb.org/t/p/w300${movieData.poster_path}`
    : null;

  const renderStars = (ratingValue) => {
    const stars = [];
    const fullStars = Math.floor(ratingValue);
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span
          key={i}
          className={i < fullStars ? "text-amber-400" : "text-white/20"}
        >
          ★
        </span>,
      );
    }
    return stars;
  };

  const shouldTruncate = review && review.length > 100;
  const displayContent = expanded ? review : (shouldTruncate ? review?.slice(0, 100) + '...' : review);
  
  const handleMovieClick = () => navigate(`/movie/${movie_id}`);
  const handleUserClick = (e) => {
    e.stopPropagation();
    navigate(`/users/${userId}`);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.01 }}
        className="group relative bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-xl p-5 transition-all duration-300 hover:bg-zinc-800/40 hover:border-emerald-500/30 hover:shadow-[0_0_20px_-5px_rgba(0,0,0,0.3)]"
      >
        {/* Top Row: Avatar, Username, Action, Movie Title, Date */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          {/* Avatar */}
          <div
            onClick={handleUserClick}
            className="relative w-8 h-8 rounded-full overflow-hidden border border-white/10 cursor-pointer hover:border-emerald-500/50 transition-all duration-300 flex-shrink-0"
          >
            {avatarUrl && !avatarError ? (
              <img
                src={avatarUrl}
                alt={username}
                className="w-full h-full object-cover"
                onError={() => setAvatarError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 text-emerald-400 text-xs font-medium">
                {username?.[0]?.toUpperCase()}
              </div>
            )}
          </div>

          {/* Username */}
          <span
            onClick={handleUserClick}
            className="text-sm font-semibold text-zinc-100 whitespace-nowrap hover:text-emerald-400 transition-colors cursor-pointer"
          >
            @{username}
          </span>

          {/* Action text */}
          <span className="text-xs text-zinc-400 whitespace-nowrap">
            {item.activity_type === "rating_and_review" ||
            (rating && review)
              ? "rated and reviewed"
              : item.activity_type === "rating" || (rating && !review)
                ? "rated"
                : "shared"}
          </span>

          {/* Movie title */}
          <span
            onClick={handleMovieClick}
            className="text-sm font-medium text-emerald-400 truncate min-w-0 flex-1 hover:text-emerald-300 transition-colors cursor-pointer"
          >
            {movieData?.title || `Movie #${movie_id}`}
          </span>

          {/* Date */}
          <span className="text-[10px] text-zinc-400 uppercase tracking-wider flex-shrink-0">
            {new Date(created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        {/* Main Content Row: Poster + Rating + Review */}
        <div className="flex gap-5 relative">
          {/* Poster */}
          <div
            onClick={handleMovieClick}
            className="relative h-40 w-28 flex-shrink-0 overflow-hidden bg-zinc-900 shadow-lg border border-white/10 group-hover:border-emerald-500/40 transition-all duration-300 cursor-pointer rounded-md"
          >
            {posterUrl ? (
              <img
                src={posterUrl}
                srcSet={`${posterUrl} 1x, ${posterUrl.replace("w300", "w500")} 2x`}
                alt={movieData?.title || "Movie poster"}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-2xl text-zinc-600">
                🎬
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="flex flex-1 flex-col min-w-0 gap-3">
            {/* Rating Stars - Same styling as review section */}
            {rating && (
              <div className="flex items-center gap-0.5 text-sm bg-white/5 rounded-lg p-3 border border-white/5">
                <span className="text-zinc-400 mr-2 text-xs">Rating:</span>
                {renderStars(rating)}
                <span className="text-zinc-400 ml-2 text-xs">({rating}/5)</span>
              </div>
            )}

            {/* Review Text with Premium Expansion UI */}
            {review && (
              <div>
                {item.is_spoiler === true ? (
                  <SpoilerWarning content={review} confidence={1} />
                ) : item.has_spoiler === true ? (
                  <SpoilerWarning
                    content={review}
                    confidence={item.spoiler_confidence}
                  />
                ) : (
                  <div className="relative bg-white/[0.03] rounded-lg p-3 border border-white/5 hover:bg-white/[0.06] transition-all duration-300">
                    {/* Review Text Area with smooth height transition */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={expanded ? "expanded" : "collapsed"}
                        initial={false}
                        animate={{ height: "auto" }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="relative"
                      >
<p
  className={`
    whitespace-pre-line
    break-words
    text-[14px]
    leading-7
    tracking-[0.01em]
    font-light
    text-zinc-300
    transition-all
    duration-300
    antialiased
    ${
      !expanded
        ? "line-clamp-2 opacity-80"
        : "opacity-100"
    }
  `}
>
  {displayContent}
</p>
                      </motion.div>
                    </AnimatePresence>
                    
                    {/* The Micro-Expansion Toggle Button */}
                    {review?.length > 100 && (
                      <div className="mt-3 flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpanded(!expanded);
                          }}
                          className="inline-flex items-center gap-1.5 px-2 py-1 rounded-[4px] bg-white/[0.03] border border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all duration-200 group/btn"
                        >
                          <span className="text-[8px] font-black uppercase tracking-[0.25em] text-zinc-500 group-hover:text-emerald-400 transition-colors">
                            {expanded ? "Collapse" : "Expand Review"}
                          </span>
                          <svg
                            className={`w-1.5 h-1.5 text-zinc-600 group-hover:text-emerald-400 transition-transform duration-500 ease-in-out ${
                              expanded ? "rotate-180" : ""
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={5}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>

                        {/* Subtle divider line shown only when collapsed */}
                        {!expanded && (
                          <div className="h-px flex-1 bg-gradient-to-r from-white/5 to-transparent" />
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* If only rating exists without review */}
            {rating && !review && (
              <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                <p className="text-sm text-zinc-400 italic whitespace-pre-wrap break-words">
                  No written review provided
                </p>
              </div>
            )}

            {/* If only review exists without rating */}
            {!rating && review && (
              <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                <p className="text-sm text-zinc-400 italic whitespace-pre-wrap break-words">
                  No rating provided
                </p>
              </div>
            )}

            {/* Bottom Actions - Like on Left, Report on Right */}
            <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
              {/* Like Button - Left side */}
              {review_id && (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleLikeClick}
                  className={`flex items-center gap-1.5 transition-all duration-300 px-3 py-1 rounded-full ${
                    isLiked
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "text-zinc-500 hover:bg-white/5"
                  }`}
                >
                  <div className="relative">
                    <Heart
                      size={14}
                      className={`transition-colors duration-300 ${isLiked ? "fill-emerald-400 text-emerald-400" : ""}`}
                    />
                    <AnimatePresence>
                      {isLiked && (
                        <motion.div
                          initial={{ scale: 0, opacity: 1 }}
                          animate={{ scale: 2, opacity: 0 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-emerald-400 rounded-full blur-sm"
                        />
                      )}
                    </AnimatePresence>
                  </div>
                  <span className="text-xs font-semibold tabular-nums">
                    {likeCount}
                  </span>
                </motion.button>
              )}
              
              {/* Report Button - Right side */}
              {review_id && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setReportModal({
                      id: review_id,
                      content: review,
                    });
                  }}
                  className="text-xs text-red-400 hover:text-red-300 transition-all px-3 py-1 rounded-full hover:bg-red-500/10"
                >
                  Report
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <ReviewReportModal
        review={reportModal}
        isOpen={!!reportModal}
        onClose={() => setReportModal(null)}
        onSuccess={(msg, type = "success") => {
          if (type === "error") {
            toast.error(msg);
          } else {
            toast.success(msg);
          }
        }}
      />
    </>
  );
}

export default ActivityFeedCard;