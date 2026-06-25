"use client";

import { useState, useMemo, useEffect } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, X, Flame, Sparkles, Inbox } from 'lucide-react';
import JobCard from './JobCard';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Sidebar({ initialJobs }) {
  const pathname = usePathname();
  
  // Search input and debounced search state
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [locationFilter, setLocationFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [badgeFilter, setBadgeFilter] = useState('all'); // 'all', 'hot', 'new'

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // SWR Dynamic Data Fetching for job sidebar list
  const { data: filteredJobs = [] } = useSWR(
    `/api/jobs?search=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(locationFilter)}&category=${encodeURIComponent(categoryFilter)}&badge=${encodeURIComponent(badgeFilter)}`,
    fetcher,
    {
      fallbackData: initialJobs,
      revalidateOnFocus: false,
    }
  );

  // Extract unique locations and categories dynamically from initial database dump
  const locations = useMemo(() => {
    const set = new Set();
    initialJobs.forEach(job => {
      if (job.locations && job.locations.data) {
        job.locations.data.forEach(loc => {
          if (loc.attributes && loc.attributes.name) {
            set.add(loc.attributes.name);
          }
        });
      }
    });
    return Array.from(set);
  }, [initialJobs]);

  const categories = useMemo(() => {
    const set = new Set();
    initialJobs.forEach(job => {
      if (job.job_types && job.job_types.data) {
        job.job_types.data.forEach(cat => {
          if (cat.attributes && cat.attributes.name) {
            set.add(cat.attributes.name);
          }
        });
      }
    });
    return Array.from(set);
  }, [initialJobs]);

  return (
    <aside className="w-80 md:w-96 flex flex-col border-r border-zinc-200/80 bg-white shrink-0 shadow-3xs h-full">
      {/* Filters Pane */}
      <div className="p-4 border-b border-zinc-200/80 flex flex-col gap-3">
        {/* Search Box */}
        <div className="relative flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-zinc-400 pointer-events-none" />
          <input 
            type="text" 
            placeholder="Search jobs, specifications..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full h-9 pl-9 pr-8 rounded-lg bg-zinc-50 border border-zinc-200 text-xs text-zinc-800 placeholder-zinc-400 outline-none focus:border-zinc-400 focus:bg-white transition"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 p-0.5 rounded-md hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Dropdowns Filters */}
        <div className="grid grid-cols-2 gap-2">
          <select 
            className="w-full h-8 rounded-md bg-zinc-50 border border-zinc-200 text-[11px] text-zinc-600 px-2 outline-none focus:border-zinc-400 cursor-pointer"
            value={locationFilter}
            onChange={e => setLocationFilter(e.target.value)}
          >
            <option value="all">All Locations</option>
            {locations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>

          <select 
            className="w-full h-8 rounded-md bg-zinc-50 border border-zinc-200 text-[11px] text-zinc-600 px-2 outline-none focus:border-zinc-400 cursor-pointer"
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Badge Quick Filters */}
        <div className="flex items-center gap-1.5 mt-1 border-t border-zinc-100 pt-3">
          <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider mr-1">Filter:</span>
          <button 
            className={`px-3 py-1 rounded-full text-[10px] font-semibold border transition ${
              badgeFilter === 'all' 
                ? 'bg-zinc-900 text-white border-zinc-900' 
                : 'bg-transparent text-zinc-500 border-zinc-200 hover:border-zinc-300 hover:text-zinc-700'
            }`}
            onClick={() => setBadgeFilter('all')}
          >
            All
          </button>
          <button 
            className={`px-3 py-1 rounded-full text-[10px] font-semibold border flex items-center gap-1 transition ${
              badgeFilter === 'hot' 
                ? 'bg-rose-50 text-rose-700 border-rose-200 shadow-3xs' 
                : 'bg-transparent text-zinc-500 border-zinc-200 hover:border-zinc-300 hover:text-zinc-700'
            }`}
            onClick={() => setBadgeFilter('hot')}
          >
            <Flame className="h-3 w-3" /> Hot
          </button>
          <button 
            className={`px-3 py-1 rounded-full text-[10px] font-semibold border flex items-center gap-1 transition ${
              badgeFilter === 'new' 
                ? 'bg-amber-50 text-amber-700 border-amber-200 shadow-3xs' 
                : 'bg-transparent text-zinc-500 border-zinc-200 hover:border-zinc-300 hover:text-zinc-700'
            }`}
            onClick={() => setBadgeFilter('new')}
          >
            <Sparkles className="h-3 w-3" /> New
          </button>
        </div>
      </div>

      {/* Job List Scroll */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-[#fafafa]">
        {filteredJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center gap-2">
            <Inbox className="h-8 w-8 text-zinc-300" />
            <p className="text-xs font-semibold text-zinc-400">No jobs found</p>
            <p className="text-[10px] text-zinc-500">Try adjusting your filters</p>
          </div>
        ) : (
          filteredJobs.map(job => {
            const isActive = pathname.startsWith(`/jobs/${job.id_job}`);
            return (
              <Link href={`/jobs/${job.id_job}`} key={job.id_job} className="block">
                <JobCard 
                  job={job}
                  isActive={isActive}
                />
              </Link>
            );
          })
        )}
      </div>
    </aside>
  );
}
