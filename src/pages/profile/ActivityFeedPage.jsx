import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getActivityFeed,
  getTrendingReviews,
} from "../../services/activityService";
import ActivityFeedCard from "../../components/social/ActivityFeedCard";
import TrendingReviewCard from "../../components/social/TrendingReviewCard";



export default function ActivityFeedPage() {
  const [activeTab, setActiveTab] = useState("following");
  const [feed, setFeed] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (activeTab === "following") fetchFeed();
    if (activeTab === "trending") fetchTrending();
  }, [activeTab]);

  const fetchFeed = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getActivityFeed();
      setFeed(res.data || []);
    } catch (err) {
      setError("Failed to load activity feed.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTrending = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getTrendingReviews();
      setTrending(res.data || []);
    } catch (err) {
      setError("Failed to load trending reviews.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (activeTab === "following") fetchFeed();
    else fetchTrending();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="relative flex flex-col items-center justify-center mb-10 text-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Activity <span className="text-emerald-500">Feed</span>
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              Latest updates from your cinema network
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={loading}
            className="absolute top-0 right-0 p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-emerald-500 hover:border-emerald-500/50 transition-all disabled:opacity-50"
          >
            <RefreshIcon className={loading ? "animate-spin" : ""} />
          </motion.button>
        </header>

        {/* Tabs */}
        <div className="flex gap-6 mb-8 border-b border-zinc-800/50">
          {[
            { id: "following", label: "Following" },
            { id: "trending", label: "Trending" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative py-2.5 text-sm font-medium transition-colors duration-300 ${
                activeTab === tab.id
                  ? "text-emerald-400"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <span className="relative z-20">{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTabLine"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400 to-emerald-500"
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                    duration: 0.3,
                  }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <main>
          {loading ? (
            <LoadingSkeleton />
          ) : error ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-16 px-6 bg-zinc-900/30 rounded-2xl border border-red-900/20 text-center"
            >
              <p className="text-zinc-400 text-sm mb-4">{error}</p>
              <button
                onClick={handleRefresh}
                className="px-5 py-2 bg-emerald-600/10 text-emerald-500 rounded-lg text-sm font-medium hover:bg-emerald-600/20 transition-colors"
              >
                Retry
              </button>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              {activeTab === "following" && (
                <motion.div
                  key="following"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  {feed.length === 0 ? (
                    <EmptyState 
                      message="No recent activity to show"
                      subMessage="When your friends rate or review movies, it will appear here"
                    />
                  ) : (
                    feed.map((item, index) => (
                      <motion.div
                        key={`${item.user?.id}-${item.movie_id}-${index}`}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.3, delay: index * 0.03 }}
                      >
                        <ActivityFeedCard item={item} />
                      </motion.div>
                    ))
                  )}
                </motion.div>
              )}

              {activeTab === "trending" && (
                <motion.div
                  key="trending"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  {trending.length === 0 ? (
                    <EmptyState 
                      message="No trending reviews this week"
                      subMessage="Check back later for popular reviews"
                    />
                  ) : (
                    trending.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.03 }}
                      >
                        <TrendingReviewCard item={item} />
                      </motion.div>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </main>
      </div>
    </div>
  );
}


const LoadingSkeleton = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
          className="relative overflow-hidden bg-gradient-to-br from-zinc-900/40 to-zinc-900/20 rounded-2xl border border-zinc-800/50 p-4"
        >
          {/* Avatar skeleton */}
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-800/50" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-zinc-700/30 to-transparent shimmer" />
            </div>
            
            <div className="flex-1 space-y-3">
              {/* Username skeleton */}
              <div className="flex items-center gap-2">
                <div className="h-4 w-28 bg-gradient-to-r from-zinc-800 to-zinc-800/50 rounded-md" />
                <div className="h-3 w-16 bg-gradient-to-r from-zinc-800/60 to-zinc-800/30 rounded-md" />
              </div>
              
              {/* Movie title skeleton */}
              <div className="h-5 w-48 bg-gradient-to-r from-zinc-800 to-zinc-800/50 rounded-md" />
              
              {/* Rating stars skeleton */}
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <div key={star} className="w-4 h-4 bg-zinc-800 rounded-full" />
                ))}
              </div>
              
              {/* Review text skeleton - multiple lines */}
              <div className="space-y-2 pt-2">
                <div className="h-3 w-full bg-gradient-to-r from-zinc-800/70 to-zinc-800/30 rounded" />
                <div className="h-3 w-3/4 bg-gradient-to-r from-zinc-800/70 to-zinc-800/30 rounded" />
                <div className="h-3 w-1/2 bg-gradient-to-r from-zinc-800/70 to-zinc-800/30 rounded" />
              </div>
            </div>
          </div>
          
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </motion.div>
      ))}
      
      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};


const EmptyState = ({ message, subMessage }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-20 px-6 bg-gradient-to-br from-zinc-900/20 to-zinc-900/10 rounded-2xl border border-dashed border-zinc-800/50 text-center"
  >
    <div className="w-16 h-16 rounded-full bg-zinc-800/30 flex items-center justify-center mb-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 text-zinc-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
        />
      </svg>
    </div>
    <p className="text-zinc-400 text-sm font-medium mb-1">{message}</p>
    <p className="text-zinc-600 text-xs">{subMessage}</p>
  </motion.div>
);

const RefreshIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-5 w-5 ${className}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
    />
  </svg>
);