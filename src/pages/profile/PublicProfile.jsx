import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { toggleLike } from "../../services/reviewService";
import {
  UserPlus,
  Folder,
  Activity,
  AlertCircle,
  Loader2,
  Film,
  Sparkles,
  Layers,
  Clock,
  ChevronRight,
  Users,
  Heart, MessageSquare, Maximize2, Minimize2, Star
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/api";
import { sendFollowRequest, unfollowUser } from "../../services/followService";
import ProfileCard from "./ProfileCard";
import SpoilerWarning from "../../components/reviews/SpoilerWarning";
import ReviewReportModal from "../../components/reviews/ReviewReportModal";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export default function PublicProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("access");
  
  const profileCardRef = useRef(null);
  const mainContentRef = useRef(null);
  const [cardHeight, setCardHeight] = useState(0);
  const [isCardSticky, setIsCardSticky] = useState(false);

  const getCurrentUserId = () => {
    const token = localStorage.getItem("access");
    if (!token) return null;
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const payload = JSON.parse(window.atob(base64));
      return payload.user_id || payload.id || payload.sub || payload.userId;
    } catch (error) {
      return null;
    }
  };

  const currentUserId = getCurrentUserId();

  const [profile, setProfile] = useState(null);
  const [movies, setMovies] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("activity");
  const [followStatus, setFollowStatus] = useState("not_following");
  const [followLoading, setFollowLoading] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState({});
  const [reportModal, setReportModal] = useState(null);

  // Scroll animation values
  const { scrollY } = useScroll();
  const cardOpacity = useTransform(scrollY, [0, 300], [1, 0.95]);
  const cardScale = useTransform(scrollY, [0, 300], [1, 0.98]);

  useEffect(() => {
    fetchProfile();
  }, [id]);


  useEffect(() => {
    if (profileCardRef.current) {
      setCardHeight(profileCardRef.current.offsetHeight);
    }
  }, [profile]);


  useEffect(() => {
    const handleScroll = () => {
      if (mainContentRef.current) {
        const mainTop = mainContentRef.current.getBoundingClientRect().top;
        setIsCardSticky(mainTop <= 100);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const resolveFollowStatus = (data) => {
    if (data?.follow_status) return data.follow_status;
    if (data?.followStatus) return data.followStatus;
    if (data?.follow_requested) return "requested";
    if (data?.is_following) return "following";
    return "not_following";
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/auth/users/${id}/`);
      setProfile(res.data);

      try {
        const statsRes = await api.get(`/social/follow/stats/?user_id=${id}`);
        const stats = statsRes.data;

        setProfile((prev) => ({
          ...prev,
          stats: {
            ...prev.stats,
            followers_count: stats.followers_count,
            following_count: stats.following_count,
          },
        }));

        let status = resolveFollowStatus(res.data);
        if (status === "not_following") {
          if (stats.is_following) {
            status = "following";
          } else {
            const sentRequestsRes = await api.get(
              `/social/follow/sent_requests/`,
            );
            const hasPendingRequest = sentRequestsRes.data.some(
              (req) => req.following_id === parseInt(id),
            );
            status = hasPendingRequest ? "requested" : "not_following";
          }
        }
        setFollowStatus(status);
      } catch (followErr) {
        setFollowStatus("not_following");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchMovie = async (movieId) => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`,
      );
      return await res.json();
    } catch {
      return null;
    }
  };

const getActivityFeed = () => {
  if (!profile) return [];
  const grouped = {};

  profile.ratings?.forEach((r) => {
    if (!grouped[r.movie_id]) {
      grouped[r.movie_id] = {
        id: `activity-${r.movie_id}`,
        movie_id: r.movie_id,
        timestamp: r.created_at || null,
        rating_date: r.created_at || null,  // ✅ store separately
      };
    }
    grouped[r.movie_id].rating = r.rating;
    grouped[r.movie_id].rating_date = r.created_at || null;  // ✅
    if (r.created_at) grouped[r.movie_id].timestamp = r.created_at;
  });

  profile.reviews?.forEach((r) => {
    if (!grouped[r.movie_id]) {
      grouped[r.movie_id] = {
        id: `activity-${r.movie_id}`,
        movie_id: r.movie_id,
        timestamp: r.created_at,
        rating_date: null,
      };
    }
    grouped[r.movie_id].review = r.review || r.content;
    grouped[r.movie_id].review_id = r.id;
    grouped[r.movie_id].review_date = r.created_at;  // ✅ store review date separately
    grouped[r.movie_id].like_count = r.like_count;
    grouped[r.movie_id].is_liked = r.is_liked;
    grouped[r.movie_id].has_spoiler = r.has_spoiler || false;
    grouped[r.movie_id].spoiler_confidence = r.spoiler_confidence || 0;
    grouped[r.movie_id].spoiler_reasoning = r.spoiler_reasoning || null;
    grouped[r.movie_id].is_spoiler_overridden = r.is_spoiler_overridden || false;
    grouped[r.movie_id].is_spoiler = r.is_spoiler || false;
    // ✅ use review date as the activity sort timestamp
    if (r.created_at) grouped[r.movie_id].timestamp = r.created_at;
  });

  return Object.values(grouped)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 15);
};
  const activityFeed = getActivityFeed();

  useEffect(() => {
    const loadMovies = async () => {
      const data = {};
      for (const item of activityFeed) {
        if (!data[item.movie_id]) {
          const movie = await fetchMovie(item.movie_id);
          data[item.movie_id] = movie;
        }
      }
      setMovies(data);
    };
    if (activityFeed.length) loadMovies();
  }, [profile]);

  const handleFollow = async () => {
    if (followLoading) return;
    setFollowLoading(true);
    try {
      if (followStatus === "following") {
        await unfollowUser(parseInt(id));
        setFollowStatus("not_following");
        toast.success("Unfollowed successfully");
      } else if (followStatus === "not_following") {
        await sendFollowRequest(parseInt(id));
        setFollowStatus("requested");
        toast.success("Follow request sent");
      }
      setTimeout(() => fetchProfile(), 1000);
    } catch (err) {
      toast.error(err.response?.data?.error || "Something went wrong");
    } finally {
      setFollowLoading(false);
    }
  };

  const toggleReviewExpand = (activityId) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [activityId]: !prev[activityId],
    }));
  };

  const handleLike = async (reviewId) => {
    if (!token) {
      toast.error("Login to like reviews");
      return;
    }

    setProfile((prev) => ({
      ...prev,
      reviews: prev.reviews.map((r) => {
        if (r.id !== reviewId) return r;
        return {
          ...r,
          is_liked: !r.is_liked,
          like_count: r.is_liked ? r.like_count - 1 : r.like_count + 1,
        };
      }),
    }));

    try {
      await toggleLike(reviewId, token);
    } catch (err) {
      setProfile((prev) => ({
        ...prev,
        reviews: prev.reviews.map((r) => {
          if (r.id !== reviewId) return r;
          return {
            ...r,
            is_liked: !r.is_liked,
            like_count: r.is_liked ? r.like_count - 1 : r.like_count + 1,
          };
        }),
      }));
      toast.error("Failed to like review");
    }
  };

