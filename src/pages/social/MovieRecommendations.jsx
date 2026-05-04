import { useEffect, useState, useContext, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Info,
  Plus,
  Star,
  Film,
  RefreshCw,
  Cpu,
  Zap,
  AlertCircle,
  
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import AddToListModal from "../../components/ListModal";
console.log("ENV:", import.meta.env.VITE_API_URL);
import { motion } from "framer-motion";
import NewUserEmptyState from "./NewUserRecommend";




const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const DJANGO_API = `${import.meta.env.VITE_API_URL}/api`;
const tmdbCache = new Map();
const inFlightRequests = new Map();

function dedupedFetch(url, options) {
  const key = url + (options?.body || "");
  if (inFlightRequests.has(key)) return inFlightRequests.get(key);
  const promise = fetch(url, options).finally(() =>
    inFlightRequests.delete(key)
  );
  inFlightRequests.set(key, promise);
  return promise;
}

async function fetchMovieDetails(movieId) {
  if (tmdbCache.has(movieId)) return tmdbCache.get(movieId);
  try {
    const res = await dedupedFetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=genres`
    );
    if (!res.ok) return null;
    const data = await res.json();
    const result = {
      id: data.id,
      title: data.title || "Unknown Title",
      poster_path: data.poster_path,
      vote_average: data.vote_average?.toFixed(1),
      release_date: data.release_date?.split("-")[0],
      genres: data.genres?.map((g) => g.name) || [],
    };
    tmdbCache.set(movieId, result);
    return result;
  } catch {
    return null;
  }
}

async function hydrateMovies(movieIds) {
  const details = await Promise.all(movieIds.map(fetchMovieDetails));
  return details.filter(Boolean);
}

function extractMovieIds(movies) {
  return (movies || []).map((m) =>
    typeof m === "object" ? (m.movie_id ?? m.id) : m
  );
}

const STAGES = [
  { icon: Cpu, label: "Fetching your ratings", detail: "Reading your taste profile" },
  { icon: Zap, label: "Computing vector embeddings", detail: "Running sentence transformer model" },
  { icon: Film, label: "Scoring candidates", detail: "Cosine similarity across movies" },
  { icon: Star, label: "Ranking results", detail: "Personalizing your feed" },
];

function LoadingScreen({ pollCount }) {
  return (
    <div className="w-full">
      {/* Header skeleton */}
      <div className="flex justify-between items-center pt-20 md:pt-11 mb-4">
        <div className="w-24" />
        <div className="h-8 w-48 bg-zinc-900 rounded-lg animate-pulse" />
        <div className="w-24 flex justify-end">
          <div className="h-7 w-16 bg-zinc-900 rounded-full animate-pulse" />
        </div>
      </div>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent mb-10" />

      {/* Movie card skeletons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col rounded-xl overflow-hidden border border-white/5"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            {/* Poster */}
            <div className="aspect-[2/3] bg-zinc-900 animate-pulse" />
            {/* Info */}
            <div className="p-3 space-y-2 bg-zinc-950/40">
              <div className="h-3 bg-zinc-800 rounded animate-pulse w-4/5" />
              <div className="h-2.5 bg-zinc-800/60 rounded animate-pulse w-1/3" />
              <div className="flex gap-1 pt-0.5">
                <div className="h-4 w-12 bg-zinc-800/40 rounded-full animate-pulse" />
                <div className="h-4 w-10 bg-zinc-800/40 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
function ErrorScreen({ message, onRetry }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative overflow-hidden rounded-2xl w-full max-w-md mx-4"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-black to-[#050505]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.06),transparent_70%)]" />
        <div className="relative text-center py-12 px-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
            className="relative w-20 h-20 mx-auto mb-6"
          >
            <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
            <div className="absolute inset-0 rounded-full bg-red-500/10 animate-pulse" />
            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-red-500/15 to-red-600/5 border border-red-500/30 flex items-center justify-center backdrop-blur-sm shadow-lg shadow-red-500/10">
              <AlertCircle className="w-8 h-8 text-red-400" strokeWidth={1.5} />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold text-white mb-2">Loading Failed</h3>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-px bg-gradient-to-r from-transparent to-emerald-500/40" />
              <div className="w-1 h-1 rounded-full bg-emerald-400/80 shadow-lg shadow-emerald-500/30" />
              <div className="w-10 h-px bg-gradient-to-l from-transparent to-emerald-500/40" />
            </div>
          </motion.div>
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRetry}
            className="relative group inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-sm font-medium shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-300"
          >
            <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
            <span>Try Again</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}


function EmptyScreen({ onGenerate }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] w-full px-6">
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-white/10 flex items-center justify-center mb-6">
        <Film size={24} strokeWidth={1.5} className="text-emerald-400" />
      </div>
      <p className="text-white text-base font-medium mb-2">No recommendations yet</p>
      <p className="text-zinc-500 text-sm text-center max-w-xs mb-8 leading-relaxed">
        Rate a few movies and we'll build a personalized feed just for you
      </p>
      <button
        onClick={onGenerate}
        className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
      >
        Generate recommendations
      </button>
    </div>
  );
}

function MovieCard({ movie, onAddClick, index }) {
  const navigate = useNavigate();
  if (!movie) return null;

  const posterUrl = movie.poster_path ? `${IMAGE_BASE}${movie.poster_path}` : null;
  const displayGenres = movie.genres?.slice(0, 2) || [];

  return (
    <div
      className="group relative flex flex-col bg-zinc-950/40 rounded-xl overflow-hidden border border-white/5 hover:border-green-500/25 transition-all duration-500"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-zinc-900">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-900">
            <Film size={32} className="text-zinc-700" />
          </div>
        )}
        <div className="absolute top-2 left-2 z-10">
          <div className="flex items-center gap-1 bg-black/80 backdrop-blur-sm px-1.5 py-0.5 rounded-md border border-white/8">
            <Star size={8} className="fill-green-400 text-green-400" />
            <span className="text-[10px] font-medium text-white/90">{movie.vote_average || "—"}</span>
          </div>
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/95 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-between p-3">
          <div className="flex justify-end">
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onAddClick(); }}
              className="p-1.5 bg-black/60 backdrop-blur-sm border border-white/10 rounded-full text-white/70 hover:bg-green-500 hover:text-black hover:border-green-500 active:scale-95 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400"
            >
              <Plus size={12} strokeWidth={2} />
            </button>
          </div>
          <div className="flex justify-center">
            <button
              onClick={() => navigate(`/movie/${movie.id}`)}
              className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[9px] font-medium tracking-wide hover:bg-green-500 hover:text-black opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500"
            >
              <Info size={10} strokeWidth={2} />
              View details
            </button>
          </div>
        </div>
      </div>
      <div className="p-3 space-y-1.5">
        <h3 className="text-[13px] font-medium text-white/90 group-hover:text-green-400 transition-colors duration-300 line-clamp-1">
          {movie.title}
        </h3>
        <p className="text-[10px] text-zinc-600">{movie.release_date || "—"}</p>
        {displayGenres.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-0.5">
            {displayGenres.map((genre) => (
              <span key={genre} className="px-1.5 py-0.5 bg-green-500/8 border border-green-500/15 text-green-500/70 text-[9px] rounded-full">
                {genre}
              </span>
            ))}
            {movie.genres?.length > 2 && (
              <span className="px-1.5 py-0.5 bg-white/4 border border-white/8 text-zinc-500 text-[9px] rounded-full">
                +{movie.genres.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Container({ children }) {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-green-500/20 pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-6 md:px-8">{children}</div>
    </div>
  );
}

export default function Recommendations() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [stats, setStats] = useState({ ratings: 0, candidates: 0, method: "" });
  const [pollCount, setPollCount] = useState(0);
  const [hasActivity, setHasActivity] = useState(false);
  const [activityChecked, setActivityChecked] = useState(false);

  const { token } = useContext(AuthContext);
  const abortRef = useRef(null);

const checkUserActivity = useCallback(async (signal) => {
  try {
    // Check if signal is already aborted
    if (signal.aborted) {
      console.log("Activity check aborted before start");
      return false;
    }
    
    const res = await fetch(`${DJANGO_API}/recommendations/activity/check/`, {
      headers: { Authorization: `Bearer ${token}` },
      signal,
    });
    
    if (res.ok) {
      const data = await res.json();
      setHasActivity(data.has_activity || false);
      return data.has_activity;
    }
    return false;
  } catch (err) {
    // Don't log aborted errors as they're expected
    if (err.name !== "AbortError") {
      console.error("Failed to check activity:", err);
    }
    return false;
  }
}, [token]);

const pollUntilDone = useCallback(async (taskId, signal) => {
  let attempt = 0;
  const maxAttempts = 60;

  while (attempt < maxAttempts) {
    if (signal.aborted) throw new Error("Request cancelled");
    await new Promise((r) => setTimeout(r, 2000));
    attempt++;
    setPollCount(attempt * 2);

    const res = await fetch(`${DJANGO_API}/recommendations/async/status/${taskId}/`, {
      headers: { Authorization: `Bearer ${token}` },
      signal,
    });
    if (!res.ok) throw new Error(`Status check failed: ${res.status}`);

    const data = await res.json();
    console.log("results response:", JSON.stringify(data));

    if (data.status === "SUCCESS") {
      // If success but no movies, still return (will show empty state)
      return;
    }
    if (data.status === "FAILURE") {
      // Don't throw error for "no_ratings" - just return
      if (data.error && data.error.includes("no_ratings")) {
        console.log("User has no ratings, showing empty state");
        return;
      }
      throw new Error(data.error || "Task failed");
    }
  }

  throw new Error("Recommendations took too long. Please try again.");
}, [token]);

  const loadSavedResults = useCallback(async (signal) => {
    const res = await fetch(`${DJANGO_API}/recommendations/async/results/`, {
      headers: { Authorization: `Bearer ${token}` },
      signal,
    });
    if (!res.ok) throw new Error(`Failed to fetch results: ${res.status}`);

    const data = await res.json();

    if (data.status === "pending" || data.type === "pending") return false;
    if (data.type === "trending") {
      setMovies(data.movies || []);
      setStats({
        ratings: 0,
        candidates: data.movies?.length || 0,
        method: "trending",
      });
      return true;
    }

    const ids = extractMovieIds(data.movies);
    if (!ids.length) return false;

    const hydrated = await hydrateMovies(ids);
    setMovies(hydrated);
    setStats({
      ratings: data.ratings_count || 0,
      candidates: data.candidates_count || 0,
      method: data.method || "ai_similarity",
    });
    return true;
  }, [token]);

  const triggerAndPoll = useCallback(async (signal) => {
    setPollCount(0);

    const triggerRes = await fetch(`${DJANGO_API}/recommendations/async/trigger/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      signal,
    });

    if (!triggerRes.ok) {
      const err = await triggerRes.json().catch(() => ({}));
      throw new Error(err.detail || `Trigger failed: ${triggerRes.status}`);
    }

    const { task_id } = await triggerRes.json();
    await pollUntilDone(task_id, signal);
    await loadSavedResults(signal);
  }, [token, pollUntilDone, loadSavedResults]);

