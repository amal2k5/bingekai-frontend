import { useEffect, useState } from "react";
import {
  getUserLists,
  addMovieToList,
  createList,
} from "../services/listService";
import {
  Plus,
  X,
  ChevronDown,
  Loader2,
  Check,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function AddToListModal({ movieId, onClose }) {
  const [lists, setLists] = useState([]);
  const [selected, setSelected] = useState("");
  const [newListName, setNewListName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchLists();
  }, []);

const fetchLists = async () => {
  try {
    const res = await getUserLists();

    console.log("LIST RESPONSE:", res);

    const listsData = res?.data?.results || [];

    setLists(listsData);
  } catch (err) {
    console.error("LIST FETCH ERROR:", err);
    setLists([]);
  }
};

  const showToast = (msg, type = "success") => {
    toast.custom(
      (t) => (
        <div
          className={`${t.visible ? "animate-in slide-in-from-bottom-2 fade-in duration-500" : "animate-out slide-out-to-bottom-2 fade-out duration-300"} bg-[#0a0a0a] border ${type === "success" ? "border-emerald-500/20" : "border-red-500/20"} rounded-xl shadow-2xl px-4 py-3 flex items-center gap-3`}
        >
          <div
            className={`rounded-lg p-1.5 ${type === "success" ? "bg-emerald-500/10" : "bg-red-500/10"}`}
          >
            {type === "success" ? (
              <Check size={18} className="text-emerald-500" />
            ) : (
              <X size={18} className="text-red-500" />
            )}
          </div>
          <div>
            <p className="text-white text-sm font-medium">{msg}</p>
            <p className="text-gray-500 text-xs">
              {type === "success"
                ? "Action completed successfully"
                : "Please try again"}
            </p>
          </div>
        </div>
      ),
      { duration: 2000 },
    );
  };

  const handleAdd = async () => {
    if (!selected) {
      showToast("Select a list first", "error");
      return;
    }
    setLoading(true);
    try {
      await addMovieToList({ list_id: selected, movie_id: movieId });
      showToast("Movie added to list");
      setTimeout(onClose, 1500);
    } catch (err) {
      showToast("Failed to add movie", "error");
    } finally {
      setLoading(false);
    }
  };
const handleCreateAndAdd = async () => {
  if (!newListName.trim()) {
    showToast("Enter a list name", "error");
    return;
  }

  setIsCreating(true);
  try {
    const res = await createList({ name: newListName });

    await addMovieToList({
      list_id: res.data.id,
      movie_id: movieId,
    });

    await fetchLists(); 

    showToast("List created & movie added");
    setTimeout(onClose, 1500);
  } catch (err) {
    showToast("Action failed", "error");
  } finally {
    setIsCreating(false);
  }
};

  return (
<div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
  <Toaster position="bottom-center" />

  {/* Backdrop: Deep isolation blur */}
  <div
    className="absolute inset-0 bg-[#050505]/95 backdrop-blur-md animate-in fade-in duration-1000"
    onClick={onClose}
  />

  {/* Modal Container: Increased width and architectural structure */}
  <div className="relative w-full max-w-[520px] bg-[#0c0c0c] border border-white/[0.08] rounded-md shadow-[0_40px_100px_-20px_rgba(0,0,0,1)] animate-modalStandardEntry overflow-hidden">
    
    {/* Top Detail: Precision Line */}
    <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

    <div className="p-10">
      {/* Header Area: High-contrast spacing */}
      <div className="flex justify-between items-start mb-12">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-[#22c55e]" />
            <span className="text-[10px] font-semibold tracking-[0.3em] text-[#22c55e] uppercase">Custom Movie Lists</span>
          </div>
          <h3 className="text-2xl font-light text-white tracking-tight">
            Movie <span className="text-white/70 font-thin">Collections</span>
          </h3>
        </div>
        <button
          onClick={onClose}
          className="group p-2 -mr-2"
        >
          <X size={20} strokeWidth={1} className="text-white/20 group-hover:text-white transition-all duration-500 group-hover:rotate-90" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-10">
        
        {/* Selection Block */}
        <div className="space-y-4">
          <div className="flex justify-between items-end">

            <span className="text-[10px] tabular-nums text-white/60 uppercase tracking-widest">
              {lists.length} lists Available
            </span>
          </div>
          
          <div className="relative">
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="w-full appearance-none bg-white/[0.03] border border-white/[0.06] text-white/90 text-[14px] rounded-sm py-4 px-5 outline-none focus:border-white/20 transition-all cursor-pointer hover:bg-white/[0.05]"
            >
              <option value="" className="bg-[#0c0c0c]">Select existing collections</option>
              {Array.isArray(lists) && lists.map((list) => (
                <option key={list.id} value={list.id} className="bg-[#0c0c0c]">
                  {list.name} — {list.movie_count || 0} Movies
                </option>
              ))}
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
              <ChevronDown size={16} strokeWidth={1} />
            </div>
          </div>
        </div>

        {/* Creation Block: Detailed Input */}
        <div className="space-y-4 pt-4">
          <label className="text-[11px] font-medium text-white/90 tracking-widest uppercase px-1">
            Create a new collection
          </label>
          <div className="relative flex items-center group">
            <input
              type="text"
              placeholder="Enter the name"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              className="w-full bg-transparent border-b border-white/[0.08] py-3 text-[15px] text-white/90 placeholder:text-white/30 outline-none focus:border-[#22c55e]/50 transition-all duration-700"
              autoComplete="off"
            />
            <button
              onClick={handleCreateAndAdd}
              disabled={isCreating || !newListName.trim()}
              className="absolute right-0 p-2 text-white/20 hover:text-[#22c55e] disabled:opacity-0 transition-all duration-500 translate-y-1 group-focus-within:translate-y-0"
            >
              {isCreating ? <Loader2 size={18} className="animate-spin" /> : <Plus size={22} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </div>

      {/* Footer Actions: Offset layout */}
      <div className="mt-16 flex items-center justify-between">
        <button
          onClick={onClose}
          className="text-[12px] font-medium text-white/70 hover:text-white transition-colors tracking-widest uppercase"
        >
          Cancel
        </button>
        
        <button
          onClick={handleAdd}
          disabled={!selected || loading}
          className="relative group px-10 py-4 bg-white disabled:bg-white/5 overflow-hidden transition-all duration-500 rounded-sm"
        >
          <div className="absolute inset-0 bg-[#22c55e] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          <span className="relative z-10 text-white/80 group-hover:text-white text-[12px] font-semibold uppercase tracking-[0.2em] transition-colors duration-500">
            {loading ? "Adding..." : "Confirm"}
          </span>
        </button>
      </div>
    </div>

    {/* Subtle footer decorative line */}
    <div className="h-[1px] w-full bg-white/[0.02]" />
  </div>

  <style>{`
    @keyframes modalStandardEntry {
      0% { opacity: 0; transform: scale(0.99) translateY(20px); filter: blur(4px); }
      100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
    }
    .animate-modalStandardEntry {
      animation: modalStandardEntry 0.8s cubic-bezier(0.19, 1, 0.22, 1) forwards;
    }
  `}</style>
</div>
  );
}
