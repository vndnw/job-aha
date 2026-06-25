"use client";

import { MapPin, Flame, Sparkles } from 'lucide-react';

export default function JobCard({ job, isActive, onClick }) {
  const appCount = job.job_applications?.length || 0;
  const locNames = job.locations?.data?.map(l => l.attributes?.name).join(', ') || 'N/A';

  return (
    <div 
      className={`group relative flex flex-col gap-2 rounded-xl p-4 border transition duration-200 cursor-pointer select-none ${
        isActive 
          ? 'bg-zinc-900 border-zinc-950 text-white shadow-sm ring-1 ring-zinc-900' 
          : 'bg-white border-zinc-200/80 hover:bg-zinc-50 hover:border-zinc-300 text-zinc-800'
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3">
        <h4 className={`text-xs font-semibold leading-relaxed transition ${
          isActive ? 'text-white' : 'text-zinc-800 group-hover:text-zinc-900'
        }`}>
          {job.title}
        </h4>
        <div className="flex items-center gap-1 shrink-0">
          {job.is_hot && (
            <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider border ${
              isActive 
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/10' 
                : 'bg-rose-50 text-rose-600 border-rose-100'
            }`}>
              HOT
            </span>
          )}
          {job.is_new && (
            <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider border ${
              isActive 
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/10' 
                : 'bg-amber-50 text-amber-600 border-amber-100'
            }`}>
              NEW
            </span>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-between text-[11px]">
        <div className={`flex items-center gap-1 transition ${
          isActive ? 'text-zinc-400' : 'text-zinc-500 group-hover:text-zinc-600'
        }`}>
          <MapPin className="h-3.5 w-3.5 text-zinc-400" />
          <span>{locNames}</span>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition ${
          isActive 
            ? 'bg-zinc-800 text-zinc-300' 
            : 'bg-zinc-100 text-zinc-600 group-hover:bg-zinc-200/60'
        }`}>
          {appCount} {appCount === 1 ? 'App' : 'Apps'}
        </span>
      </div>
    </div>
  );
}
