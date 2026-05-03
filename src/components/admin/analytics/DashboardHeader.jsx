import React from "react";

export default function DashboardHeader({ days, setDays, data }) {
  const options = [7, 30, 90];

  return (
    <div className="space-y-8 mb-10">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-light tracking-tight text-white">
            Control<span className="font-medium text-emerald-500">Center</span>
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Monitor platform activity and user engagement
          </p>
        </div>
      </div>

      {/* Stats Grid */}
<div className="space-y-6">

  {/* Summary Stats Grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

    <StatCard 
      label="Total Users" 
      value={data?.growth?.total_users?.toLocaleString() ?? 0} 
      color="bg-emerald-500"
    />

    <StatCard 
      label="Active Users" 
      value={data?.growth?.active_users?.toLocaleString() ?? 0} 
      color="bg-green-500"
    />

    <StatCard 
      label="Suspended Users" 
      value={data?.growth?.suspended_users?.toLocaleString() ?? 0} 
      color="bg-red-500"
    />

    <StatCard 
      label="Engagement" 
      value={`${data?.engagement?.engagement_rate_percentage ?? 0}%`} 
      color="bg-blue-500"
    />

    <StatCard 
      label="Total Reviews" 
      value={data?.content_quality?.total_reviews?.toLocaleString() ?? 0} 
      color="bg-emerald-500"
    />

  </div>
</div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="bg-white/[0.02] border border-white/10 rounded-xl p-5 transition-all duration-200 hover:border-white/20">
      <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-2">
        {label}
      </p>
      <div className="flex items-baseline justify-between">
        <h3 className="text-2xl font-light text-white tracking-tight">
          {value}
        </h3>
        <div className={`w-8 h-[2px] ${color} rounded-full opacity-50`}></div>
      </div>
    </div>
  );
}