import { useEffect, useState } from "react";
import { getUserActivity } from "../services/activityService";
import ActivityCard from "../components/OwnRRActivityCard";
import { useNavigate } from "react-router-dom";





export default function ActivityPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const data = await getUserActivity();
        setActivities(data);
      } catch (err) {
        setError("Failed to load activity");
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-black">
        {/* Blinking Star Icon */}
        <div className="relative flex items-center justify-center animate-pulse">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="#00e054"
            className="w-16 h-16 drop-shadow-[0_0_10px_rgba(0,224,84,0.5)]"
          >
            <path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
          </svg>
        </div>

        {/* Loading Text */}
        <p className="mt-6 text-[#00e054] text-[10px] font-bold tracking-[0.5em] uppercase animate-pulse">
          Loading
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black px-6">
        <div className="w-full max-w-md">
          {/* Main Container */}
          <div className="bg-black border border-green-500/20 rounded-2xl p-12 text-center shadow-2xl shadow-green-500/5">
            {/* Green Accent Line */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-green-500 rounded-full" />

            {/* Refined Icon - Green themed */}
            <div className="flex justify-center mb-8">
              <div className="p-4 rounded-full bg-green-500/5 ring-1 ring-green-500/30">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  className="opacity-90"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
            </div>

            <h2 className="text-white text-2xl font-light tracking-wide mb-4">
              Connection Interrupted
            </h2>

            <p className="text-gray-200 text-sm font-light leading-relaxed mb-10 tracking-normal">
              {error ||
                "We encountered a synchronization issue with the database. Please check your connection and try again."}
            </p>

            <button
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-green-600 hover:bg-green-500 text-white rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="text-[11px] uppercase tracking-[0.2em] font-medium">
                Retry Connection
              </span>
            </button>

            {/* Secondary Dismissal */}
            <button
              onClick={() => navigate("/profile")}
              className="mt-6 w-full py-2 text-gray-200 hover:text-green-400 transition-colors text-[10px] uppercase tracking-widest font-semibold"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#00e054] selection:text-black">
      {/* Container with top padding to avoid Navbar collision */}
      <div className="pt-32 pb-20 px-8 max-w-4xl mx-auto">
        {/* Header Section */}
        <header className="mb-12 flex flex-col items-center">
    <div className="text-center group">
      {/* Title - Subtle and elegant */}
      <h1 className="text-3xl md:text-4xl font-light tracking-[0.2em] uppercase text-white transition-colors duration-700 group-hover:text-emerald-400">
        Journal
      </h1>

      {/* Metadata - Clean separator */}
      <div className="flex items-center justify-center gap-4 mt-4">
        {/* Left Hairline */}
        <div className="h-[1px] w-6 bg-gradient-to-r from-transparent to-emerald-500/40" />

        <p className="text-zinc-500 text-[10px] font-medium uppercase tracking-[0.2em] flex items-center gap-2">
          <span className="text-emerald-500/60">//</span>
          <span>{activities.length} Reviews</span>
          <span className="text-emerald-500/60">//</span>
        </p>

        {/* Right Hairline */}
        <div className="h-[1px] w-6 bg-gradient-to-l from-transparent to-emerald-500/40" />
      </div>
    </div>
  </header>

        {/* Activity Stream */}
        {!activities.length ? (
          <div className="text-center py-32 border border-white/5 bg-[#050505] rounded-3xl">
            <p className="text-gray-600 font-medium italic text-lg">
              The log is currently empty.
            </p>
          </div>
        ) : (
          <div className="relative space-y-10">
            {/* Elegant Vertical Timeline Line */}
            <div className="absolute left-[-20px] top-0 bottom-0 w-[1px] bg-gradient-to-b from-[#00e054] via-[#00e054]/20 to-transparent"></div>

            {activities.map((item) => (
              <div
                key={item.movie_id}
                className="relative group transition-all duration-500 hover:translate-x-2"
              >
                {/* Timeline Indicator */}
                <div className="absolute left-[-24px] top-8 w-2 h-2 rounded-full bg-black border border-[#00e054] group-hover:bg-[#00e054] transition-colors shadow-[0_0_8px_rgba(0,224,84,0.4)]" />

                <ActivityCard activity={item} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
