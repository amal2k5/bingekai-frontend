import api from "../../../api/api";
import { useState } from "react";
import UserDetailModal from "./UsersInfoModal";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { User, ShieldCheck, ShieldAlert, Calendar, Eye, Loader2 } from "lucide-react";

export default function UserTable({ users, refresh }) {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const handleAction = async (id, isActive) => {
    setActionLoading(id);
    const action = isActive ? "deactivate" : "activate";
    const loadingToast = toast.loading(`Processing ${action}...`);
    
    try {
      await api.patch(`/admin/users/${id}/${action}/`);
      await refresh();
      toast.success(`User ${action}d successfully`, { id: loadingToast });
    } catch (err) {
      toast.error(`Failed to ${action} user`, { id: loadingToast });
    } finally {
      setActionLoading(null);
    }
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
      <div className="relative overflow-hidden bg-[#0a0a0a] rounded-2xl border border-white/[0.05] shadow-2xl">
        {/* Subtle Ambient Background Glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/[0.05] bg-white/[0.01]">
                <th className="px-6 py-4 text-left">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500">Member</span>
                </th>
                <th className="px-6 py-4 text-left">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500">Authorization</span>
                </th>
                <th className="px-6 py-4 text-left">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500">Joined Date</span>
                </th>
                <th className="px-6 py-4 text-right">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500">Operations</span>
                </th>
              </tr>
            </thead>
            
            <motion.tbody 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="divide-y divide-white/[0.03]"
            >
              {users.map((user) => (
                <motion.tr
                  key={user.id}
                  variants={itemVariants}
                  className="group hover:bg-white/[0.02] transition-colors cursor-default"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative flex-shrink-0">
                        <div className="w-10 h-10 rounded-4xl bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 flex items-center justify-center shadow-inner">
                          <span className="text-sm font-semibold text-gray-200">
                            {user.email.charAt(0).toUpperCase()}
                          </span>
                        </div>

                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium text-gray-100 truncate">{user.email}</span>

                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border shadow-sm ${
                      user.is_active 
                      ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-400" 
                      : "bg-orange-500/5 border-orange-500/10 text-orange-400"
                    }`}>
                      {user.is_active ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />}
                      <span className="text-[11px] font-semibold uppercase tracking-wider">
                        {user.is_active ? "Authorized" : "Suspended"}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Calendar size={14} className="opacity-50" />
                      <span className="text-sm tabular-nums tracking-tight">
                        {new Date(user.created_at).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric'
                        })}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedUserId(user.id)}
                        className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      
                      <button
                        onClick={() => handleAction(user.id, user.is_active)}
                        disabled={actionLoading === user.id}
                        className={`min-w-[100px] flex items-center justify-center px-3 py-1.5 rounded-lg border text-[11px] font-semibold uppercase tracking-widest transition-all ${
                          user.is_active 
                          ? "border-rose-500/20 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/40" 
                          : "border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/40"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {actionLoading === user.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          user.is_active ? "Suspend" : "Activate"
                        )}
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>

        <AnimatePresence>
          {users.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-32 bg-white/[0.01]"
            >
              <div className="p-4 rounded-full bg-white/[0.02] border border-white/[0.05] mb-4">
                <User size={32} className="text-gray-700" />
              </div>
              <p className="text-xs uppercase tracking-[0.3em] font-bold text-gray-600">Archive Empty</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {selectedUserId && (
        <UserDetailModal
          userId={selectedUserId}
          onClose={() => setSelectedUserId(null)}
        />
      )}
    </>
  );
}