import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, Users } from "lucide-react"; 
import api from "../../api/api";



export default function UserConnectionsPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const type = location.pathname.includes("followers") ? "followers" : "following";

  useEffect(() => {
    fetchConnections();
  }, [id, type]);

  const fetchConnections = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/social/follow/${type}/?user_id=${id}`);
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching connections:", err);
    } finally {
      setLoading(false);
    }
  };

const getUsername = (u) => {
  if (type === "followers") {
    return u.follower_username; 
  } else {
    return u.following_username; 
  }
};

const getUserId = (u) => {
  if (type === "followers") {
    return u.follower_id; 
  } else {
    return u.following_id; 
  }
};

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 selection:bg-indigo-500/30">
      <div className="max-w-2xl mx-auto px-6 pt-32 pb-20">
        
        {/* Header Section */}
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 rounded-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <h1 className="text-3xl font-bold tracking-tight capitalize">
              {type}
            </h1>
          </div>
          <span className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-sm font-medium text-zinc-400">
            {users.length} Total
          </span>
        </header>

        {/* Content Area */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 w-full bg-zinc-900/50 animate-pulse rounded-2xl border border-zinc-800/50" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mb-4 border border-zinc-800">
              <Users className="text-zinc-600" />
            </div>
            <h3 className="text-lg font-medium text-zinc-300">No {type} yet</h3>
            <p className="text-zinc-500 text-sm max-w-[200px] mt-1">
              When someone follows this account, they'll appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {users.map((u) => (
              <div
                key={u.id}
                onClick={() => navigate(`/users/${getUserId(u)}`)}
                className="group flex justify-between items-center p-4 rounded-2xl bg-zinc-900/30 border border-zinc-800/50 hover:bg-zinc-800/40 hover:border-zinc-700 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  {/* Premium Avatar Placeholder */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/10">
                    {getUsername(u).charAt(0).toUpperCase()}
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-zinc-100 group-hover:text-white transition-colors">
                      {getUsername(u)}
                    </h4>
                    <p className="text-xs text-zinc-500 uppercase tracking-widest">
                      Member
                    </p>
                  </div>
                </div>

                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="px-4 py-1.5 rounded-lg bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition-colors">
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}