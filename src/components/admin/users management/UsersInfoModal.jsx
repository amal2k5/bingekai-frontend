import { useEffect, useState } from "react";
import api from "../../../api/api";
import {
  X,
  Mail,
  User,
  Activity,
  Calendar,
  Star,
  MessageSquare,
  List,
  Users,
  UserPlus,
  Heart,
  Shield,
  ShieldCheck,
  UserCheck,
  UserX,
  Award,
  TrendingUp,
  Clock,
  Verified,
  Zap,
  Crown,
  AtSign,
  CalendarDays,
  ThumbsUp,
  Film,
} from "lucide-react";

export default function UserDetailModal({ userId, onClose }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    try {
      const res = await api.get(`/admin/users/${userId}/`);
      setUser(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return null;

  const joinedDate = new Date(user.created_at);
  const daysSinceJoined = Math.floor(
    (new Date() - joinedDate) / (1000 * 60 * 60 * 24),
  );

  const totalActivity =
    (user.activity?.ratings_count || 0) +
    (user.activity?.reviews_count || 0) +
    (user.activity?.lists_count || 0);

  const engagementScore = Math.min(
    100,
    Math.floor((totalActivity / 100) * 100),
  );

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all duration-500 ease-out"
      onClick={onClose}
    >
<div
  className="bg-gradient-to-br from-[#0c0c0c] to-[#080808] rounded-2xl w-[720px] max-h-[90vh] overflow-hidden shadow-2xl border border-white/15"
  onClick={(e) => e.stopPropagation()}
>
<style>{`
  .custom-scroll {
    scroll-behavior: smooth;
    overflow-y: auto;
    max-height: inherit;
  }
  
  .custom-scroll::-webkit-scrollbar {
    width: 4px;
  }
  
  .custom-scroll::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .custom-scroll::-webkit-scrollbar-thumb {
    background: #2a2a2a;
    border-radius: 10px;
  }
  
  .custom-scroll::-webkit-scrollbar-thumb:hover {
    background: #10b981;
  }
`}</style>

        <div className="custom-scroll h-full">
          {/* Header with Gradient Border */}
          <div className="sticky top-0 z-30 overflow-hidden rounded-t-2xl">
            {/* Subtle Radial Glow to create depth behind the icon */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/10 blur-[80px] -translate-x-1/2 -translate-y-1/2" />

            <div className="relative bg-[#0c0c0c]/80 backdrop-blur-xl border-b border-white/5 px-8 py-7 flex justify-between items-center">
              <div className="flex items-center gap-5">
                {/* Icon Container with Layered Shadows */}
                <div className="relative group">
                  <div className="absolute inset-0 " />
                  <div className="relative w-14 h-14 rounded-4xl bg-gradient-to-br from-emerald-400 to-emerald-600 p-[1px]">
                    <div className="w-full h-full rounded-[35px] bg-[#0c0c0c] flex items-center justify-center">
                      <User
                        className="w-6 h-6 text-white/80 group-hover:scale-110 transition-transform duration-500"
                        strokeWidth={1.5}
                      />
                    </div>
                  </div>


                </div>

                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl text-white font-light tracking-tight group-hover:text-emerald-400 transition-colors">
                      {user.username}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2.5 mt-1.5">
<div className="inline-flex items-center gap-2 px-2 py-0.5 rounded border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] transition-colors">
  <AtSign size={10} className="text-zinc-400" strokeWidth={2.5} />
  
  {/* Condensed typography */}
  <div className="flex items-center gap-1.5">
    <span className="text-[9px] font-bold text-zinc-400 tracking-wider uppercase select-none">
      user id -
    </span>
    <code className="text-[10px] text-zinc-400 font-mono tracking-tight tabular-nums">
      {userId}
    </code>
  </div>
</div>
                  </div>
                </div>
              </div>

              {/* Elegant Close Button */}
              <button onClick={onClose} className="group relative p-2">
                <div className="absolute inset-0 bg-white/5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
                <X
                  className="relative w-5 h-5 text-white/20 group-hover:text-white group-hover:rotate-90 transition-all duration-500"
                  strokeWidth={1.5}
                />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-6 space-y-8">
            {/* User Stats Banner */}
            <div className="bg-gradient-to-r from-emerald-500/10 via-transparent to-transparent rounded-xl p-4 border-l-4 border-emerald-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/50 text-xs font-light uppercase tracking-wider">
                    Member Since
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <CalendarDays className="w-4 h-4 text-emerald-400" />
                    <p className="text-white text-sm font-light">
                      {joinedDate.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <p className="text-white/30 text-xs mt-1">
                    {daysSinceJoined} days on platform
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-white/50 text-xs font-light uppercase tracking-wider">
                    Engagement Score
                  </p>
                  <p className="text-2xl text-emerald-400 font-light">
                    {engagementScore}%
                  </p>
                  <div className="w-24 h-1 bg-white/10 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${engagementScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Details Grid */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
                <Activity className="w-4 h-4 text-emerald-400" />
                <p className="text-white/70 text-sm font-light uppercase tracking-wider">
                  Account Details
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/[0.03] rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4 text-emerald-400" />
                    <p className="text-white/50 text-xs uppercase tracking-wider">
                      Email Address
                    </p>
                  </div>
                  <p className="text-white/90 text-sm font-mono">
                    {user.email}
                  </p>
                </div>

                <div className="bg-white/[0.03] rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-emerald-400" />
                    <p className="text-white/50 text-xs uppercase tracking-wider">
                      Username
                    </p>
                  </div>
                  <p className="text-white/90 text-sm">@{user.username}</p>
                </div>

                <div className="bg-white/[0.03] rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300">
                  <div className="flex items-center gap-2 mb-2">
                    {user.is_active ? (
                      <UserCheck className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <UserX className="w-4 h-4 text-red-400" />
                    )}
                    <p className="text-white/50 text-xs uppercase tracking-wider">
                      Account Status
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-light ${user.is_active ? "text-emerald-400" : "text-red-400"}`}
                    >
                      {user.is_active ? "Active Member" : "Inactive Member"}
                    </span>
                    {user.is_active && (
                      <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
                        Verified
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-white/[0.03] rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <p className="text-white/50 text-xs uppercase tracking-wider">
                      Total Contributions
                    </p>
                  </div>
                  <p className="text-2xl text-white/90 font-light">
                    {totalActivity}
                  </p>
                  <p className="text-white/30 text-xs mt-1">
                    Across all categories
                  </p>
                </div>
              </div>
            </div>

            {/* Activity Statistics with Visual Progress */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
                <Zap className="w-4 h-4 text-emerald-400" />
                <p className="text-white/70 text-sm font-light uppercase tracking-wider">
                  Activity
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <ActivityMetric
                  icon={<Film className="w-5 h-5" />}
                  label="Movies Rated"
                  value={user.activity?.ratings_count || 0}
                  color="emerald"
                  maxValue={500}
                />
                <ActivityMetric
                  icon={<MessageSquare className="w-5 h-5" />}
                  label="Reviews Written"
                  value={user.activity?.reviews_count || 0}
                  color="blue"
                  maxValue={200}
                />
                <ActivityMetric
                  icon={<List className="w-5 h-5" />}
                  label="Lists Created"
                  value={user.activity?.lists_count || 0}
                  color="purple"
                  maxValue={50}
                />
                <ActivityMetric
                  icon={<Heart className="w-5 h-5" />}
                  label="Likes Received"
                  value={user.activity?.likes_received_count || 0}
                  color="rose"
                  maxValue={1000}
                />
              </div>
            </div>

            {/* Social Connections */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
                <Users className="w-4 h-4 text-emerald-400" />
                <p className="text-white/70 text-sm font-light uppercase tracking-wider">
                  Social Connections
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <SocialMetric
                  icon={<UserPlus className="w-4 h-4" />}
                  label="Following"
                  value={user.activity?.following_count || 0}
                  subtitle="Users they follow"
                />
                <SocialMetric
                  icon={<Users className="w-4 h-4" />}
                  label="Followers"
                  value={user.activity?.followers_count || 0}
                  subtitle="Users following them"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityMetric({ icon, label, value, color, maxValue }) {
  const percentage = Math.min(100, (value / maxValue) * 100);
  const colorClasses = {
    emerald: "from-emerald-500 to-emerald-600",
    blue: "from-blue-500 to-blue-600",
    purple: "from-purple-500 to-purple-600",
    rose: "from-rose-500 to-rose-600",
  };

  return (
    <div className="bg-white/[0.03] rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`text-${color}-400`}>{icon}</div>
          <p className="text-white/60 text-xs uppercase tracking-wider">
            {label}
          </p>
        </div>
        <p className="text-white text-xl font-light">
          {value.toLocaleString()}
        </p>
      </div>
      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${colorClasses[color]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}

function SocialMetric({ icon, label, value, subtitle }) {
  return (
    <div className="bg-white/[0.03] rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300 text-center">
      <div className="flex items-center justify-center gap-2 mb-2">
        <div className="text-emerald-400">{icon}</div>
        <p className="text-white/50 text-xs uppercase tracking-wider">
          {label}
        </p>
      </div>
      <p className="text-3xl text-white/90 font-light">
        {value.toLocaleString()}
      </p>
      <p className="text-white/30 text-xs mt-1">{subtitle}</p>
    </div>
  );
}

function Check({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}
