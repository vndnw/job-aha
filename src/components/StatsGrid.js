"use client";

import { Briefcase, Flame, Users, Sparkles } from 'lucide-react';

export default function StatsGrid({ totalJobs, hotJobs, totalApplicants, newJobs }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Jobs */}
      <div className="bg-white border border-zinc-200/80 rounded-xl p-4 shadow-xs flex items-center justify-between group hover:border-zinc-300 transition">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Total Openings</p>
          <p className="text-xl font-extrabold text-zinc-900 mt-1 leading-none">{totalJobs}</p>
        </div>
        <div className="h-10 w-10 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-500 group-hover:bg-zinc-100/50 transition">
          <Briefcase className="h-5 w-5" />
        </div>
      </div>

      {/* Hot Jobs */}
      <div className="bg-white border border-zinc-200/80 rounded-xl p-4 shadow-xs flex items-center justify-between group hover:border-zinc-300 transition">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Urgent Roles</p>
          <p className="text-xl font-extrabold text-rose-600 mt-1 leading-none">{hotJobs}</p>
        </div>
        <div className="h-10 w-10 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 group-hover:bg-rose-100/30 transition">
          <Flame className="h-5 w-5" />
        </div>
      </div>

      {/* New Openings */}
      <div className="bg-white border border-zinc-200/80 rounded-xl p-4 shadow-xs flex items-center justify-between group hover:border-zinc-300 transition">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">New Positions</p>
          <p className="text-xl font-extrabold text-indigo-600 mt-1 leading-none">{newJobs}</p>
        </div>
        <div className="h-10 w-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-100/30 transition">
          <Sparkles className="h-5 w-5" />
        </div>
      </div>

      {/* Total Applicants */}
      <div className="bg-white border border-zinc-200/80 rounded-xl p-4 shadow-xs flex items-center justify-between group hover:border-zinc-300 transition">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Total Candidates</p>
          <p className="text-xl font-extrabold text-emerald-600 mt-1 leading-none">{totalApplicants}</p>
        </div>
        <div className="h-10 w-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-100/30 transition">
          <Users className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
