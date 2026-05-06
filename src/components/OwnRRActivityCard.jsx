import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, MessageSquare, Maximize2, Minimize2, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SpoilerWarning from "./reviews/SpoilerWarning";

const IMAGE_BASE = "https://image.tmdb.org/t/p/w342";

export default function ActivityCard({ activity }) {
  const {
    title,
    poster_path,
    rating,
    review,
    movie_id,
    like_count,
    review_id,
    created_at,
    is_spoiler,
    is_spoiler_overridden,
    has_spoiler,
    spoiler_confidence,
    release_date,
  } = activity;

  const [expanded, setExpanded] = useState(false);
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState(""); // Added year state
  const navigate = useNavigate();

  const renderStars = (num) => {
    const fullStars = Math.floor(num);
    const hasHalf = num % 1 !== 0;
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} size={14} className="fill-[#00e054] text-[#00e054]" />
        ))}
        {hasHalf && (
          <div className="relative">
            <Star size={14} className="text-zinc-700" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star size={14} className="fill-[#00e054] text-[#00e054]" />
            </div>
          </div>
        )}
        {[...Array(5 - Math.ceil(num))].map((_, i) => (
          <Star key={i} size={14} className="text-zinc-700" />
        ))}
      </div>
    );
  };

  const handleNavigate = () => {
    navigate(`/movie/${movie_id}`);
  };

  const handleReviewClick = (e) => {
    e.stopPropagation();
  };

  useEffect(() => {
    if (created_at) {
      const date = new Date(created_at);
      setDay(date.getDate());
      setMonth(
        date.toLocaleString("default", { month: "short" }).toUpperCase(),
      );
      setYear(date.getFullYear()); // Set year
    }
  }, [created_at]);

  const movieYear = release_date ? new Date(release_date).getFullYear() : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative block"
    >
      {/* Card Container */}
      <div className="relative bg-gradient-to-br from-zinc-900/90 to-zinc-900/50 rounded-xl overflow-hidden border border-zinc-800/50 hover:border-zinc-700/50 transition-all duration-300 hover:shadow-lg hover:shadow-black/20">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

        <div className="p-5">
          <div className="flex gap-5">
            <div className="flex gap-4">
              {/* Letterboxd Style Date Box */}
              <div className="flex flex-col items-center justify-center min-w-[64px] h-[72px] bg-zinc-900/40 rounded-xl border border-white/[0.03] shadow-sm">
                <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest leading-none">
                  {month || "APR"}
                </span>

                <span className="text-white text-2xl font-medium leading-none my-1.5">
                  {day || "01"}
                </span>

                <span className="text-zinc-500 text-[10px] font-medium tracking-tight leading-none">
                  {year || "2026"}
                </span>
              </div>

              {/* Poster Section */}
              <div
                onClick={handleNavigate}
                className="relative shrink-0 cursor-pointer"
              >
                <img
                  src={`${IMAGE_BASE}${poster_path}`}
                  alt={title}
                  className="relative w-24 h-36 object-cover rounded-lg shadow-md border border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-300"
                />
              </div>
            </div>

            {/* Right Section - Content */}
            <div className="flex-1 min-w-0">
              {/* Title Row - Clickable only on title */}
              <div
                onClick={handleNavigate}
                className="flex items-start justify-between gap-2 mb-2 cursor-pointer"
              >
                <div className="flex-1 min-w-0">
                  <h2 className="text-base font-semibold text-zinc-100 hover:text-white transition-colors tracking-tight truncate flex items-center gap-2">
                    <span>{title}</span>
                    {movieYear && (
                      <span className="text-zinc-500 text-xs font-medium shrink-0 pt-0.5">
                        {movieYear}
                      </span>
                    )}
                  </h2>
                </div>

                {/* Like Counter */}
                {review_id && like_count > 0 && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#00e054]/10 border border-[#00e054]/20 shrink-0">
                    <Heart
                      size={12}
                      className="fill-[#00e054] text-[#00e054]"
                    />
                    <span className="text-[11px] font-medium text-white tracking-tight">
                      {like_count}
                    </span>
                  </div>
                )}
              </div>

              {/* Stars Rating */}
              {rating !== null && (
                <div className="mb-4 pb-2 border-b border-zinc-800/50">
                  {renderStars(rating)}
                </div>
              )}

              {/* Review Section - No Navigation */}
              {review && (
                <div onClick={handleReviewClick} className="mt-2">
                  <div className="flex items-center gap-1.5 mb-2">
                    <MessageSquare size={12} className="text-zinc-500" />
                    <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
                      Review
                    </span>
                  </div>

                  <div className="bg-zinc-900/30 rounded-lg p-3 border border-zinc-800/30 hover:border-zinc-700/30 transition-all duration-300">
                    <AnimatePresence mode="wait">
                      {is_spoiler_overridden ? (
                        is_spoiler ? (
                          <SpoilerWarning content={review} confidence={1} />
                        ) : (
                          <motion.div
                            key="content"
                            initial={false}
                            animate={{ height: "auto" }}
                            transition={{ duration: 0.2 }}
                          >
                            <p
                              className={`text-sm text-zinc-300 leading-relaxed ${!expanded ? "line-clamp-2" : ""}`}
                            >
                              {review}
                            </p>
                          </motion.div>
                        )
                      ) : has_spoiler ? (
                        <SpoilerWarning
                          content={review}
                          confidence={spoiler_confidence}
                        />
                      ) : (
                        <motion.div
                          key="content"
                          initial={false}
                          animate={{ height: "auto" }}
                          transition={{ duration: 0.2 }}
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
    antialiased
    transition-all
    duration-300
    ${
      !expanded
        ? "line-clamp-2 opacity-90"
        : "opacity-100"
    }
  `}
>
  {review}
</p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Premium Expand/Collapse Button */}
                    {review.length > 100 &&
                      !(is_spoiler_overridden && is_spoiler) &&
                      !has_spoiler && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpanded(!expanded);
                          }}
                          className="flex items-center gap-1 mt-2 text-zinc-500 hover:text-[#00e054] transition-all duration-200 group/btn"
                        >
                          {expanded ? (
                            <>
                              <Minimize2
                                size={12}
                                className="transition-transform group-hover/btn:scale-90"
                              />
                              <span className="text-[10px] font-medium tracking-wide">
                                Show less
                              </span>
                            </>
                          ) : (
                            <>
                              <Maximize2
                                size={12}
                                className="transition-transform group-hover/btn:scale-110"
                              />
                              <span className="text-[10px] font-medium tracking-wide">
                                Expand review
                              </span>
                            </>
                          )}
                        </button>
                      )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
