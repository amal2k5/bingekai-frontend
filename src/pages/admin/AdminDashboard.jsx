import { useEffect, useState, useCallback } from "react";
import api from "../../api/api";
import DashboardHeader from "../../components/admin/analytics/DashboardHeader";
import DashboardMain from "../../components/admin/analytics/DashboardMain";

export default function AdminDashboard() {
  const [data, setData] = useState({ activity: [], insights: {} });
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);

  const fetchDashboardData = useCallback(async (days = null, start = null, end = null) => {
    setLoading(true);
    try {
      let params = {};
      if (start && end) {
        params.start_date = start;
        params.end_date = end;
      } else {
        params.days = days ?? 7;
      }
      const res = await api.get("/admin/analytics/", { params });
      console.log("API response:", res.data);
      setData(res.data);
    } catch (err) {
      console.error("Analytics fetch failed", err);
      setData({ activity: [], insights: {} });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData(7);
  }, [fetchDashboardData]);


  useEffect(() => {
    fetchDashboardData(days);
  }, [days]); 


  if (loading && !data?.activity?.length) {
    return (
      <div className="min-h-screen bg-[#08080a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-5">
          <div className="relative flex items-center justify-center animate-pulse">
            <div className="absolute w-12 h-12 bg-emerald-500/5 rounded-full ring-1 ring-emerald-500/20"></div>
            <svg 
              className="w-6 h-6 text-emerald-500/80" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="1.5" 
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
              />
            </svg>
          </div>
          <p className="text-emerald-500/60 font-mono text-[10px] uppercase tracking-[0.4em]">
            Loading
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050507] relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-indigo-600/5 blur-[120px] pointer-events-none"></div>
      
      <div className="relative z-10 p-4 md:p-10 space-y-10 max-w-[1600px] mx-auto">
        <DashboardHeader
          days={days}
          setDays={setDays}
          data={data}
        />

        <DashboardMain 
          data={data} 
          days={days} 
          setDays={setDays} 
          onFetchData={fetchDashboardData}
          loading={loading}
        />

        <footer className="pt-10 pb-6 border-t border-white/5 flex justify-between items-center">

          <p className="text-[10px] text-slate-300 uppercase tracking-widest font-bold">
  
          </p>
        </footer>
      </div>
    </div>
  );
}