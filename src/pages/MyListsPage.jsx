import { useEffect, useState } from "react";
import { getUserLists, createList, deleteList } from "../services/listService";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, ArrowRight, X, Loader2 } from "lucide-react"; // Added Loader2

export default function MyListsPage() {
  const [lists, setLists] = useState([]);
  const [name, setName] = useState("");
  const [isDeleting, setIsDeleting] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchLists = async () => {
    try {
      setLoading(true);
      const res = await getUserLists();
      setLists(res.data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!name.trim()) return;
    await createList({ name });
    setName("");
    fetchLists();
  };

  const confirmDelete = async () => {
    if (!isDeleting) return;
    try {
      await deleteList(isDeleting.id);
      setLists((prev) => prev.filter((l) => l.id !== isDeleting.id));
      setIsDeleting(null);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 pt-32 pb-20 px-6 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* --- HEADER --- */}
        <header className="flex flex-col items-center text-center mb-16">
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-6 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
            Cine <span className="text-green-500 text-shadow-glow">Lists</span>
          </h1>
          <div className="flex items-center gap-3 bg-white/5 p-1.5 pl-6 rounded-full border border-white/10 shadow-2xl focus-within:border-emerald-500/50 focus-within:ring-0 transition-all duration-500 w-full max-w-md group">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Create a new list..."
              className="bg-transparent border-none outline-none focus:ring-0 flex-1 text-sm py-2 text-white placeholder:text-gray-500"
              onKeyPress={(e) => e.key === "Enter" && handleCreate()}
            />

            <button
              onClick={handleCreate}
              className="bg-emerald-500 hover:bg-emerald-400 text-black p-2.5 rounded-full transition-all duration-300 active:scale-90 shadow-lg shadow-emerald-500/20 disabled:opacity-20"
              disabled={!name.trim()}
            >
              <Plus size={18} strokeWidth={3} />
            </button>
          </div>
        </header>

        {/* --- LISTS GRID --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-10 h-10 text-green-500 animate-spin opacity-80" />
              <p className="text-xs font-black tracking-[0.2em] text-gray-500 uppercase">
                Loading the data
              </p>
            </div>
          ) : lists.length === 0 ? (
            <p className="text-gray-500 col-span-full text-center">No lists created yet</p>
          ) : (
            Array.isArray(lists) && lists.map((list, i) => (
              <div
                key={list.id}
                onClick={() => navigate(`/lists/${list.id}`)}
                className="group relative bg-[#0f0f0f] border border-white/5 p-8 rounded-2xl hover:border-green-500/30 transition-all duration-500 cursor-pointer shadow-lg"
                style={{ animation: `fadeInUp 0.5s ease-out ${i * 0.1}s both` }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDeleting(list);
                  }}
                  className="absolute top-4 right-4 p-2 text-gray-700 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110"
                >
                  <Trash2 size={16} />
                </button>

                <h3 className="text-2xl font-semibold mb-4 tracking-tight  group-hover:text-white">
                  {list.name}
                </h3>
                <div className="flex items-center text-[10px] font-semibold font-black tracking-[0.15em] text-gray-500 group-hover:text-green-500 transition-colors">
                  VIEW COLLECTION{" "}
                  <ArrowRight
                    size={12}
                    className="ml-2 group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* --- PREMIUM DELETE MODAL --- */}
      {isDeleting && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-1000 ease-in-out"
            onClick={() => setIsDeleting(null)}
          />

          <div
            className="relative group max-w-sm w-full animate-in fade-in duration-1000 fill-mode-forwards ease-[cubic-bezier(0.34,1.2,0.64,1)]"
            style={{
              animation: "slowPopup 1s cubic-bezier(0.34, 1.2, 0.64, 1) forwards",
            }}
          >
            <div className="absolute -inset-1 bg-gradient-to-b from-red-500/20 to-transparent rounded-[2.5rem] blur-3xl opacity-50" />

            <div className="relative bg-[#0d0d0d] border border-white/10 p-10 rounded-[2.5rem] shadow-2xl overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent animate-pulse" />

              <button
                onClick={() => setIsDeleting(null)}
                className="absolute top-8 right-8 text-gray-500 hover:text-white transition-all duration-500 hover:rotate-90"
              >
                <X size={18} />
              </button>

              <div className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-8 animate-in zoom-in-50 duration-1000 delay-200">
                  <div className="absolute inset-0 bg-red-500/10 rounded-3xl rotate-12 group-hover:rotate-[30deg] transition-transform duration-1000" />
                  <div className="relative w-full h-full bg-[#151515] border border-red-500/20 rounded-3xl flex items-center justify-center">
                    <Trash2 className="text-red-500" size={28} />
                  </div>
                </div>

                <div className="animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-300">
                  <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">
                    Delete <span className="text-red-500">Item ?</span>
                  </h2>

                  <p className="text-gray-400 text-[15px] mb-10 leading-relaxed px-2">
                    This action is permanent. You are removing
                    <span className="block mt-1 text-white font-semibold">
                      "{isDeleting.name}"
                    </span>
                  </p>

                  <div className="flex flex-col gap-4">
                    <button
                      onClick={confirmDelete}
                      className="group relative w-full py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-2xl transition-all duration-500 overflow-hidden shadow-lg active:scale-95"
                    >
                      <span className="relative z-10">Delete Permanently</span>
                    </button>

                    <button
                      onClick={() => setIsDeleting(null)}
                      className="w-full py-2 text-gray-500 hover:text-gray-300 font-medium transition-colors duration-500 text-sm"
                    >
                      Cancel Action
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slowPopup {
          0% { opacity: 0; transform: scale(0.85) translateY(40px); filter: blur(8px); }
          40% { opacity: 0.7; transform: scale(1.02) translateY(-5px); filter: blur(0); }
          70% { transform: scale(0.99) translateY(2px); }
          100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}