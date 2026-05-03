import { useEffect, useState } from "react";
import {
  getUserWatchlists,
  createWatchlist,
  addToWatchlist,
  removeFromWatchlist,
} from "../../services/watchlistService";
import toast from "react-hot-toast";

const WatchlistModal = ({ isOpen, onClose, movie, user }) => {
  const [watchlists, setWatchlists] = useState([]);
  const [newName, setNewName] = useState("");
  const [existingMap, setExistingMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (isOpen && user) fetchWatchlists();
  }, [isOpen]);

  const fetchWatchlists = async () => {
    try {
      const res = await getUserWatchlists();
      setWatchlists(res.data);
      const map = {};
      res.data.forEach((list) => {
        list.items.forEach((item) => {
          if (item.movie_id === movie.id) map[list.id] = item.id;
        });
      });
      setExistingMap(map);
    } catch {
      toast.error("Failed to load watchlists");
    }
  };

  const toggleMovie = async (listId) => {
    try {
      if (existingMap[listId]) {
        await removeFromWatchlist({ list_id: listId, movie_id: movie.id });
        setExistingMap((prev) => {
          const updated = { ...prev };
          delete updated[listId];
          return updated;
        });
        toast.success("Removed from watchlist");
      } else {
        const res = await addToWatchlist({ collection_id: listId, movie_id: movie.id });
        setExistingMap((prev) => ({ ...prev, [listId]: res.data?.id || true }));
        toast.success("Added to watchlist");
      }
    } catch {
      toast.error("Action failed");
    }
  };

  const handleCreate = async () => {
    if (!newName.trim()) return toast.error("Enter a folder name");
    try {
      setCreating(true);
      const res = await createWatchlist({ name: newName });
      await addToWatchlist({ collection_id: res.data.id, movie_id: movie.id });
      setWatchlists((prev) => [...prev, res.data]);
      setExistingMap((prev) => ({ ...prev, [res.data.id]: true }));
      setNewName("");
      toast.success("Created & added!");
    } catch {
      toast.error("Failed to create");
    } finally {
      setCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md transition-all duration-300"
      onClick={onClose}
    >
      <div
        className="relative w-[500px] max-h-[90vh] bg-gradient-to-br from-neutral-900 via-black to-neutral-900 border border-green-500/30 rounded-2xl shadow-2xl shadow-green-500/10 animate-slide-up overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Section */}
        <div className="relative px-6 pt-6 pb-4 border-b border-green-500/20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                Manage Watchlist
              </h2>
              <p className="text-white/50 text-sm mt-1">Organize your movie collection</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/40 hover:text-green-500 transition-all duration-300 text-3xl leading-none hover:rotate-90 hover:scale-110"
            >
              ×
            </button>
          </div>
        </div>

        {/* Movie Info Card */}
        <div className="px-6 pt-5">
          <div className="group relative bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-green-500/30 transition-all duration-500">
            <div className="flex items-center gap-4 p-4">
              <div className="relative">
                <img
                  src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                  alt={movie.title}
                  className="w-16 h-24 object-cover rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg"></div>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold text-lg leading-tight">{movie.title}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Watchlists Section */}
        <div className="px-6 pt-5">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-white/80 text-sm font-semibold uppercase tracking-wider">
              Your Collections
            </h4>
          </div>
          
          <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1 custom-scroll">
            {watchlists.length === 0 && (
              <div className="text-center py-8 bg-white/5 rounded-lg">
                <p className="text-white/30 text-sm">No collections yet</p>
                <p className="text-white/20 text-xs mt-1">Create your first watchlist below</p>
              </div>
            )}
            
            {watchlists.map((list) => {
              const isAdded = !!existingMap[list.id];
              return (
                <div
                  key={list.id}
                  className={`group relative flex items-center justify-between p-3 rounded-xl transition-all duration-300 ${
                    isAdded
                      ? "bg-gradient-to-r from-green-500/15 to-green-500/5 border border-green-500/30"
                      : "bg-white/5 border border-white/10 hover:bg-white/10"
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${isAdded ? "bg-green-500 animate-pulse" : "bg-white/30"}`}></div>
                      <span className={`font-medium ${isAdded ? "text-green-400" : "text-white/90"}`}>
                        {list.name}
                      </span>
                    </div>
                    <p className="text-white/30 text-xs mt-1">
                      {list.items?.length || 0} movies
                    </p>
                  </div>
                  
                  {isAdded ? (
                    <button
                      onClick={() => toggleMovie(list.id)}
                      className="relative overflow-hidden px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/30 transition-all duration-300 group/btn"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Remove
                      </span>
                    </button>
                  ) : (
                    <button
                      onClick={() => toggleMovie(list.id)}
                      className="relative overflow-hidden px-4 py-2 rounded-lg bg-green-500 text-black font-medium text-sm hover:bg-green-400 transition-all duration-300 hover:scale-105 "
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add
                      </span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Create New Section */}
        <div className="px-6 pt-5 pb-6">
          <div className="border-t border-white/10 pt-4">
            <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">
              Create a New Collection
            </label>
            <div className="flex gap-3">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                placeholder="enter the folder name"
                className="flex-1 bg-black/50 border border-white/20 text-white text-sm px-4 py-2.5 rounded-lg placeholder:text-white/30 focus:outline-none focus:border-green-500/50 transition-all duration-300"
              />
              <button
                onClick={handleCreate}
                disabled={creating}
                className="relative overflow-hidden bg-gradient-to-r from-green-500 to-green-500 hover:from-green-500 hover:to-green-400 disabled:opacity-50 text-black font-semibold px-6 py-2.5 rounded-lg  "
              >
                {creating ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                    <span>Creating...</span>
                  </div>
                ) : (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .custom-scroll::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scroll::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        
        .custom-scroll::-webkit-scrollbar-thumb {
          background: rgba(34, 197, 94, 0.4);
          border-radius: 10px;
        }
        
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(34, 197, 94, 0.8);
        }
        
        /* Smooth hover effects */
        .group:hover .group-hover\\:scale-105 {
          transform: scale(1.05);
        }
      `}} />
    </div>
  );
};

export default WatchlistModal;