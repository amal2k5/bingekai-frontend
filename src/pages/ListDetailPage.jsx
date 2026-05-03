import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { getListDetail, removeMovieFromList, getPublicList } from "../services/listService";
import { Trash2, Film, ChevronLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom"; 

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

export default function ListDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const [movies, setMovies] = useState([]);
  const [listInfo, setListInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPublicView, setIsPublicView] = useState(false);
  const navigate = useNavigate();

  const fetchList = async () => {
    try {
      setLoading(true);
      
      const isPublic = window.location.pathname.includes('/public/');
      setIsPublicView(isPublic);
      
      let listData;
      
      if (location.state?.listData) {
        listData = location.state.listData;
        setListInfo(listData);
        console.log("Using passed list data:", listData);
      } else {
        if (isPublic) {
          listData = await getPublicList(id);
          setListInfo(listData);
        } else {
          const res = await getListDetail(id);
          listData = res.data || res;
          setListInfo(listData);
        }
      }

      const items = listData.items || [];
      console.log("List items:", items);

      if (items.length === 0) {
        setMovies([]);
        return;
      }

  
      const movieData = await Promise.all(
        items.map(async (item) => {
          try {
            const response = await fetch(
              `https://api.themoviedb.org/3/movie/${item.movie_id}?api_key=${API_KEY}`
            );
            if (!response.ok) throw new Error('Movie not found');
            const data = await response.json();
            return { ...data, movie_id: item.movie_id };
          } catch (error) {
            console.error(`Failed to fetch movie ${item.movie_id}:`, error);
            return { 
              movie_id: item.movie_id, 
              title: "Unknown Movie",
              poster_path: null,
              release_date: null,
              vote_average: 0
            };
          }
        })
      );
      
      setMovies(movieData);
    } catch (err) {
      console.error("Failed to fetch list:", err);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [id, location.state]);

  const handleRemove = async (movieId) => {
    if (isPublicView) return;
    
    try {
      setMovies((prev) => prev.filter((m) => m.movie_id !== movieId));
      await removeMovieFromList(id, movieId);
    } catch (error) {
      console.error("Failed to remove movie:", error);
      fetchList();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-green-500 font-sans">
        <Loader2 className="w-12 h-12 animate-spin mb-4 opacity-70" />
        <span className="text-xs font-semibold tracking-widest uppercase">
          Retrieving Data...
        </span>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950 text-gray-200 pt-28 pb-20 px-6 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-gray-800 pb-10">
          <div>
            <Link 
              to={isPublicView ? -1 : "/lists"} 
              className="flex items-center text-xs font-bold text-gray-400 hover:text-green-500 transition-colors mb-4 group"
            >
              <ChevronLeft size={14} className="mr-1 group-hover:-translate-x-1 transition-transform" />
              {isPublicView ? "Back to Profile" : "Back to Collections"}
            </Link>
<div className="flex items-center gap-5 group">
  {/* The Status Indicator: Static Emerald with a soft "Inner Glow" effect */}
  <div className="relative flex items-center justify-center">
    <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)] transition-all duration-700 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.8)]" />
    {/* Subtle outer ring for detail */}
    <div className="absolute h-4 w-4 rounded-full border border-emerald-500/20 scale-100 group-hover:scale-125 transition-transform duration-700" />
  </div>

  {/* The Title: High-end "Tracking" and refined weight */}
  <h1 className="text-2xl md:text-3xl font-light text-white uppercase tracking-[0.1em] transition-colors duration-500">
    <span className="group-hover:text-emerald-400 transition-colors duration-500">
      {listInfo?.name?.split(' ')[0] || "Movie"}
    </span>
    {listInfo?.name?.split(' ').slice(1).length > 0 && (
      <span className="text-white/40 ml-3 font-extralight group-hover:text-white transition-colors duration-700">
        {listInfo.name.split(' ').slice(1).join(' ')}
      </span>
    )}
  </h1>
</div>
            {listInfo?.description && (
              <p className="text-gray-400 mt-2 text-sm">{listInfo.description}</p>
            )}
            {isPublicView && listInfo?.user && (
              <p className="text-green-500 mt-1 text-xs font-semibold">
                by {listInfo.user.username}
              </p>
            )}
          </div>
          <div className="flex items-center gap-4 text-xs font-medium text-gray-400">

            {isPublicView && (
              <span className="bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20 text-green-400">
                Public List
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        {movies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
            <Film size={48} className="mb-6 text-gray-600" />
            <p className="text-gray-400 font-medium">This collection is empty.</p>
            {!isPublicView && (
              <Link to="/" className="mt-4 text-green-500 text-sm font-bold hover:underline">
                Browse Movies
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {movies.map((movie) => (
              <div 
                key={movie.movie_id} 
                onClick={() => navigate(`/movie/${movie.id}`)} 
                className="group relative aspect-[2/3] bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-green-500/50 transition-all duration-500 shadow-lg hover:shadow-green-500/20 cursor-pointer"
              >
                {/* Poster */}
                <img
                  src={movie.poster_path ? `${IMAGE_BASE}${movie.poster_path}` : "https://via.placeholder.com/500x750?text=No+Poster"}
                  alt={movie.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Overlay */}

<div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
  
  {/* TOP SECTION: Remove Button */}
  <div className="flex justify-end">
    {!isPublicView && (
      <button
        onClick={() => handleRemove(movie.movie_id)}
        className="p-2 bg-red-600/80 hover:bg-red-500 text-white rounded-lg transition-all duration-200 shadow-md"
        title="Remove"
      >
        <Trash2 size={14} />
      </button>
    )}
  </div>

  {/* BOTTOM SECTION: Info (Year, Title, Rating) */}
  <div className="translate-y-4 group-hover:translate-y-0 transition-all duration-300 ease-out">
    {/* Year */}
    <p className="text-[10px] font-bold text-green-400 uppercase tracking-widest mb-1">
      {movie.release_date?.split("-")[0] || "N/A"}
    </p>
    
    {/* Title */}
    <h3 className="text-sm font-semibold text-white leading-tight line-clamp-2 mb-2">
      {movie.title}
    </h3>
    
    {/* Rating */}
    {/* <div className="flex items-center gap-2">
      <span className="text-[10px] font-bold bg-white/10 px-2 py-0.5 rounded text-gray-200 border border-white/5">
        ★ {movie.vote_average?.toFixed(1) || "N/A"}
      </span>
    </div> */}
  </div>
</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}