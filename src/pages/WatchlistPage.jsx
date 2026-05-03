import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, X, Clapperboard, Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUserWatchlists, removeFromWatchlist, deleteWatchlist } from "../services/watchlistService";
import { getMovieDetails } from "../api/movieApi";

const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";




export default function WatchlistPage() {
  const [collections, setCollections] = useState([]);
  const [selected, setSelected] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const res = await getUserWatchlists();
      if (res.data?.length) {
        setCollections(res.data);
        const first = res.data[0];
        setSelected(first);
        await loadMovies(first);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMovies = async (collection) => {
    if (!collection?.items?.length) {
      setMovies([]);
      return;
    }
    
    const detailed = await Promise.all(
      collection.items.map(async (item) => {
        try {
          const details = await getMovieDetails(item.movie_id);
          return {
            ...item,
            title: details.movie?.title || "Unknown",
            poster_path: details.movie?.poster_path
          };
        } catch {
          return { ...item, title: "Error", poster_path: null };
        }
      })
    );
    setMovies(detailed);
  };

  const handleSelect = async (c) => {
    if (selected?.id === c.id) return;
    setSelected(c);
    await loadMovies(c);
  };

  const handleRemove = async (e, movieId) => {
    e.stopPropagation();
    await removeFromWatchlist({ list_id: selected.id, movie_id: movieId });
    setMovies(prev => prev.filter(m => m.movie_id !== movieId));
  };

  const handleDeleteList = async () => {
    await deleteWatchlist(deleteTarget.id);
    const newCollections = collections.filter(c => c.id !== deleteTarget.id);
    setCollections(newCollections);
    if (newCollections.length) {
      setSelected(newCollections[0]);
      await loadMovies(newCollections[0]);
    } else {
      setSelected(null);
      setMovies([]);
    }
    setDeleteTarget(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <Clapperboard className="text-emerald-500 w-10 h-10" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-[1400px] mx-auto pt-28 px-6 pb-20">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-5xl font-light tracking-tighter mb-2">
              THE <span className="text-emerald-500 font-medium">VAULT</span>
            </h1>
            <p className="text-zinc-600 text-[11px] tracking-[0.3em] uppercase">Your Personal Archive</p>
          </motion.div>
        </div>

        {/* Collection Chips */}
        {collections.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {collections.map(c => (
              <div key={c.id} className="relative group">
                <button
                  onClick={() => handleSelect(c)}
                  className={`px-6 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-wider border transition-all duration-300 ${
                    selected?.id === c.id
                      ? "bg-white text-black border-white"
                      : "bg-transparent text-zinc-500 border-zinc-800 hover:border-zinc-600"
                  }`}
                >
                  {c.name}
                </button>
                <button
                  onClick={() => setDeleteTarget({ id: c.id, name: c.name })}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-black border border-zinc-700 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:border-red-500 group"
                >
                  <X size={10} className="text-zinc-500 group-hover:text-red-500" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Movie Grid */}
<AnimatePresence mode="wait">
  {!selected ? (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col items-center justify-center py-40 border-2 border-dashed border-zinc-800/50 rounded-3xl"
    >
      <div className="relative mb-6">
        <Bookmark className="w-12 h-12 text-zinc-700" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
      </div>
      <h3 className="text-zinc-400 font-semibold tracking-tight">Select a Collection</h3>
      <p className="text-zinc-600 text-xs mt-1">Choose a list on the left to view your saved films.</p>
    </motion.div>
  ) : movies.length === 0 ? (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="text-center py-40 bg-zinc-900/20 rounded-3xl border border-zinc-800/50"
    >
      <p className="text-zinc-500 text-sm font-medium tracking-widest uppercase">Collection Empty</p>
      <button className="mt-4 text-xs text-emerald-500 hover:text-emerald-400 transition-colors">
        + Add your first movie
      </button>
    </motion.div>
  ) : (
    <motion.div
      key={selected.id}
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } }
      }}
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
    >
      {movies.map((movie) => (
        <motion.div
          key={movie.id}
          variants={{
            hidden: { opacity: 0, y: 20, scale: 0.9 },
            visible: { opacity: 1, y: 0, scale: 1 }
          }}
          whileHover={{ y: -8, transition: { duration: 0.2 } }}
          className="group relative cursor-pointer"
          onClick={() => navigate(`/movie/${movie.movie_id}`)}
        >
          <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-zinc-900 shadow-2xl transition-all duration-500 ring-1 ring-white/5 group-hover:ring-emerald-500/50">
            
            {/* Poster with subtle zoom */}
            <img
              src={movie.poster_path ? `${IMAGE_BASE}${movie.poster_path}` : "/placeholder.jpg"}
              alt={movie.title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />

            {/* Smart Overlay - Always visible at bottom, fades in fully on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Remove Button - Redesigned to be more "Glassy" */}
            <button 
              onClick={(e) => { e.stopPropagation(); handleRemove(e, movie.movie_id); }}
              className="absolute top-3 right-3 p-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-500 group/btn"
            >
              <Trash2 size={14} className="text-white/70 group-hover/btn:text-white" />
            </button>

            {/* Bottom Info Section */}
            <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <p className="text-[11px] font-bold text-white line-clamp-1 mb-1 drop-shadow-md">
                {movie.title}
              </p>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                 <span className="text-[9px] text-zinc-400 font-medium">{movie.release_date?.split('-')[0]}</span>
              </div>
            </div>

          </div>
          
          {/* External Shadow Effect */}
          <div className="absolute inset-x-4 -bottom-2 h-4 bg-emerald-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </motion.div>
      ))}
    </motion.div>
  )}
</AnimatePresence>
      </div>

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-black/95 flex items-center justify-center z-50"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              className="bg-black border border-white/10 rounded-2xl p-8 w-full max-w-sm text-center"
            >
              <h2 className="text-lg font-light text-white mb-2">Delete "{deleteTarget.name}"?</h2>
              <p className="text-zinc-500 text-xs mb-8">This action cannot be undone</p>
              <div className="flex gap-3">
                <button 
                  onClick={handleDeleteList} 
                  className="flex-1 py-3 bg-red-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition"
                >
                  Delete
                </button>
                <button 
                  onClick={() => setDeleteTarget(null)} 
                  className="flex-1 py-3 bg-white/5 text-zinc-400 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}