if (loading)
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header skeleton */}
        <div className="flex justify-between items-center mb-12">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-zinc-800 rounded-lg animate-pulse" />
            <div className="h-4 w-64 bg-zinc-800/50 rounded-lg animate-pulse" />
          </div>
          <div className="h-10 w-32 bg-zinc-800 rounded-lg animate-pulse" />
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-zinc-800 rounded-full animate-pulse" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 w-32 bg-zinc-800 rounded animate-pulse" />
                  <div className="h-3 w-24 bg-zinc-800/50 rounded animate-pulse" />
                  <div className="h-20 w-full bg-zinc-800/30 rounded animate-pulse" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8" ref={mainContentRef}>
            
            {/* Sticky Profile Card Container */}
            <div 
              ref={profileCardRef}
              className={`transition-all duration-500 ${
                isCardSticky ? 'lg:sticky lg:top-24' : ''
              }`}
              style={{ height: isCardSticky ? cardHeight : 'auto' }}
            >
              <motion.div
                style={{ 
                  opacity: cardOpacity,
                  scale: cardScale
                }}
                transition={{ duration: 0.2 }}
              >
                <ProfileCard
                  profile={profile}
                  followStatus={followStatus}
                  followLoading={followLoading}
                  onFollow={handleFollow}
                  navigate={navigate}
                  userId={id}
                  currentUserId={currentUserId}
                  onProfileUpdate={fetchProfile}
                />
              </motion.div>
            </div>

            {/* Main Content */}
            <main>
              <div className="flex gap-2 mb-10 border-b border-zinc-800/50">
                {[
                  { id: "activity", label: "Activity", icon: Activity },
                  { id: "lists", label: "Collections", icon: Folder },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative px-8 py-4 text-xs font-medium uppercase tracking-[0.2em] transition-all duration-300 flex items-center gap-3 ${
                      activeTab === tab.id
                        ? "text-white"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    <tab.icon
                      className={`w-4 h-4 ${activeTab === tab.id ? "text-emerald-500" : "text-zinc-600"}`}
                    />
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-emerald-500 shadow-[0_-4px_12px_rgba(16,185,129,0.3)]"
                      />
                    )}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
{activeTab === "activity" ? (
  <motion.div
    key="activity"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="space-y-3"
  >
    {activityFeed.map((item, idx) => {
      const movie = movies[item.movie_id];
      const isExpanded = expandedReviews[item.id];
      const reviewText = item.review || "";
      const shouldTruncate = reviewText.length > 180;

      return (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.03 }}
          className="group relative bg-gradient-to-br from-zinc-900/90 to-zinc-900/50 rounded-xl overflow-hidden border border-zinc-800/50 hover:border-zinc-700/50 transition-all duration-300 hover:shadow-lg hover:shadow-black/20"
        >
          {/* Premium Hover Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

          {/* Inner Content */}
          <div className="p-4">
            <div className="flex gap-4">
              
              {/* Left Section - Date & Poster */}
              <div className="flex gap-3">
                {/* Letterboxd Style Date Box */}
{/* Date Box — show review date if exists, else rating date */}
{/* Date Box — Premium Letterboxd Style with Hover Effects */}
<div className="flex flex-col items-center justify-center min-w-[65px] group/date">
  {(() => {
    const dateStr = item.review_date || item.rating_date || item.timestamp;
    const date = dateStr ? new Date(dateStr) : null;
    return date ? (
      <div className="relative flex flex-col items-center">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent rounded-2xl blur-md opacity-0 group-hover/date:opacity-100 transition-opacity duration-500" />
        
        {/* Container with subtle border */}
        <div className="relative flex flex-col items-center px-3 py-2 rounded-xl border border-zinc-800/50 group-hover/date:border-emerald-500/30 transition-all duration-300">
          {/* Month */}
          <span className="text-emerald-400/70 group-hover/date:text-emerald-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-1 transition-colors duration-300">
            {date.toLocaleString('default', { month: 'short' }).toUpperCase()}
          </span>
          
          {/* Day */}
          <span className="text-white text-2xl font-light leading-tight tracking-tight group-hover/date:scale-105 transition-transform duration-300">
            {date.getDate()}
          </span>
          
          {/* Year with separator */}
          <div className="flex items-center gap-1 mt-1.5">
            <div className="w-2 h-[1px] bg-emerald-500/30" />
            <span className="text-zinc-200 text-[11px] font-mono tracking-wider">
              {date.getFullYear()}
            </span>
            <div className="w-2 h-[1px] bg-emerald-500/30" />
          </div>
        </div>
      </div>
    ) : (
      <div className="flex flex-col items-center px-3 py-2 rounded-xl border border-dashed border-zinc-800/40 opacity-40">
        <span className="text-zinc-600 text-[9px] font-medium">—</span>
        <span className="text-zinc-700 text-[7px] mt-1">unrated</span>
      </div>
    );
  })()}
</div>

                {/* Poster Section */}
                <div 
                  className="relative shrink-0 cursor-pointer"
                  onClick={() => movie && navigate(`/movie/${item.movie_id}`)}
                >
                  
                  {movie?.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                      className="relative w-20 h-[120px] object-cover rounded-lg shadow-md border border-zinc-700/50 group-hover:border-zinc-600/50 transition-all duration-300"
                      alt={movie?.title || "Movie Poster"}
                    />
                  ) : (
                    <div className="relative w-20 h-[120px] bg-zinc-900 rounded-lg shadow-md border border-zinc-700/50 flex items-center justify-center">
                      <Film className="text-zinc-700" size={24} />
                    </div>
                  )}
                </div>
              </div>

              {/* Right Section - Content */}
              <div className="flex-1 min-w-0">
                {/* Title Row */}
                <div 
                  onClick={() => navigate(`/movie/${item.movie_id}`)}
                  className="flex items-start justify-between gap-2 mb-2 cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <h2 className="text-sm font-semibold text-zinc-100 hover:text-white transition-colors tracking-tight truncate flex items-center gap-2">
                      <span>{movie?.title || "Loading..."}</span>
                      {movie?.release_date && (
                        <span className="text-zinc-500 text-[10px] font-medium shrink-0">
                          {new Date(movie.release_date).getFullYear()}
                        </span>
                      )}
                    </h2>
                  </div>

                  {/* Like and Report Buttons */}
                  {item.review_id && (
                    <div className="flex items-center gap-1 shrink-0">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(item.review_id);
                        }}
                        className={`flex items-center gap-1 px-2 py-0.5 rounded-md transition-all duration-300 ${
                          item.is_liked
                            ? "bg-[#00e054]/10 border border-[#00e054]/20"
                            : "bg-transparent border border-transparent hover:border-zinc-700 hover:bg-white/5"
                        }`}
                      >
                        <Heart
                          size={10}
                          className={`transition-all ${
                            item.is_liked
                              ? "fill-[#00e054] text-[#00e054]"
                              : "text-zinc-500 hover:text-[#00e054]"
                          }`}
                        />
                        <span className="text-[10px] font-medium text-zinc-400">
                          {item.like_count || 0}
                        </span>
                      </motion.button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setReportModal({
                            id: item.review_id,
                            content: item.review,
                          });
                        }}
                        className="text-[10px] text-red-400/70 hover:text-red-400 px-2 py-0.5 rounded-md hover:bg-red-500/10 transition-all"
                      >
                        Report
                      </button>
                    </div>
                  )}
                </div>

                {/* Rating Stars */}
                {item.rating && (
                  <div className="mb-3 pb-2 border-b border-zinc-800/50">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={
                            i < Math.floor(item.rating)
                              ? "fill-[#00e054] text-[#00e054]"
                              : "text-zinc-700"
                          }
                        />
                      ))}
                      {item.rating % 1 !== 0 && (
                        <div className="relative">
                          <Star size={12} className="text-zinc-700" />
                          <div className="absolute inset-0 overflow-hidden w-1/2">
                            <Star size={12} className="fill-[#00e054] text-[#00e054]" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Review Section */}
                {item.review && (
                  <div className="mt-2">
                    <div className="flex items-center gap-1.5 mb-2">
                      <MessageSquare size={10} className="text-zinc-500" />
                      <span className="text-[9px] font-medium text-zinc-500 uppercase tracking-wider">
                        Review
                      </span>
                    </div>

                    <div className="bg-zinc-900/30 rounded-lg p-3 border border-zinc-800/30 hover:border-zinc-700/30 transition-all duration-300">
                      {item.has_spoiler && !item.is_spoiler_overridden ? (
                        <SpoilerWarning 
                          content={item.review} 
                          confidence={item.spoiler_confidence || 0.7}
                        />
                      ) : (
                        <>
                          <p className="text-xs text-zinc-300 leading-relaxed">
                            {isExpanded ? reviewText : reviewText.slice(0, 150)}
                            {shouldTruncate && !isExpanded && "..."}
                          </p>
                          {shouldTruncate && (
                            <button
                              onClick={() => toggleReviewExpand(item.id)}
                              className="flex items-center gap-1 mt-2 text-zinc-500 hover:text-[#00e054] transition-all duration-200 group/btn"
                            >
                              {isExpanded ? (
                                <>
                                  <Minimize2 size={10} className="transition-transform group-hover/btn:scale-90" />
                                  <span className="text-[9px] font-medium tracking-wide">Show less</span>
                                </>
                              ) : (
                                <>
                                  <Maximize2 size={10} className="transition-transform group-hover/btn:scale-110" />
                                  <span className="text-[9px] font-medium tracking-wide">Expand review</span>
                                </>
                              )}
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      );
    })}

    {activityFeed.length === 0 && (
      <div className="text-center py-24 border border-dashed border-zinc-800 rounded-2xl">
        <Activity className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
        <p className="text-zinc-500 text-sm">No recent activity</p>
      </div>
    )}
  </motion.div>
) : (

  <motion.div
    key="lists"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="grid grid-cols-1 md:grid-cols-2 gap-6"
  >
    {profile?.lists?.map((list) => (
      <div
        key={list.id}
        onClick={() =>
          navigate(`/lists/public/${list.id}`, {
            state: { listData: list },
          })
        }
        className="group relative bg-gradient-to-br from-zinc-900/90 to-black/90 p-6 rounded-2xl border border-zinc-800 hover:border-emerald-500/50 transition-all cursor-pointer"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="p-2 bg-emerald-500/10 rounded-lg">
            <Layers className="w-5 h-5 text-emerald-400" />
          </div>
          <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-emerald-400 transition-all" />
        </div>
        <h3 className="text-lg font-semibold mb-2 group-hover:text-emerald-400 transition-colors">
          {list.name}
        </h3>
        {list.description && (
          <p className="text-sm text-zinc-500 line-clamp-2">
            {list.description}
          </p>
        )}
        <div className="mt-4 pt-4 border-t border-zinc-800/50 flex justify-between items-center">
          <span className="text-xs text-emerald-400 font-medium">
            {list.items?.length || 0} movies
          </span>
          <span className="text-xs text-zinc-600">
            {new Date(list.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
    ))}
  </motion.div>
)}
              </AnimatePresence>
            </main>
          </div>
        </div>
      </div>

      {/* Report Modal */}
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
    </div>
  );
}