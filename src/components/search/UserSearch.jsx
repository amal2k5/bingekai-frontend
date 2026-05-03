import { useState, useEffect } from "react";
import { searchUsers, getSuggestedUsers } from "../../services/userService";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function UserSearch() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSuggestions();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        fetchSearch();
      } else {
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const fetchSuggestions = async () => {
    try {
      const data = await getSuggestedUsers();
      setSuggestions(data || []);
    } catch (err) {
      setSuggestions([]);
    }
  };

  const fetchSearch = async () => {
    try {
      const data = await searchUsers(query);
      setSearchResults(data?.slice(0, 8) || []);
    } catch (err) {
      setSearchResults([]);
    }
  };

  const handleUserClick = (id) => {
    navigate(`/users/${id}`);
  };

  // Premium User Card Component
  const UserCard = ({ user }) => (
    <motion.div
      whileHover={{ x: 5, backgroundColor: "rgba(16, 185, 129, 0.05)" }}
      onClick={() => handleUserClick(user.id)}
      className="flex items-center gap-4 p-4 cursor-pointer border-b border-zinc-800/50 last:border-0 transition-all"
    >
      <div className="relative">
        <img
          src={user.profile_picture || "/default-avatar.png"}
          alt={user.username}
          className="w-12 h-12 rounded-full object-cover border-2 border-zinc-800 group-hover:border-emerald-500"
        />
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-black rounded-full"></div>
      </div>
      <div className="flex-1">
        <div className="text-white font-bold tracking-tight">
          @{user.username}
        </div>
        <div className="text-zinc-500 text-xs uppercase tracking-widest font-medium">
          {user.full_name || "Cinephile"}
        </div>
      </div>
      <svg
        className="w-5 h-5 text-zinc-700 group-hover:text-emerald-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </motion.div>
  );

  return (
    <div className="w-full space-y-8">
      {/* Search Input Section */}
      <div className="relative group">
        <div className="absolute -inset-1 "></div>
        <div className="relative flex items-center bg-[#0a0a0a] rounded-xl border border-zinc-800 focus-within:border-emerald-500 transition-all">
          <div className="pl-5">
            <svg
              className="w-5 h-5 text-zinc-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent py-4 px-4 text-white focus:outline-none placeholder:text-zinc-600 font-medium"
          />
        </div>
      </div>

      {/* Results / Suggestions Container */}
      <div className="w-full max-w-3xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {query.trim() ? (
            <motion.div
              key="search-active"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: "circOut" }}
              className="space-y-8"
            >
              {/* Editorial Header */}
              <div className="flex flex-col gap-1 px-1">
                <div className="flex items-center gap-3">
                  <span className="h-[1px] w-6 bg-emerald-500/50"></span>
                </div>
                <div className="flex items-baseline justify-between mt-2">
                  <h2 className="text-zinc-100 text-xl font-light tracking-tight ">
                    Results for{" "}
                    <span className="text-emerald-500">"{query}"</span>
                  </h2>
                  <span className=" text-[11px] text-white font-light uppercase tracking-wider">
                    {searchResults.length} searches found
                  </span>
                </div>
              </div>

              {/* Search Results: Linear "Scan" View */}
              <div className="space-y-3">
                {searchResults.length > 0 ? (
                  searchResults.map((user) => (
                    <motion.div
                      key={user.id}
                      onClick={() => handleUserClick(user.id)}
                      whileHover={{ x: 4 }}
                      className="group relative flex items-center justify-between p-4 bg-[#050505] border border-zinc-900 rounded-lg cursor-pointer transition-all duration-500 hover:border-zinc-700/50"
                    >
                      <div className="flex items-center gap-5">
                        {/* Dynamic Avatar */}
                        <div className="relative h-12 w-12 flex-shrink-0">
                          {user.profile_picture ? (
                            <img
                              src={user.profile_picture}
                              className="h-full w-full rounded-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                            />
                          ) : (
                            <div className="h-full w-full rounded-full border border-zinc-800 bg-black flex items-center justify-center transition-all duration-500 group-hover:border-emerald-500/30">
                              <span className="text-zinc-600 text-sm font-light uppercase tracking-widest group-hover:text-emerald-400 transition-colors">
                                {user.username?.charAt(0)}
                              </span>
                            </div>
                          )}
                          <div className="absolute -inset-1 rounded-full border border-emerald-500/0 group-hover:border-emerald-500/10 transition-all duration-700 scale-90 group-hover:scale-100" />
                        </div>

                        <div>
                          <p className="text-zinc-200 text-sm font-light tracking-wide group-hover:text-white transition-colors">
                            {user.username}
                          </p>
                          <p className="text-zinc-600 text-[10px] uppercase tracking-[0.15em] mt-0.5 transition-colors group-hover:text-zinc-400">
                            {user.full_name}
                          </p>
                        </div>
                      </div>

                      {/* Micro-Interaction Indicator */}
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-full border border-zinc-900 group-hover:border-emerald-500/50 group-hover:bg-emerald-500/5 transition-all">
                          <svg
                            className="w-3.5 h-3.5 text-zinc-700 group-hover:text-emerald-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                          </svg>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="py-32 flex flex-col items-center justify-center border border-dashed border-zinc-900 rounded-2xl">
                    <p className="text-zinc-700 text-[10px] font-medium uppercase tracking-[0.4em] italic">
                      No archived matches found
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="suggestions-idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-12"
            >
              {/* Section Header with Gradient Line */}
              <div className="flex items-center gap-6">
                {/* Left Line */}
                <div className="h-[1px] flex-1 bg-gradient-to-l from-gray-600 to-transparent" />

                {/* Centered Text */}
                <h3 className="text-zinc-400 text-[10px] font-medium uppercase tracking-[0.5em] whitespace-nowrap">
                  Recommended Connections
                </h3>

                {/* Right Line */}
                <div className="h-[1px] flex-1 bg-gradient-to-r from-gray-600 to-transparent" />
              </div>

              {/* Suggestion Discovery Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {suggestions.map((user) => (
                  <motion.div
                    key={user.id}
                    onClick={() => handleUserClick(user.id)}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="group relative p-6 bg-zinc-900/40 border border-zinc-800/50 rounded-2xl cursor-pointer overflow-hidden transition-all duration-500 hover:border-emerald-500/30 hover:bg-zinc-900/60"
                  >
                    {/* Decorative Background Glow on Hover */}
                    <div className="absolute -inset-px bg-gradient-to-b from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative z-10 flex flex-col items-center text-center">
                      {/* Avatar Section */}
                      <div className="relative mb-5">
                        <div className="h-20 w-20 p-1 rounded-full border border-zinc-800 group-hover:border-emerald-500/40 transition-colors duration-700">
                          {user.profile_picture ? (
                            <img
                              src={user.profile_picture}
                              className="h-full w-full rounded-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 brightness-75 group-hover:brightness-100"
                            />
                          ) : (
                            <div className="h-full w-full rounded-full bg-zinc-950 flex items-center justify-center">
                              <span className="text-zinc-500 text-xl font-extralight tracking-tighter group-hover:text-emerald-400">
                                {user.username?.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Status Indicator with Ping Animation */}
                        <div className="absolute bottom-1 right-1">
                          <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500/40 opacity-0 group-hover:opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 border-2 border-zinc-950 bg-zinc-800 group-hover:bg-emerald-500 transition-colors"></span>
                          </span>
                        </div>
                      </div>

                      {/* Text Content */}
                      <div className="space-y-1.5 w-full">
                        <h4 className="text-zinc-100 text-[15px] font-medium tracking-tight group-hover:text-white transition-colors">
                          {user.username}
                        </h4>
                        <p className="text-zinc-500 text-[10px] font-medium uppercase tracking-[0.2em] group-hover:text-zinc-400 transition-colors">
                          {user.full_name}
                        </p>
                      </div>

                      {/* Hover Reveal Action */}
                      <div className="mt-5 pt-4 border-t border-zinc-600/50 w-full opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                        <span className="text-emerald-400 text-[10px] font-semibold uppercase tracking-widest flex items-center justify-center gap-2">
                          View Profile
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M17 8l4 4m0 0l-4 4m4-4H3"
                            ></path>
                          </svg>
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Cinematic Subtle Footer */}
              <div className="flex justify-center pt-16">
                <div className="relative h-px w-24 bg-zinc-900">
                  <motion.div
                    animate={{ x: [0, 96, 0] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute top-0 h-px w-8 bg-emerald-500/40"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
