"use client";

import { useState, useMemo, useEffect, useRef } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, X, Flame, Sparkles, Inbox } from 'lucide-react';
import JobCard from './JobCard';
import Skeleton from './Skeleton';

const SidebarJobCardSkeleton = () => (
  <div className="flex flex-col gap-2 rounded-xl p-4 border border-zinc-200/80 bg-white/70 animate-pulse">
    <div className="flex items-start justify-between gap-3">
      <Skeleton className="h-4 w-44 bg-zinc-200" />
      <Skeleton className="h-4 w-10 bg-zinc-200 rounded" />
    </div>
    <div className="flex items-center justify-between mt-1">
      <div className="flex items-center gap-1">
        <Skeleton className="h-3.5 w-3.5 rounded bg-zinc-200" />
        <Skeleton className="h-3 w-20 bg-zinc-200" />
      </div>
      <Skeleton className="h-4 w-12 rounded-full bg-zinc-200" />
    </div>
  </div>
);

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Sidebar({ initialJobs }) {
  const pathname = usePathname();
  
  // Search input and debounced search state
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [locationFilter, setLocationFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [badgeFilter, setBadgeFilter] = useState('all'); // 'all', 'hot', 'new'
  
  // Pagination / Limit State
  const [limit, setLimit] = useState(10);
  const loadMoreRef = useRef(null);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Reset limit when query or filters change
  useEffect(() => {
    setLimit(10);
  }, [searchQuery, locationFilter, categoryFilter, badgeFilter]);

  // SWR Dynamic Data Fetching for job sidebar list with limit
  const { data: filteredJobs = [], isValidating } = useSWR(
    `/api/jobs?search=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(locationFilter)}&category=${encodeURIComponent(categoryFilter)}&badge=${encodeURIComponent(badgeFilter)}&limit=${limit}`,
    fetcher,
    {
      fallbackData: initialJobs.slice(0, limit),
      revalidateOnFocus: false,
    }
  );

  // Set up IntersectionObserver for Infinite Scroll
  useEffect(() => {
    const currentSensor = loadMoreRef.current;
    if (!currentSensor) return;

    const observer = new IntersectionObserver((entries) => {
      const first = entries[0];
      if (first.isIntersecting && filteredJobs.length === limit) {
        setLimit(prev => prev + 10);
      }
    }, {
      root: null,
      threshold: 0.1
    });

    observer.observe(currentSensor);

    return () => {
      if (currentSensor) {
        observer.unobserve(currentSensor);
      }
    };
  }, [filteredJobs.length, limit]);


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

  const isRootJobsPage = pathname === '/jobs';
  const isCandidatesPage = pathname.startsWith('/jobs/candidates');
  const isCandidateDetailsPage = pathname.includes('/candidates/');
  const shouldHideSidebar = isCandidatesPage || isCandidateDetailsPage;

  return (
    <aside className={`flex-col border-r border-zinc-200/80 bg-white shrink-0 shadow-3xs h-full w-full lg:w-96 ${
      shouldHideSidebar ? 'hidden' : (isRootJobsPage ? 'flex' : 'hidden lg:flex')
    }`}>
      {/* Filters Pane */}
      <div className="p-4 border-b border-zinc-200/80 flex flex-col gap-3">
        {/* Search Box */}
        <div className="relative flex items-center">
          {isValidating ? (
            <div className="absolute left-3 pointer-events-none flex items-center justify-center">
              <div className="h-3.5 w-3.5 animate-spin rounded-full border border-indigo-650 border-t-transparent" />
            </div>
          ) : (
            <Search className="absolute left-3 h-4 w-4 text-zinc-400 pointer-events-none" />
          )}
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

      {/* Job List Wrapper Container */}
      <div className="flex-1 relative overflow-hidden flex flex-col min-h-0">
        {/* Job List Scroll */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-[#fafafa]">
          {isValidating && filteredJobs.length === 0 ? (
            <>
              <SidebarJobCardSkeleton />
              <SidebarJobCardSkeleton />
              <SidebarJobCardSkeleton />
            </>
          ) : filteredJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center gap-2">
              <Inbox className="h-8 w-8 text-zinc-300" />
              <p className="text-xs font-semibold text-zinc-400">No jobs found</p>
              <p className="text-[10px] text-zinc-500">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              {filteredJobs.map(job => {
                const isActive = pathname.startsWith(`/jobs/${job.id_job}`);
                return (
                  <Link href={`/jobs/${job.id_job}`} key={job.id_job} className="block">
                    <JobCard 
                      job={job}
                      isActive={isActive}
                    />
                  </Link>
                );
              })}
              
              {filteredJobs.length > 0 && filteredJobs.length === limit && (
                <div ref={loadMoreRef} className="h-4 w-full" />
              )}
            </>
          )}
        </div>

        {/* Large Loading Overlay when validating - covers only the list viewport */}
        {isValidating && (
          <div className="absolute inset-0 bg-[#fafafa]/70 backdrop-blur-[1.5px] flex items-center justify-center z-35 transition-all duration-200">
            <div className="h-8 w-8 animate-spin rounded-full border-3 border-indigo-600 border-t-transparent" />
          </div>
        )}
      </div>
    </aside>
  );
}
