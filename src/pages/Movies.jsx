import { useEffect, useState, useRef } from "react";
import axios from "axios";
import MovieCard from "../components/MovieCard";
import AddToListModal from "../components/ListModal";
import { Search, Star, Loader2, X } from "lucide-react";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);

  // ✅ Autocomplete states
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const searchRef = useRef(null);
  const debounceTimer = useRef(null);

  const fetchMovies = async (searchQuery = "") => {
    try {
      setLoading(true);
      const endpoint = searchQuery
        ? `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(searchQuery)}`
        : `${BASE_URL}/movie/popular?api_key=${API_KEY}`;

      const res = await axios.get(endpoint);
      setMovies(res.data.results || []);
    } catch (err) {
      console.error("Fetch error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch autocomplete suggestions
  const fetchSuggestions = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      setLoadingSuggestions(true);
      const res = await axios.get(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(searchQuery)}`
      );
      setSuggestions(res.data.results.slice(0, 5)); // top 5
      setShowSuggestions(true);
    } catch (err) {
      console.error("Autocomplete error:", err);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // ✅ Debounced input handler
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);

    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new timer (300ms)
    debounceTimer.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
  };

  // ✅ Select suggestion
const selectSuggestion = (movie) => {
  setQuery(movie.title);
  setShowSuggestions(false);
  setMovies([movie]); // ✅ show only this movie
};

  // ✅ Keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0) {
        selectSuggestion(suggestions[selectedIndex]);
      } else {
        handleSearch(e);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  // ✅ Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    fetchMovies(query.trim() ? query : "");
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white font-sans selection:bg-green-500/30">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 pt-24 pb-24">

        {/* Search Bar with Autocomplete */}
<div className="flex justify-center px-4 mb-20">
  <form onSubmit={handleSearch} className="relative w-full max-w-xl z-50" ref={searchRef}>
    
    <div className="relative flex items-center bg-zinc-900/60 backdrop-blur-xl border border-white/5 focus-within:border-green-500/30 rounded-full px-2 py-1.5 transition-all duration-300 shadow-2xl z-50">
      <input
        type="text"
        placeholder="Search movies..."
        className="flex-1 bg-transparent py-2.5 pl-6 pr-2 focus:outline-none text-zinc-100 placeholder:text-zinc-500 text-sm md:text-base"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        autoComplete="off"
      />

      {query && (
        <button
          type="button"
          onClick={() => {
            setQuery("");
            setSuggestions([]);
            setShowSuggestions(false);
          }}
          className="p-2 text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <X size={16} />
        </button>
      )}

      <button
        type="submit"
        className="flex items-center justify-center p-3 bg-green-500 hover:bg-green-400 text-black rounded-full transition-all active:scale-90 shadow-lg shadow-green-500/20"
      >
        <Search size={18} strokeWidth={2.5} />
      </button>
    </div>

    {/* ✅ Premium Autocomplete Dropdown with Blur + Vignette */}
    {showSuggestions && suggestions.length > 0 && (
      <>
        {/* Backdrop overlay with blur and vignette - lower z-index */}
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in duration-200"
          onClick={() => setShowSuggestions(false)}
        />
        
        {/* Dropdown container - higher z-index than backdrop but below search bar */}
        <div className="absolute top-full left-0 right-0 mt-2 bg-gradient-to-b from-zinc-900/95 via-zinc-900/98 to-black/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-45 animate-in fade-in slide-in-from-top-2 duration-300">
          {/* Vignette overlay */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-black/20 via-transparent to-black/40" />
          
          {/* Content */}
          <div className="relative z-10 max-h-96 overflow-y-auto">
            {loadingSuggestions ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 text-green-500 animate-spin" />
              </div>
            ) : (
              suggestions.map((movie, index) => (
                <button
                  key={movie.id}
                  type="button"
                  onClick={() => selectSuggestion(movie)}
                  className={`w-full flex items-center gap-4 px-4 py-3 hover:bg-white/10 transition-all duration-200 text-left ${
                    index === selectedIndex ? "bg-white/15" : ""
                  }`}
                >
                  {movie.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                      alt={movie.title}
                      className="w-10 h-14 object-cover rounded-lg shadow-md"
                    />
                  ) : (
                    <div className="w-10 h-14 bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-600">
                      🎬
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate">
                      {movie.title}
                    </p>
                    <p className="text-xs text-zinc-400">
                      {movie.release_date?.split("-")[0] || "N/A"}
                    </p>
                  </div>

                  {movie.vote_average > 0 && (
                    <div className="flex items-center gap-1 text-xs text-zinc-300">
                      <Star size={12} className="text-yellow-500 fill-yellow-500" />
                      {movie.vote_average.toFixed(1)}
                    </div>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      </>
    )}
  </form>
</div>

        {/* Movie Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <Loader2 className="w-10 h-10 text-green-500 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-12">
            {movies.length > 0 ? (
              movies.map((movie) => (
                <div key={movie.id} className="group flex flex-col">
                  <div className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-white/5 bg-zinc-900 transition-all duration-500 group-hover:border-green-500/40 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)]">
                    <MovieCard movie={movie} onAddToList={() => setSelectedMovie(movie)} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/[0.05] group-hover:border-green-500/20 transition-all duration-500 space-y-2 px-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-medium text-zinc-500 tracking-[0.2em] uppercase">
                        {movie.release_date?.split("-")[0] || "2026"}
                      </span>
                      <div className="flex items-center gap-1.5 bg-white/[0.03] border border-white/5 px-2 py-0.5 rounded-md">
                        <Star size={10} className="text-yellow-500 fill-yellow-500" />
                        <span className="text-[10px] font-bold text-zinc-300 tracking-tight">
                          {movie.vote_average ? movie.vote_average.toFixed(1) : "0.0"}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-[15px] text-white leading-snug line-clamp-1 group-hover:text-yellow-500 transition-colors duration-300 tracking-wide">
                      {movie.title}
                    </h3>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-24 text-center border border-dashed border-zinc-800 rounded-3xl">
                <p className="text-zinc-600 font-medium">No results found for your search.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {selectedMovie && (
        <AddToListModal movieId={selectedMovie.id} onClose={() => setSelectedMovie(null)} />
      )}
    </div>
  );
}