import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMovieDetails } from "../api/movieApi";
import {
  getUserRating,
  rateMovie,
  getRatingStats,
  unrateMovie,
} from "../api/ratings";
import RatingStars from "../components/RatingStars";
import ReviewsSection from "../components/reviews/ReviewsSection";
import WatchlistModal from "../components/watchlist/WatchlistModal";
import { Plus, Film, Star, Calendar, Clock, ChevronDown, Share2, Play } from "lucide-react";

const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
const BACKDROP_BASE = "https://image.tmdb.org/t/p/original";

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [providers, setProviders] = useState(null);
  const [userRating, setUserRating] = useState(null);
  const [avgRating, setAvgRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const token = localStorage.getItem("access");
  const user = !!token;

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const {
          movie: movieData,
          credits: creditsData,
          providers: providersData,
        } = await getMovieDetails(id);
        setMovie(movieData);
        setCredits(creditsData);
        setProviders(providersData);

        try {
          const statsRes = await getRatingStats(id);
          setAvgRating(statsRes.data.average_rating || 0);
          setTotalRatings(statsRes.data.total_ratings || 0);
        } catch (err) {
          console.error("Stats error", err);
        }

        if (user) {
          try {
            const userRes = await getUserRating(id);
            setUserRating(userRes.data.rating ?? null);
          } catch {
            setUserRating(null);
          }
        }
      } catch (error) {
        console.error("Failed to fetch movie details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [id, user]);

  const handleRate = async (star) => {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      let newRating = null;
      if (star === userRating) {
        await unrateMovie(id);
        newRating = null;
      } else {
        const res = await rateMovie(id, star);
        newRating = res.data.rating;
      }
      setUserRating(newRating);
      const statsRes = await getRatingStats(id);
      setAvgRating(statsRes.data.average_rating || 0);
      setTotalRatings(statsRes.data.total_ratings || 0);
    } catch (err) {
      console.error("Rating error", err);
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-4">
        <Film size={48} className="text-emerald-500 animate-pulse" />
        <span className="text-zinc-500 text-xs font-bold uppercase tracking-[0.3em] animate-pulse">
          Loading Movie
        </span>
      </div>
    );
  }

  if (!movie)
    return <div className="text-white text-center mt-20">Movie not found.</div>;

  const ottPlatforms =
    providers?.results?.IN?.flatrate || providers?.results?.US?.flatrate || [];
  const director = credits?.crew?.find((person) => person.job === "Director");

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen font-sans selection:bg-emerald-500/30">
      <style
        dangerouslySetInnerHTML={{
          __html: `
  @keyframes ken-burns {
    0% { transform: scale(1); }
    100% { transform: scale(1.1); }
  }
  .animate-ken-burns {
    animation: ken-burns 20s ease-out forwards;
  }
`,
        }}
      />

      {/* HERO & MOVIE DETAILS OVERLAY */}
<div className="relative h-[90vh] w-full overflow-hidden bg-[#050505] font-sans">
  {/* --- BACKGROUND ENGINE --- */}
  <div className="absolute inset-0">
    <div className="relative w-full h-full">
      <img
        src={movie?.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : "https://via.placeholder.com/1920x1080"}
        className="w-full h-full object-cover scale-105 animate-subtle-zoom"
        alt={movie.title}
      />
      {/* Cinematic Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/20 to-transparent" />
      {/* Film Grain Texture */}
      <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  </div>

  {/* --- CONTENT LAYER --- */}
  <div className="absolute inset-0 flex flex-col justify-end px-8 md:px-20 pb-20 z-10">
    <div className="max-w-4xl space-y-8">
      
      {/* 1. Genre & Status Badges */}
      <div className="flex items-center gap-3 animate-fade-in-up">
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 border border-white/20 text-white uppercase tracking-widest">4K Ultra HD</span>
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 uppercase tracking-widest">New Release</span>
        <div className="h-1 w-1 rounded-full bg-white/30" />
        <span className="text-white/60 text-[11px] font-medium tracking-wide">Action • Sci-Fi • Adventure</span>
      </div>

      {/* 2. Title & Tagline Section */}
      <div className="space-y-2">
        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tight leading-none drop-shadow-2xl">
          {movie.title}
        </h1>
        <p className="text-lg md:text-xl font-medium italic bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          {movie.tagline}
        </p>
      </div>

      {/* 3. Detailed Metadata Row */}
      <div className="flex flex-wrap items-center gap-8 py-2">
        {/* Rating */}
        <div className="flex flex-col">
          <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] mb-1">Rating</span>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-emerald-400">
              <Star size={16} fill="currentColor" />
              <span className="text-lg font-bold text-white">{movie.vote_average?.toFixed(1)}</span>
            </div>
            <span className="text-white/30 text-xs">/ 10</span>
          </div>
        </div>

        <div className="w-[1px] h-8 bg-white/10" />

        {/* Year */}
        <div className="flex flex-col">
          <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] mb-1">Release</span>
          <span className="text-lg font-semibold text-white/90">{movie.release_date?.split("-")[0]}</span>
        </div>

        <div className="w-[1px] h-8 bg-white/10" />

        {/* Runtime */}
        <div className="flex flex-col">
          <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] mb-1">Duration</span>
          <span className="text-lg font-semibold text-white/90">{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
        </div>
      </div>

      {/* 4. Description with Premium Blur Accent */}
      <div className="relative group max-w-2xl">
        <div className="absolute -left-6 top-0 bottom-0 w-[3px] bg-gradient-to-b from-emerald-500 to-transparent rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
        <p className={`text-base md:text-lg text-white/70 leading-relaxed font-normal ${isExpanded ? "" : "line-clamp-3"}`}>
          {movie.overview}
        </p>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-bold text-white/40 mt-2 hover:text-emerald-400 transition-colors uppercase tracking-widest"
        >
          {isExpanded ? "Collapse -" : "Details +"}
        </button>
      </div>

      {/* 5. Action Suite */}
      <div className="flex items-center gap-4 pt-4">
        {/* Primary Play Button */}
        <button className="flex items-center gap-3 px-10 py-4 bg-white text-black rounded-xl hover:bg-emerald-400 transition-all duration-500 group">
          <Play fill="black" size={20} className="group-hover:scale-110 transition-transform" />
          <span className="text-sm font-black uppercase tracking-tighter">Watch Trailer</span>
        </button>

        {/* Secondary Watchlist Button */}
        <button 
          onClick={() => !user ? navigate("/login") : setOpenModal(true)}
          className="p-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>

        {/* Share Button */}
        <button className="p-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all">
          <Share2 size={20} />
        </button>
      </div>
    </div>
  </div>

  {/* Ambient Bottom Edge Shadow */}
  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050505] to-transparent z-20" />
