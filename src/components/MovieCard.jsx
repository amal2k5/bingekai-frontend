import { useNavigate } from "react-router-dom";
import { Info, Plus } from "lucide-react";

const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

export default function MovieCard({ movie, onAddToList }) {
  const navigate = useNavigate();

  if (!movie) return null;

  return (
    <div className="relative group w-full h-full cursor-pointer">
      
      {/* IMAGE CONTAINER */}
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl bg-zinc-900 border border-white/5 transition-all duration-500 group-hover:border-yellow-500/30">
        
        <img
          src={
            movie.poster_path
              ? `${IMAGE_BASE}${movie.poster_path}`
              : "https://via.placeholder.com/500x750?text=No+Poster"
          }
          alt={movie.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* HOVER OVERLAY */}
<div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400 flex flex-col justify-between p-3">
  
  {/* Top Actions (Optional: Like a "New" badge or Bookmark) */}
  <div className="flex justify-end">
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onAddToList(movie);
      }}
      className="p-2.5 bg-zinc-900/60 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-yellow-500 hover:text-black hover:border-yellow-500 transition-all active:scale-90 shadow-xl"
      title="Add to List"
    >
      <Plus size={16} strokeWidth={3} />
    </button>
  </div>

  {/* Bottom Action (Main Call to Action) */}
  <div className="flex justify-center translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        navigate(`/movie/${movie.id}`);
      }}
      className="flex items-center gap-2 bg-white text-black px-5 py-2 rounded-full font-bold text-[10px] uppercase tracking-[0.15em] hover:bg-yellow-500 transition-colors shadow-2xl"
    >
      <Info size={12} strokeWidth={3} />
      Details
    </button>
  </div>
</div>
      </div>
    </div>
  );
}