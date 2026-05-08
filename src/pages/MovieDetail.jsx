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
import { Plus, Film, Star, Calendar, Clock, ChevronDown } from "lucide-react";

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
      <div className="relative min-h-[90vh] w-full overflow-hidden bg-gradient-to-b from-[#0a0a0a] to-black">
  {/* Background Layer with Parallax Effect */}
  <div className="absolute inset-0">
    {/* Base Backdrop Image */}
    <div className="absolute inset-0 overflow-hidden">
      <img
        src={
          movie?.backdrop_path
            ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
            : "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=2070"
        }
        className="w-full h-full object-cover object-center scale-105"
        style={{
          filter: "brightness(0.4) blur(2px)",
          transform: "scale(1.05)",
        }}
        alt={movie.title}
      />
    </div>

    {/* Premium Gradient Overlays */}
    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,transparent_30%,black_100%)]" />
    
    {/* Noise Texture */}
    <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)" /%3E%3C/svg%3E')]" />
  </div>

  {/* Main Content Container */}
  <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 min-h-[90vh] flex items-end">
    <div className="w-full pb-12 lg:pb-20">
      <div className="flex flex-col lg:flex-row lg:items-end gap-8 lg:gap-12">
        
        {/* Left Column - Poster (Premium Quality) */}
        <div className="relative flex-shrink-0 self-start lg:self-auto">
          {/* Poster Container with Hover Effects */}
          <div className="relative group/poster">
            {/* Glow Effect */}
            <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/20 to-amber-500/20 rounded-2xl blur-xl opacity-0 group-hover/poster:opacity-100 transition-opacity duration-500" />
            
            {/* Poster Frame */}
            <div className="relative w-48 sm:w-56 md:w-64 lg:w-72 rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-500 group-hover/poster:scale-105">
              <img
                src={
                  movie?.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : "https://via.placeholder.com/500x750?text=No+Poster"
                }
                srcSet={`
                  https://image.tmdb.org/t/p/w342${movie?.poster_path} 342w,
                  https://image.tmdb.org/t/p/w500${movie?.poster_path} 500w,
                  https://image.tmdb.org/t/p/w780${movie?.poster_path} 780w
                `}
                sizes="(max-width: 640px) 192px, (max-width: 768px) 224px, (max-width: 1024px) 256px, 288px"
                alt={movie?.title}
                className="w-full h-auto object-cover"
                loading="eager"
              />
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover/poster:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        </div>

        {/* Right Column - Movie Details */}
        <div className="flex-1 space-y-8">
          {/* Title Section */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* Certification Badge */}
              {movie?.adult === false && (
                <div className="px-2 py-0.5 bg-white/10 backdrop-blur-sm rounded text-[10px] font-bold text-white/80 tracking-wider border border-white/20">
                  PG-13
                </div>
              )}
              {/* Release Year Tag */}
              <div className="px-2 py-0.5 bg-emerald-500/20 backdrop-blur-sm rounded text-[10px] font-bold text-emerald-400 tracking-wider border border-emerald-500/30">
                {movie?.release_date?.split("-")[0] || "TBA"}
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
              {movie?.title}
            </h1>
            
            {movie?.tagline && (
              <p className="text-lg lg:text-xl text-white/50 font-light italic">
                {movie.tagline}
              </p>
            )}
          </div>

          {/* Rating & Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-white/10">
            {/* TMDB Rating */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                <span className="text-2xl font-bold text-white">
                  {movie?.vote_average?.toFixed(1)}
                </span>
              </div>
              <p className="text-[11px] text-white/50 uppercase tracking-wider">
                TMDB Rating
              </p>
              <p className="text-xs text-white/40">
                {movie?.vote_count?.toLocaleString()} votes
              </p>
            </div>

            {/* Runtime */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-500" />
                <span className="text-xl font-semibold text-white">
                  {Math.floor(movie?.runtime / 60)}h {movie?.runtime % 60}m
                </span>
              </div>
              <p className="text-[11px] text-white/50 uppercase tracking-wider">
                Runtime
              </p>
            </div>

            {/* Release Date */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-500" />
                <span className="text-base font-medium text-white">
                  {movie?.release_date 
                    ? new Date(movie.release_date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })
                    : "Coming Soon"
                  }
                </span>
              </div>
              <p className="text-[11px] text-white/50 uppercase tracking-wider">
                Release Date
              </p>
            </div>

            {/* Language */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                <span className="text-base font-medium text-white uppercase">
                  {movie?.original_language?.toUpperCase() || "EN"}
                </span>
              </div>
              <p className="text-[11px] text-white/50 uppercase tracking-wider">
                Language
              </p>
            </div>
          </div>

          {/* Genres */}
          {movie?.genres && movie.genres.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {movie.genres.slice(0, 4).map((genre) => (
                <span
                  key={genre.id}
                  className="px-3 py-1 text-xs font-medium text-white/80 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 hover:border-emerald-500/50 transition-all duration-300"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          )}

          {/* Overview / Description */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-emerald-500">
              Synopsis
            </h3>
            <div className="relative">
              <p className={`text-white/80 leading-relaxed text-base lg:text-lg font-light transition-all duration-500 ${
                isExpanded ? "" : "line-clamp-3"
              }`}>
                {movie?.overview || "No synopsis available for this movie."}
              </p>
              
              {movie?.overview && movie.overview.length > 200 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-3 group inline-flex items-center gap-2 text-sm font-medium text-emerald-500 hover:text-emerald-400 transition-all duration-300"
                >
                  <span className="relative">
                    {isExpanded ? "Show less" : "Read more"}
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-emerald-500 transition-all duration-300 group-hover:w-full" />
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                  />
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={() => !user ? navigate("/login") : setOpenModal(true)}
              className="group relative px-8 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-full text-white font-semibold text-sm transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center gap-2">
                <Plus size={18} className="transition-transform duration-300 group-hover:rotate-90" />
                <span>Add to Watchlist</span>
              </div>
            </button>

            {/* Trailer Button (if available) */}
            {movie?.videos?.results?.length > 0 && (
              <button className="px-8 py-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full text-white font-semibold text-sm transition-all duration-300 border border-white/20 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Watch Trailer
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
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