</div>
      {/* CONTENT GRID */}
      <div className="px-6 md:px-16 py-20 grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-16">
          <div className="space-y-14">
            {/* Director Section */}
            {director && (
              <section>
                <div className="flex items-center gap-4 group mb-6">
                  {/* The Detail: Gradient hairline that glows on hover */}
                  <div className="h-[1px] w-6 bg-gradient-to-r from-emerald-500/80 to-transparent transition-all duration-700 group-hover:w-10 group-hover:from-emerald-400" />

                  {/* The Typography: Medium weight for elegance, extra spacing for premium feel */}
                  <h2 className="text-[15px] font-medium uppercase tracking-[0.4em] transition-colors duration-500">
                    <span className="text-emerald-500/90 group-hover:text-emerald-400">
                      The
                    </span>
                    <span className="text-white/40 ml-2 group-hover:text-white/70 transition-colors">
                      Filmmaker
                    </span>
                  </h2>

                  {/* The Frame: Subtle line to ground the header against the black bg */}
                  <div className="h-[1px] flex-1 bg-white/[0.03]" />
                </div>

                <div className="group flex items-center gap-5 bg-zinc-900/20 border border-white/5 rounded-2xl p-4 w-fit pr-10 hover:border-emerald-500/30 hover:bg-zinc-900/40 transition-all duration-500">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-zinc-800 shadow-2xl group-hover:scale-105 transition-transform">
                    <img
                      src={
                        director.profile_path
                          ? `https://image.tmdb.org/t/p/w300${director.profile_path}`
                          : "https://placehold.co/300x300/1a1a1a/333?text=—"
                      }
                      className="w-full h-full object-cover"
                      alt={director.name}
                    />
                  </div>
                  <div>
                    <p className="text-white text-xl font-medium tracking-tight group-hover:text-emerald-400 transition-colors">
                      {director.name}
                    </p>
                    <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">
                      Director
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* Cast Section */}
            <section>
              <div className="flex items-center gap-4 group mb-6">
                {/* Precision Hairline Accent */}
                <div className="h-[1px] w-6 bg-gradient-to-r from-emerald-500/80 to-transparent transition-all duration-700 group-hover:w-10 group-hover:from-emerald-400" />

                {/* Refined Typography */}
                <h2 className="text-[15px] font-medium uppercase tracking-[0.4em] transition-colors duration-500">
                  <span className="text-emerald-500/90 group-hover:text-emerald-400">
                    Principal
                  </span>
                  <span className="text-white/30 ml-2 group-hover:text-white/60 transition-colors">
                    Cast
                  </span>
                </h2>

                {/* Framing Line - Anchors the text to the layout */}
                <div className="h-[1px] flex-1 bg-white/[0.03]" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {credits?.cast?.slice(0, 6).map((actor) => (
                  <div
                    key={actor.id}
                    className="flex items-center gap-5 bg-white/[0.02] border border-white/[0.05] rounded-2xl p-3.5 hover:border-emerald-500/40 hover:bg-white/[0.04] transition-all duration-300 group"
                  >
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-zinc-800 shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                      <img
                        src={
                          actor.profile_path
                            ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                            : "https://placehold.co/200x200/1a1a1a/333?text=🎭"
                        }
                        className="w-full h-full object-cover"
                        alt={actor.name}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-zinc-100 text-base font-medium truncate group-hover:text-emerald-400 transition-colors">
                        {actor.name}
                      </p>
                      <p className="text-zinc-500 text-[11px] font-normal truncate mt-0.5 uppercase tracking-wide">
                        {actor.character}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* RATING & REVIEWS */}
          <section className="space-y-8">
            <div className="flex items-center gap-4 group">
              {/* The Accent: A thinner, more elegant line with a subtle glow */}
              <div className="h-[1px] w-6 bg-gradient-to-r from-emerald-500/80 to-transparent rounded-full transition-all duration-700 group-hover:w-10 group-hover:from-emerald-400" />

              {/* The Typography: Medium weight, high tracking, and muted color */}
              <h2 className="text-emerald-500/90 text-[15px] font-medium uppercase tracking-[0.3em] transition-colors duration-500 group-hover:text-emerald-400">
                User{" "}
                <span className="text-white/40 group-hover:text-white/60 transition-colors">
                  Feedback
                </span>
              </h2>

              <div className="h-[1px] flex-1 bg-white/[0.03]" />
            </div>

            <div className="bg-[#0f0f0f] border border-white/[0.05] rounded-3xl p-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-10">
                <div className="flex items-center gap-6">
                  <RatingStars value={userRating} onRate={handleRate} />
                  <div className="h-10 w-px bg-white/10" />
                  <div className="text-center group">
                    {/* The Score - Light weight for a premium look */}
                    <div className="text-3xl font-light text-white tracking-tighter transition-colors duration-500 group-hover:text-emerald-400">
                      {userRating ? userRating.toFixed(1) : "0.0"}
                    </div>

                    {/* The Label - Tiny, spaced out, and subtle */}
                    <p className="text-[10px] font-medium text-zinc-600 uppercase tracking-[0.2em] mt-1 transition-colors duration-300 group-hover:text-zinc-400">
                      Your Rating
                    </p>
                  </div>
                </div>
                <div className="group flex flex-col items-end cursor-default transition-transform duration-300 hover:-translate-y-0.5">
                  {/* The Rating Number */}
                  <div className="group flex flex-col items-end cursor-default">
                    {/* Primary Rating */}
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-light text-white tracking-tighter transition-colors duration-500 group-hover:text-emerald-400">
                        {avgRating?.toFixed(1)}
                      </span>
                      <span className="text-xs font-medium text-zinc-400">
                        / 5
                      </span>
                    </div>

                    {/* Secondary Stat Line */}
                    <div className="flex items-center gap-1.5 mt-1">
                      {/* Status Dot */}
                      <div className="w-1 h-1 rounded-full bg-zinc-800 transition-all duration-500 group-hover:bg-emerald-500 group-hover:shadow-[0_0_8px_#10b981]" />

                      <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-500">
                        Global Average
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <ReviewsSection movieId={movie.id} rating={userRating} />
            </div>
          </section>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-8">
          <div className="bg-[#0c0c0c] border border-white/5 p-8 rounded-3xl sticky top-10">
            <h3 className="text-xs font-bold mb-8 uppercase tracking-[0.2em] text-emerald-500">
              Production Details
            </h3>
            <div className="space-y-6">
              <DetailItem
                label="Original Language"
                value={movie.original_language?.toUpperCase()}
              />
              <DetailItem
                label="Budget"
                value={
                  movie.budget > 0
                    ? `$${(movie.budget / 1000000).toFixed(1)}M`
                    : "N/A"
                }
              />
              <DetailItem
                label="Revenue"
                value={
                  movie.revenue > 0
                    ? `$${(movie.revenue / 1000000).toFixed(1)}M`
                    : "N/A"
                }
              />

              <div className="pt-6 border-t border-white/5">
                <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mb-4">
                  Streaming On
                </p>
                <div className="flex flex-wrap gap-3">
                  {ottPlatforms.slice(0, 5).map((p) => (
                    <img
                      key={p.provider_id}
                      src={`https://image.tmdb.org/t/p/original${p.logo_path}`}
                      className="w-10 h-10 rounded-xl border border-white/10 hover:border-emerald-500/50 transition-colors"
                      alt={p.provider_name}
                      title={p.provider_name}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <WatchlistModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        movie={movie}
        user={user}
      />
    </div>
  );
}

function DetailItem({ label, value }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-zinc-500 text-[9px] uppercase font-bold tracking-widest mb-1">
        {label}
      </p>
      <p className="text-base font-medium text-white tracking-tight">{value}</p>
    </div>
  );
}