const init = useCallback(async () => {
  if (abortRef.current) abortRef.current.abort();
  const controller = new AbortController();
  abortRef.current = controller;

  setLoading(true);
  setError(null);

  try {
    const activity = await checkUserActivity(controller.signal);
    setActivityChecked(true);

    if (!activity) {

      setMovies([]);
      setLoading(false);
      return;
    }

    const hasResults = await loadSavedResults(controller.signal);
    if (hasResults) return;
    await triggerAndPoll(controller.signal);
  } catch (err) {
    if (err.name === "AbortError" || err.message === "Request cancelled") return;
    
    if (!activityChecked) {
      setActivityChecked(true);
      setHasActivity(false);
      setMovies([]);
      return;
    }

    setError(err.message || "Failed to load recommendations");
    setMovies([]);
  } finally {
    setLoading(false);
    abortRef.current = null;
  }
}, [loadSavedResults, triggerAndPoll, checkUserActivity, activityChecked]);

  const forceRefresh = useCallback(async () => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    setMovies([]);

    try {
      await triggerAndPoll(controller.signal);
    } catch (err) {
      if (err.name === "AbortError" || err.message === "Request cancelled") return;
      setError(err.message || "Failed to load recommendations");
      setMovies([]);
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }, [triggerAndPoll]);

  useEffect(() => {
    if (!token) {
      setError("Please login to see recommendations");
      setLoading(false);
      return;
    }
    init();
    return () => abortRef.current?.abort();
  }, [init, token]);

  const handleOpenModal = (movieId) => {
    setSelectedMovieId(movieId);
    setIsModalOpen(true);
  };


  if (loading && !activityChecked) return <Container><LoadingScreen pollCount={pollCount} /></Container>;
  

 if (error && hasActivity) {
  return <Container><ErrorScreen message={error} onRetry={init} /></Container>;
}

