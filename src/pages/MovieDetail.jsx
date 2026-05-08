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
import { Plus, Film, Star, Calendar, Clock, ChevronDown, Share2 } from "lucide-react";

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
<div className="relative min-h-[90vh] w-full overflow-hidden">
  {/* Premium Background Layer */}
  <div className="absolute inset-0">
    {/* Main Backdrop with Parallax */}
    <div className="absolute inset-0 overflow-hidden">
      <img
        src={
          movie?.backdrop_path
            ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
            : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070"
        }
        className="w-full h-full object-cover object-center"
        style={{
          filter: "brightness(0.4) saturate(1.1)",
          transform: "scale(1.02)",
        }}
        alt={movie.title}
      />
    </div>

    {/* Advanced Gradient System */}
    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,transparent_0%,rgba(0,0,0,0.6)_100%)]" />
    
    {/* Premium Texture Overlay */}
    <div className="absolute inset-0 opacity-30 mix-blend-overlay" 
         style={{
           backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
           backgroundRepeat: 'repeat',
           backgroundSize: '200px',
         }} />
    
    {/* Animated Border Glow */}
    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent animate-pulse" />
  </div>

  {/* Main Content Container */}
  <div className="relative z-10 h-full min-h-[90vh] flex items-end">
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 lg:pb-20">
      
      {/* Hero Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
        
        {/* Poster Column - High Quality Display */}
        <div className="lg:col-span-3 hidden lg:block">
          <div className="relative group">
            {/* Poster Glow Effect */}
            <div className="absolute -inset-3 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
            
            {/* Poster Container */}
            <div className="relative rounded-xl overflow-hidden shadow-2xl transform transition-all duration-500 group-hover:scale-105 group-hover:shadow-emerald-500/20">
              <img
                src={
                  movie?.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : "https://via.placeholder.com/500x750?text=No+Poster"
                }
                srcSet={`
                  https://image.tmdb.org/t/p/w342${movie?.poster_path} 342w,
                  https://image.tmdb.org/t/p/w500${movie?.poster_path} 500w
                `}
                sizes="(max-width: 1024px) 342px, 500px"
                alt={movie?.title}
                className="w-full h-auto object-cover"
                loading="eager"
              />
              
              {/* Rating Badge Overlay */}
              <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md rounded-full px-3 py-1.5 flex items-center gap-1.5 border border-white/10">
                <Star className="w-3 h-3 text-emerald-500 fill-emerald-500" />
                <span className="text-white font-bold text-xs">
                  {movie?.vote_average?.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Column */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* Title Section */}
          <div className="space-y-3">
            {/* Meta Badges */}
            <div className="flex flex-wrap items-center gap-2">
              {movie?.adult === false && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wider bg-white/10 backdrop-blur-sm text-white/90 border border-white/20">
                  PG-13
                </span>
              )}
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wider bg-emerald-500/20 backdrop-blur-sm text-emerald-400 border border-emerald-500/30">
                {new Date(movie?.release_date).getFullYear()}
              </span>
              
              {/* Certification */}
              {movie?.certification && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wider bg-white/10 backdrop-blur-sm text-white/90 border border-white/20">
                  {movie.certification}
                </span>
              )}
            </div>

            {/* Movie Title */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
              {movie?.title}
            </h1>
            
            {/* Tagline */}
            {movie?.tagline && (
              <p className="text-base sm:text-lg text-white/50 font-light italic">
                {movie.tagline}
              </p>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-white/10">
            {/* Score */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Star className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                </div>
                <div>
                  <p className="text-xl font-bold text-white">
                    {movie?.vote_average?.toFixed(1)}
                    <span className="text-xs text-white/40">/10</span>
                  </p>
                  <p className="text-[10px] text-white/50 uppercase tracking-wider">
                    User Score
                  </p>
                </div>
              </div>
            </div>

            {/* Runtime */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <p className="text-base font-semibold text-white">
                    {Math.floor(movie?.runtime / 60)}h {movie?.runtime % 60}m
                  </p>
                  <p className="text-[10px] text-white/50 uppercase tracking-wider">
                    Runtime
                  </p>
                </div>
              </div>
            </div>

            {/* Release */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {new Date(movie?.release_date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                  <p className="text-[10px] text-white/50 uppercase tracking-wider">
                    Released
                  </p>
                </div>
              </div>
            </div>

            {/* Language */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-emerald-500">
                    {movie?.original_language?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {movie?.original_language?.toUpperCase()}
                  </p>
                  <p className="text-[10px] text-white/50 uppercase tracking-wider">
                    Language
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Genres */}
          {movie?.genres && movie.genres.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {movie.genres.slice(0, 4).map((genre) => (
                <span
                  key={genre.id}
                  className="px-3 py-1.5 text-xs font-medium text-white/80 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all duration-300 cursor-pointer"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          )}

          {/* Overview */}
          <div className="space-y-3">
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
              className="group relative px-8 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 rounded-full text-white font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-emerald-500/25"
            >
              <div className="flex items-center gap-2">
                <Plus size={18} className="transition-transform duration-300 group-hover:rotate-90" />
                <span>Add to Watchlist</span>
              </div>
            </button>

            {/* Trailer Button */}
            {movie?.videos?.results?.length > 0 && (
              <button className="px-8 py-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full text-white font-semibold text-sm transition-all duration-300 border border-white/20 flex items-center gap-2">
                <Play size={16} className="fill-white" />
                Watch Trailer
              </button>
            )}

            {/* Share Button */}
            <button className="px-8 py-3 bg-white/5 backdrop-blur-sm hover:bg-white/15 rounded-full text-white/80 hover:text-white font-medium text-sm transition-all duration-300 border border-white/10 flex items-center gap-2">
              <Share2 size={16} />
              Share
            </button>
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
