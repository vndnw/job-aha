"use client";

import { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Calendar, 
  Users, 
  X, 
  Flame, 
  Sparkles,
  Mail,
  Inbox
} from 'lucide-react';
import StatsGrid from './StatsGrid';
import JobCard from './JobCard';
import JobDetails from './JobDetails';
import ApplicantsList from './ApplicantsList';

export default function Dashboard({ initialJobs }) {
  const [selectedJobId, setSelectedJobId] = useState(initialJobs[0]?.id_job || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [badgeFilter, setBadgeFilter] = useState('all'); // 'all', 'hot', 'new'
  const [activeTab, setActiveTab] = useState('info'); // 'info', 'applicants'

  // Extract unique locations and categories for filters dynamically
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

  // Filter jobs based on search query, locations, categories, and badges
  const filteredJobs = useMemo(() => {
    return initialJobs.filter(job => {
      // 1. Search Query
      const matchSearch = 
        !searchQuery ||
        job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.id_job?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.job_description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.job_requirement?.toLowerCase().includes(searchQuery.toLowerCase());

      // 2. Location
      let matchLocation = true;
      if (locationFilter !== 'all') {
        matchLocation = job.locations?.data?.some(
          loc => loc.attributes?.name === locationFilter
        );
      }

      // 3. Category
      let matchCategory = true;
      if (categoryFilter !== 'all') {
        matchCategory = job.job_types?.data?.some(
          cat => cat.attributes?.name === categoryFilter
        );
      }

      // 4. Badges (Hot / New)
      let matchBadge = true;
      if (badgeFilter === 'hot') {
        matchBadge = job.is_hot === true;
      } else if (badgeFilter === 'new') {
        matchBadge = job.is_new === true;
      }

      return matchSearch && matchLocation && matchCategory && matchBadge;
    });
  }, [initialJobs, searchQuery, locationFilter, categoryFilter, badgeFilter]);

  // Selected job details
  const displayJob = useMemo(() => {
    return initialJobs.find(job => job.id_job === selectedJobId) || filteredJobs[0] || null;
  }, [initialJobs, selectedJobId, filteredJobs]);

  // Stats calculation
  const totalJobsCount = initialJobs.length;
  const totalApplicantsCount = useMemo(() => {
    return initialJobs.reduce((acc, job) => acc + (job.job_applications?.length || 0), 0);
  }, [initialJobs]);

  const hotJobsCount = useMemo(() => {
    return initialJobs.filter(job => job.is_hot).length;
  }, [initialJobs]);

  const newJobsCount = useMemo(() => {
    return initialJobs.filter(job => job.is_new).length;
  }, [initialJobs]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#fafafa] font-sans antialiased text-zinc-800">
      
      {/* Header */}
      <header className="flex h-16 items-center justify-between border-b border-zinc-200/80 bg-white px-6 shrink-0 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 font-extrabold text-white text-lg tracking-wide shadow-xs">
            A
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-zinc-900 flex items-center gap-1.5">
              Ahamove Careers
              <span className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-500 ring-1 ring-inset ring-zinc-200">
                Dashboard
              </span>
            </h1>
            <p className="text-[10px] text-zinc-400">Recruiter Console & Candidate Tracker</p>
          </div>
        </div>
        
        {/* Info label */}
        <div className="hidden md:flex items-center gap-2 text-xs text-zinc-400">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Synced with Strapi API</span>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        
        {/* Left Sidebar - Job list */}
        <aside className="w-80 md:w-96 flex flex-col border-r border-zinc-200/80 bg-white shrink-0 shadow-3xs">
          
          {/* Filters Pane */}
          <div className="p-4 border-b border-zinc-200/80 flex flex-col gap-3">
            {/* Search Box */}
            <div className="relative flex items-center">
              <Search className="absolute left-3 h-4 w-4 text-zinc-400 pointer-events-none" />
              <input 
                type="text" 
                placeholder="Search jobs, specifications..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-8 rounded-lg bg-zinc-50 border border-zinc-200 text-xs text-zinc-800 placeholder-zinc-400 outline-none focus:border-zinc-400 focus:bg-white transition"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
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
                <option value="all">📍 All Locations</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>

              <select 
                className="w-full h-8 rounded-md bg-zinc-50 border border-zinc-200 text-[11px] text-zinc-600 px-2 outline-none focus:border-zinc-400 cursor-pointer"
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
              >
                <option value="all">📂 All Categories</option>
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
              filteredJobs.map(job => (
                <JobCard 
                  key={job.id_job}
                  job={job}
                  isActive={displayJob?.id_job === job.id_job}
                  onClick={() => setSelectedJobId(job.id_job)}
                />
              ))
            )}
          </div>
        </aside>

        {/* Right Details Panel */}
        <main className="flex-1 flex flex-col bg-[#fafafa] overflow-hidden">
          {displayJob ? (
            <>
              {/* Stats Grid at the top */}
              <div className="p-6 pb-2 shrink-0">
                <StatsGrid 
                  totalJobs={totalJobsCount}
                  hotJobs={hotJobsCount}
                  totalApplicants={totalApplicantsCount}
                  newJobs={newJobsCount}
                />
              </div>

              {/* Job Header */}
              <div className="px-6 py-4 bg-white border-y border-zinc-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 shadow-3xs">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base font-bold tracking-tight text-zinc-900">{displayJob.title}</h2>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-100 text-zinc-500 border border-zinc-200">
                      ID: {displayJob.id_job}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-zinc-500">
                    {displayJob.salary && (
                      <span className="inline-flex items-center font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
                        💰 {displayJob.salary}
                      </span>
                    )}
                    {displayJob.job_types?.data?.map(t => (
                      <span key={t.id} className="inline-flex items-center bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded-md text-zinc-600">
                        📂 {t.attributes?.name}
                      </span>
                    ))}
                    {displayJob.locations?.data?.map(l => (
                      <span key={l.id} className="inline-flex items-center bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded-md text-zinc-600">
                        📍 {l.attributes?.name}
                      </span>
                    ))}
                    {displayJob.expiry_date_of_application && (
                      <span className="inline-flex items-center border border-rose-100 bg-rose-50 text-rose-600 px-2 py-0.5 rounded-md font-medium">
                        📅 Expiry: {displayJob.expiry_date_of_application}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {displayJob.application_email && (
                    <a 
                      href={`mailto:${displayJob.application_email}`}
                      className="inline-flex h-8 items-center gap-2 px-3.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white shadow-xs transition"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      Contact Hiring
                    </a>
                  )}
                </div>
              </div>

              {/* Tabs Switcher */}
              <div className="flex border-b border-zinc-200/80 bg-white px-6 shrink-0">
                <button 
                  className={`py-3 text-xs font-bold border-b-2 transition relative mr-8 ${
                    activeTab === 'info' 
                      ? 'text-indigo-600 border-indigo-600' 
                      : 'text-zinc-400 border-transparent hover:text-zinc-600'
                  }`}
                  onClick={() => setActiveTab('info')}
                >
                  Job Specifications
                </button>
                <button 
                  className={`py-3 text-xs font-bold border-b-2 transition relative ${
                    activeTab === 'applicants' 
                      ? 'text-indigo-600 border-indigo-600' 
                      : 'text-zinc-400 border-transparent hover:text-zinc-600'
                  }`}
                  onClick={() => setActiveTab('applicants')}
                >
                  Applicants ({displayJob.job_applications?.length || 0})
                </button>
              </div>

              {/* Content Panel Scroll */}
              <div className="flex-1 overflow-y-auto p-6 min-h-0">
                
                {/* Specifications Tab */}
                {activeTab === 'info' && (
                  <JobDetails job={displayJob} />
                )}

                {/* Applicants Tab */}
                {activeTab === 'applicants' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        Applications Received: <span className="text-zinc-900 font-extrabold">{displayJob.job_applications?.length || 0}</span>
                      </h3>
                    </div>
                    <ApplicantsList applications={displayJob.job_applications} />
                  </div>
                )}

              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-16 text-center gap-3 h-full">
              <Briefcase className="h-10 w-10 text-zinc-300" />
              <h4 className="text-sm font-semibold text-zinc-700">Select an opening position</h4>
              <p className="text-xs text-zinc-500 max-w-xs">Select one of the crawled job listings from the sidebar to inspect statistics and applicant records.</p>
            </div>
          )}
        </main>

      </div>
    </div>
  );
}
