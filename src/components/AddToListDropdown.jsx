import { useEffect, useState } from "react";
import { getUserLists, addMovieToList } from "../services/listService";
import { Plus, Check, ChevronDown, Film, List, Sparkles } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function AddToListDropdown({ movieId }) {
  const [lists, setLists] = useState([]);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredList, setHoveredList] = useState(null);

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      const res = await getUserLists();
      setLists(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = async () => {
    if (!selected) return;
    setLoading(true);

    try {
      await addMovieToList({
        list_id: selected,
        movie_id: movieId,
      });
      
      const listName = lists.find(l => l.id === selected)?.name;
      
      toast.custom((t) => (
        <div className={`${t.visible ? 'animate-in slide-in-from-bottom-2 fade-in duration-300' : 'animate-out slide-out-to-bottom-2 fade-out duration-200'} bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl px-4 py-3 flex items-center gap-3`}>
          <div className="bg-emerald-500/10 rounded-lg p-1.5">
            <Check size={18} className="text-emerald-500" />
          </div>
          <div>
            <p className="text-white text-sm font-medium">Added to {listName}</p>
            <p className="text-gray-500 text-xs">Movie saved to your collection</p>
          </div>
        </div>
      ), { duration: 3000 });
      
      setSelected("");
      setIsOpen(false);
    } catch (err) {
      toast.custom((t) => (
        <div className={`${t.visible ? 'animate-in slide-in-from-bottom-2 fade-in duration-300' : 'animate-out slide-out-to-bottom-2 fade-out duration-200'} bg-[#0a0a0a] border border-red-500/20 rounded-xl shadow-2xl px-4 py-3 flex items-center gap-3`}>
          <div className="bg-red-500/10 rounded-lg p-1.5">
            <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-white text-sm font-medium">Failed to add</p>
            <p className="text-gray-500 text-xs">Please try again</p>
          </div>
        </div>
      ));
    } finally {
      setLoading(false);
    }
  };

  const selectedList = lists.find(l => l.id === selected);

  return (
    <div className="relative w-full max-w-[280px]">
      <Toaster position="bottom-right" />
      
      {/* Label with icon */}
      <div className="flex items-center gap-2 mb-2 px-1">
        <Sparkles size={12} className="text-emerald-500" />
        <label className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-semibold">
          Save to Collection
        </label>
      </div>

      {/* Custom dropdown trigger */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between hover:border-white/20 transition-all duration-300 group"
        >
          <div className="flex items-center gap-3">
            <div className="bg-white/5 rounded-lg p-1.5 group-hover:bg-emerald-500/10 transition-colors duration-300">
              <List size={16} className="text-gray-400 group-hover:text-emerald-500 transition-colors duration-300" />
            </div>
            <span className={`text-sm ${selected ? 'text-white font-medium' : 'text-gray-500'}`}>
              {selected ? selectedList?.name : 'Select a list'}
            </span>
          </div>
          <ChevronDown 
            size={16} 
            className={`text-gray-400 transition-all duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          />
        </button>

        {/* Dropdown menu */}
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-20 animate-in slide-in-from-top-2 fade-in duration-200">
              <div className="max-h-[240px] overflow-y-auto custom-scrollbar">
                {lists.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <Film size={32} className="text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No lists yet</p>
                    <p className="text-gray-600 text-xs mt-1">Create your first list</p>
                  </div>
                ) : (
                  lists.map((list) => (
                    <button
                      key={list.id}
                      onClick={() => {
                        setSelected(list.id);
                        setIsOpen(false);
                      }}
                      onMouseEnter={() => setHoveredList(list.id)}
                      onMouseLeave={() => setHoveredList(null)}
                      className={`
                        w-full px-4 py-3 flex items-center justify-between transition-all duration-200
                        ${selected === list.id 
                          ? 'bg-emerald-500/10 border-l-2 border-emerald-500' 
                          : 'hover:bg-white/5 border-l-2 border-transparent'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`rounded-lg p-1.5 transition-colors duration-200 ${selected === list.id ? 'bg-emerald-500/20' : 'bg-white/5'}`}>
                          <List size={14} className={selected === list.id ? 'text-emerald-500' : 'text-gray-500'} />
                        </div>
                        <div className="text-left">
                          <p className={`text-sm ${selected === list.id ? 'text-white font-medium' : 'text-gray-300'}`}>
                            {list.name}
                          </p>
                          <p className="text-gray-500 text-xs mt-0.5">
                            {list.movie_count || 0} movies
                          </p>
                        </div>
                      </div>
                      {selected === list.id && (
                        <Check size={16} className="text-emerald-500 animate-in zoom-in duration-200" />
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add button with animation */}
      <button
        onClick={handleAdd}
        disabled={!selected || loading}
        className={`
          w-full mt-3 py-3 rounded-xl font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2
          ${selected && !loading
            ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
            : 'bg-white/5 text-gray-500 cursor-not-allowed opacity-50'
          }
        `}
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            <span>Adding...</span>
          </>
        ) : (
          <>
            <Plus size={18} strokeWidth={2} />
            <span>Add to List</span>
          </>
        )}
      </button>

      {/* Success indicator */}
      {selected && !loading && (
        <div className="absolute -right-2 -top-2">
          <div className="bg-emerald-500 rounded-full p-1 animate-in zoom-in duration-300">
            <Check size={10} className="text-black" />
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
}