if (activityChecked && !hasActivity) {
  return (
    <Container>
      <NewUserEmptyState onGenerate={forceRefresh} hasActivity={false} />
    </Container>
  );
}


if (loading) {
  return <Container><LoadingScreen pollCount={pollCount} /></Container>;
}
if (!movies.length) {
  return (
    <Container>
      <EmptyScreen onGenerate={forceRefresh} />
    </Container>
  );
}
  return (
    <Container>
      <div className="flex justify-between items-center pt-20 md:pt-11 mb-4">
        <div className="w-24"></div>
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-light tracking-tight text-white">
            Picked <span className="text-green-400 font-medium">for you</span>
          </h1>
        </div>
        <div className="w-24 flex justify-end">
          <button
            onClick={forceRefresh}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-white/8 hover:border-green-500/20 text-zinc-400 hover:text-white text-[10px] rounded-full transition-all duration-300 whitespace-nowrap"
          >
            <RefreshCw size={10} />
            Refresh
          </button>
        </div>
      </div>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent mb-10" />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {movies.map((movie, index) => (
          <div key={movie.id} className="contents">
            <MovieCard
              movie={movie}
              index={index}
              onAddClick={() => handleOpenModal(movie.id)}
            />
            {(index + 1) % 5 === 0 && index !== movies.length - 1 && (
              <div className="col-span-full flex items-center gap-4 py-2 pointer-events-none select-none">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-zinc-800/60 to-transparent" />
                <div className="w-1 h-1 rounded-full bg-green-500/30" />
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-zinc-800/60 to-transparent" />
              </div>
            )}
          </div>
        ))}
      </div>

      {isModalOpen && (
        <AddToListModal movieId={selectedMovieId} onClose={() => setIsModalOpen(false)} />
      )}
    </Container>
  );
}