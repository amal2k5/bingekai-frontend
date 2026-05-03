import { useEffect, useState } from "react";
import api from "../../../api/api";
import ReportsTable from "../../../components/admin/reports/Reports";
import { motion } from "framer-motion";

export default function AdminReportsPage() {
  const [tab, setTab] = useState("pending");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const url = tab === "pending" ? "/reports/admin/" : "/reports/admin/resolved/";
      const res = await api.get(url);
      setReports(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReports(); }, [tab]);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-3xl font-light tracking-tight">
              Moderation<span className="font-medium text-emerald-500">Center</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Review reports, enforce rules, and maintain content quality
            </p>
          </motion.div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span className="text-xs text-zinc-500">
                {reports.length} {tab === "pending" ? "Active" : "Archived"}
              </span>
            </div>

            <div className="flex bg-white/[0.02] p-1 rounded-lg border border-white/10">
              {["pending", "resolved"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-5 py-1.5 text-xs font-medium uppercase tracking-wide rounded-md transition-all duration-200 ${
                    tab === t
                      ? "bg-emerald-500 text-black"
                      : "text-zinc-500 hover:text-white"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-3">
              <div className="w-6 h-6 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
              <span className="text-xs text-zinc-600 uppercase tracking-wider">Loading...</span>
            </div>
          ) : (
            <ReportsTable reports={reports} refresh={fetchReports} />
          )}
        </motion.div>
      </div>
    </div>
  );
}