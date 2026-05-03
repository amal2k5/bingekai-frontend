import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Legend,
} from "recharts";

export default function Dashboard({
  data,
  days,
  setDays,
  onFetchData,
  loading,
}) {
  const [activeTab, setActiveTab] = useState("analytics");
  const [customRange, setCustomRange] = useState({
    start: "",
    end: "",
  });
  const [isCustomMode, setIsCustomMode] = useState(false);

  const tabs = [
    { id: "analytics", label: "Analytics" },
    { id: "followers", label: "Most Followed" },
    { id: "liked", label: "Most Liked" },
  ];

  const handlePresetClick = (d) => {
    setDays(d);
    setCustomRange({ start: "", end: "" });
    setIsCustomMode(false);
  };

  const handleApplyCustomRange = async () => {
    if (!customRange.start || !customRange.end) {
      return;
    }

    if (new Date(customRange.start) > new Date(customRange.end)) {
      alert("Invalid date range: Start date must be before end date");
      return;
    }

    const diffDays = Math.ceil(
      (new Date(customRange.end) - new Date(customRange.start)) /
        (1000 * 60 * 60 * 24),
    );

    if (diffDays > 365) {
      alert("Date range cannot exceed 365 days");
      return;
    }

    setIsCustomMode(true);
    setDays(null);
    await onFetchData(null, customRange.start, customRange.end);
  };

  useEffect(() => {
    if (days && !isCustomMode) {
      onFetchData(days, null, null);
    }
  }, [days, isCustomMode, onFetchData]);

  const getActiveRangeText = () => {
    if (isCustomMode && customRange.start && customRange.end) {
      return `Custom: ${customRange.start} → ${customRange.end}`;
    }
    return `Last ${days} days`;
  };

  return (
    <div className="w-full">
      {/* Tab Buttons */}
      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`px-4 py-2 text-sm rounded-lg transition-all ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
            }`}
          >
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Tab Content with Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl border border-gray-800 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-800">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <h2 className="text-sm font-medium text-gray-300">
                    Activity Overview
                  </h2>
                  <motion.p
                    key={getActiveRangeText()}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded"
                  >
                    {getActiveRangeText()}
                  </motion.p>
                </div>
              </div>

              {/* Date Range Selector */}
              <div className="p-6 border-b border-gray-800 bg-black/20">
                <div className="flex flex-wrap items-center gap-3">
                  {/* Preset Buttons */}
                  <div className="flex gap-2">
                    {[1, 7, 30, 90].map((d) => (
                      <motion.button
                        key={d}
                        onClick={() => handlePresetClick(d)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
                          days === d && !isCustomMode
                            ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                      >
                        {d}d
                      </motion.button>
                    ))}
                  </div>

                  {/* Divider */}
                  <span className="text-gray-600 text-sm px-2">|</span>

                  {/* Custom Range Inputs */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <input
                      type="date"
                      value={customRange.start}
                      onChange={(e) =>
                        setCustomRange((prev) => ({
                          ...prev,
                          start: e.target.value,
                        }))
                      }
                      className="bg-gray-700 text-gray-200 px-3 py-1.5 rounded-lg text-sm border border-gray-600 focus:border-emerald-500 focus:outline-none transition-colors"
                    />
                    <span className="text-gray-500 text-sm">→</span>
                    <input
                      type="date"
                      value={customRange.end}
                      onChange={(e) =>
                        setCustomRange((prev) => ({
                          ...prev,
                          end: e.target.value,
                        }))
                      }
                      className="bg-gray-700 text-gray-200 px-3 py-1.5 rounded-lg text-sm border border-gray-600 focus:border-emerald-500 focus:outline-none transition-colors"
                    />
                    <motion.button
                      onClick={handleApplyCustomRange}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={!customRange.start || !customRange.end}
                      className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
                        !customRange.start || !customRange.end
                          ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                          : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md hover:shadow-lg"
                      }`}
                    >
                      Apply
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Chart Container */}
              <div className="p-6">
                {/* Loading State */}
                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center h-[400px]"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                      <p className="text-sm text-gray-400">
                        Loading activity data...
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Chart */}
                {!loading && (!data?.activity || data.activity.length === 0) ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center h-[400px]"
                  >
                    <p className="text-gray-400">No activity data available</p>
                  </motion.div>
                ) : (
                  !loading &&
                  data?.activity &&
                  data.activity.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="w-full"
                    >
                      <ResponsiveContainer width="100%" height={400}>
                        <AreaChart
                          data={data.activity}
                          margin={{ top: 10, right: 30, left: 10, bottom: 50 }}
                        >
                          <defs>
                            <linearGradient
                              id="colorRatings"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#3b82f6"
                                stopOpacity={0.3}
                              />
                              <stop
                                offset="95%"
                                stopColor="#3b82f6"
                                stopOpacity={0}
                              />
                            </linearGradient>
                            <linearGradient
                              id="colorReviews"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#f59e0b"
                                stopOpacity={0.3}
                              />
                              <stop
                                offset="95%"
                                stopColor="#f59e0b"
                                stopOpacity={0}
                              />
                            </linearGradient>
                            <linearGradient
                              id="colorTotal"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#10b981"
                                stopOpacity={0.2}
                              />
                              <stop
                                offset="95%"
                                stopColor="#10b981"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>

                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#374151"
                            vertical={false}
                          />

                          <XAxis
                            dataKey="date"
                            axisLine={{ stroke: "#4b5563", strokeWidth: 1 }}
                            tickLine={false}
                            tick={false}
                          />

                          <YAxis
                            axisLine={{ stroke: "#4b5563", strokeWidth: 1 }}
                            tickLine={false}
                            tick={false}
                          />

                          <Tooltip
                            cursor={{ stroke: "#4b5563", strokeWidth: 1 }}
                            content={({ active, payload, label }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-3 min-w-[180px]">
                                    <p className="text-gray-300 text-xs font-semibold mb-2 border-b border-gray-700 pb-1">
                                      {new Date(label).toLocaleDateString(
                                        "en-US",
                                        {
                                          weekday: "short",
                                          year: "numeric",
                                          month: "short",
                                          day: "numeric",
                                        },
                                      )}
                                    </p>
                                    {payload.map((item, index) => (
                                      <div
                                        key={index}
                                        className="flex justify-between gap-4 text-xs py-1"
                                      >
                                        <span
                                          style={{ color: item.color }}
                                          className="font-medium"
                                        >
                                          {item.name}
                                        </span>
                                        <span className="text-gray-200 font-semibold">
                                          {item.value.toLocaleString()}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />

                          <Area
                            type="monotone"
                            dataKey="ratings"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            fill="url(#colorRatings)"
                            dot={{ r: 3, fill: "#3b82f6", strokeWidth: 0 }}
                            activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }}
                            name="Ratings"
                          />

                          <Area
                            type="monotone"
                            dataKey="reviews"
                            stroke="#f59e0b"
                            strokeWidth={2}
                            fill="url(#colorReviews)"
                            dot={{ r: 3, fill: "#f59e0b", strokeWidth: 0 }}
                            activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }}
                            name="Reviews"
                          />

                          <Area
                            type="monotone"
                            dataKey="total"
                            stroke="#10b981"
                            strokeWidth={1.5}
                            strokeDasharray="6 4"
                            fill="url(#colorTotal)"
                            dot={false}
                            name="Total"
                          />
                        </AreaChart>
                      </ResponsiveContainer>

                      {/* Custom Legend Below Chart */}
                      <div className="flex justify-center items-center gap-6 mt-4 pt-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          <span className="text-xs text-gray-400">Ratings</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                          <span className="text-xs text-gray-400">Reviews</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                          <span className="text-xs text-gray-400">Total</span>
                        </div>
                      </div>
                    </motion.div>
                  )
                )}
              </div>
            </motion.div>
          )}

          {/* Most Followed Tab */}
          {activeTab === "followers" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-black rounded-2xl border border-white/5 shadow-2xl"
            >
              <div className="px-6 py-5 border-b border-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-0.5 h-7 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-full"></div>
                    <div>
                      <h2 className="text-base font-semibold text-white tracking-tight">
                        Most Followed Users
                      </h2>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Top contributors by followers
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5">
                    <svg
                      className="w-3.5 h-3.5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <span className="text-xs text-gray-300 font-medium">
                      {data?.insights?.most_followed_users?.length || 0}
                    </span>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-white/5">
                {data?.insights?.most_followed_users?.map((user, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04 }}
                    whileHover={{
                      backgroundColor: "rgba(255, 255, 255, 0.03)",
                    }}
                    className="group flex items-center justify-between p-4 transition-all duration-200"
                  >
                    <div className="flex items-center gap-4">


                      {/* Avatar Placeholder */}
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-all">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-white font-medium group-hover:text-emerald-400 transition-colors">
                            @{user.username}
                          </span>

                        </div>

                      </div>
                    </div>

                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.04 + 0.1 }}
                      className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/5 group-hover:bg-white/10 transition-all"
                    >
                      <svg
                        className="w-4 h-4 text-emerald-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <span className="text-sm text-white font-semibold">
                        {user.followers_count.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-300">followers</span>
                    </motion.div>
                  </motion.div>
                ))}

                {(!data?.insights?.most_followed_users ||
                  data.insights.most_followed_users.length === 0) && (
                  <div className="flex flex-col items-center justify-center py-16 px-4">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                      <svg
                        className="w-8 h-8 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-400 text-sm font-medium">
                      No data available
                    </p>
                    <p className="text-gray-600 text-xs mt-1">
                      Check back later for insights
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Most Liked Tab */}
          {activeTab === "liked" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-black rounded-2xl border border-white/5 shadow-2xl"
            >
              <div className="px-6 py-5 border-b border-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-0.5 h-7 bg-gradient-to-b from-rose-400 to-rose-600 rounded-full"></div>
                    <div>
                      <h2 className="text-base font-semibold text-white tracking-tight">
                        Most Liked Users
                      </h2>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Highest engagement recipients
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5">
                    <svg
                      className="w-3.5 h-3.5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    <span className="text-xs text-gray-300 font-medium">
                      {data?.insights?.most_liked_users?.length || 0}
                    </span>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-white/5">
                {data?.insights?.most_liked_users?.map((user, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04 }}
                    whileHover={{
                      backgroundColor: "rgba(255, 255, 255, 0.03)",
                    }}
                    className="group flex items-center justify-between p-4 transition-all duration-200"
                  >
                    <div className="flex items-center gap-4">


                      {/* Avatar Placeholder */}
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-all">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-white font-medium group-hover:text-rose-400 transition-colors">
                            @{user.username}
                          </span>

                        </div>
                        <div className="flex items-center gap-3 mt-1">

                        </div>
                      </div>
                    </div>

                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.04 + 0.1 }}
                      className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/5 group-hover:bg-white/10 transition-all"
                    >
                      <svg
                        className="w-4 h-4 text-rose-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      <span className="text-sm text-white font-semibold">
                        {user.likes_count.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-300">likes</span>
                    </motion.div>
                  </motion.div>
                ))}

                {(!data?.insights?.most_liked_users ||
                  data.insights.most_liked_users.length === 0) && (
                  <div className="flex flex-col items-center justify-center py-16 px-4">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                      <svg
                        className="w-8 h-8 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-400 text-sm font-medium">
                      No data available
                    </p>
                    <p className="text-gray-600 text-xs mt-1">
                      Check back later for insights
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
