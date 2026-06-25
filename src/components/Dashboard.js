"use client";

import { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Calendar, 
  Users, 
  Mail, 
  Phone, 
  ExternalLink, 
  FileText, 
  X, 
  Flame, 
  Sparkles,
  TrendingUp,
  Inbox,
  ArrowUpRight,
  Shield,
  FileCheck
} from 'lucide-react';

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
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-zinc-950 font-sans antialiased text-zinc-100 selection:bg-orange-500/30 selection:text-orange-400">
      
      {/* Header */}
      <header className="flex h-16 items-center justify-between border-b border-zinc-900 bg-zinc-950/80 px-6 backdrop-blur-md z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-600 font-extrabold text-white text-lg tracking-wide shadow-[0_0_15px_rgba(234,88,12,0.4)]">
            A
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
              Ahamove Careers
              <span className="hidden sm:inline-flex items-center rounded-md bg-zinc-900 px-2 py-0.5 text-[10px] font-medium text-zinc-400 ring-1 ring-inset ring-zinc-800">
                Dashboard v2
              </span>
            </h1>
            <p className="text-[11px] text-zinc-400 hidden sm:block">Real-time CMS Sync & Applicant Pipeline</p>
          </div>
        </div>
        
        {/* Statistics Bar */}
        <div className="flex items-center gap-6 md:gap-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 ring-1 ring-zinc-800">
              <Briefcase className="h-4 w-4 text-zinc-400" />
            </div>
            <div className="text-right">
              <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">Total Jobs</p>
              <p className="text-sm font-bold text-white leading-none mt-0.5">{totalJobsCount}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-950/30 ring-1 ring-rose-900/30">
              <Flame className="h-4 w-4 text-rose-500" />
            </div>
            <div className="text-right">
              <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">Hot Openings</p>
              <p className="text-sm font-bold text-rose-500 leading-none mt-0.5">{hotJobsCount}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-950/30 ring-1 ring-emerald-900/30">
              <Users className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="text-right">
              <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">Applicants</p>
              <p className="text-sm font-bold text-emerald-400 leading-none mt-0.5">{totalApplicantsCount}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        
        {/* Left Sidebar - Job list */}
        <aside className="w-80 md:w-96 flex flex-col border-r border-zinc-900 bg-zinc-950 shrink-0">
          
          {/* Filters Pane */}
          <div className="p-4 border-b border-zinc-900 flex flex-col gap-3 bg-zinc-950/50">
            {/* Search Box */}
            <div className="relative flex items-center">
              <Search className="absolute left-3 h-4 w-4 text-zinc-500 pointer-events-none" />
              <input 
                type="text" 
                placeholder="Search jobs, requirements..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-8 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 transition"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 p-0.5 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Dropdowns Filters */}
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <select 
                  className="w-full h-8 rounded-md bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300 px-2 outline-none focus:border-orange-500 cursor-pointer appearance-none"
                  value={locationFilter}
                  onChange={e => setLocationFilter(e.target.value)}
                >
                  <option value="all">📍 All Locations</option>
                  {locations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <select 
                  className="w-full h-8 rounded-md bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300 px-2 outline-none focus:border-orange-500 cursor-pointer appearance-none"
                  value={categoryFilter}
                  onChange={e => setCategoryFilter(e.target.value)}
                >
                  <option value="all">📂 All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Badge Quick Filters */}
            <div className="flex items-center gap-1.5 mt-1 border-t border-zinc-900/60 pt-3">
              <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mr-1.5">Filter:</span>
              <button 
                className={`px-3 py-1 rounded-full text-[10px] font-medium border transition ${
                  badgeFilter === 'all' 
                    ? 'bg-zinc-100 text-zinc-900 border-zinc-100' 
                    : 'bg-transparent text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
                }`}
                onClick={() => setBadgeFilter('all')}
              >
                All
              </button>
              <button 
                className={`px-3 py-1 rounded-full text-[10px] font-medium border flex items-center gap-1 transition ${
                  badgeFilter === 'hot' 
                    ? 'bg-rose-950/40 text-rose-400 border-rose-800/50 shadow-sm' 
                    : 'bg-transparent text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
                }`}
                onClick={() => setBadgeFilter('hot')}
              >
                <Flame className="h-3 w-3" /> Hot
              </button>
              <button 
                className={`px-3 py-1 rounded-full text-[10px] font-medium border flex items-center gap-1 transition ${
                  badgeFilter === 'new' 
                    ? 'bg-amber-950/40 text-amber-400 border-amber-800/50 shadow-sm' 
                    : 'bg-transparent text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
                }`}
                onClick={() => setBadgeFilter('new')}
              >
                <Sparkles className="h-3 w-3" /> New
              </button>
            </div>
          </div>

          {/* Job List Scroll */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-zinc-950/20">
            {filteredJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center gap-2">
                <Inbox className="h-8 w-8 text-zinc-700" />
                <p className="text-xs font-semibold text-zinc-400">No jobs found</p>
                <p className="text-[10px] text-zinc-500">Try adjusting your filters or query</p>
              </div>
            ) : (
              filteredJobs.map(job => {
                const appCount = job.job_applications?.length || 0;
                const locNames = job.locations?.data?.map(l => l.attributes?.name).join(', ') || 'N/A';
                const isActive = displayJob?.id_job === job.id_job;
                
                return (
                  <div 
                    key={job.id_job} 
                    className={`group relative flex flex-col gap-2 rounded-xl p-3.5 border transition cursor-pointer select-none ${
                      isActive 
                        ? 'bg-zinc-900 border-zinc-800 ring-1 ring-orange-500/25' 
                        : 'bg-zinc-950 border-zinc-900/60 hover:bg-zinc-900/40 hover:border-zinc-800'
                    }`}
                    onClick={() => {
                      setSelectedJobId(job.id_job);
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h4 className={`text-xs font-semibold leading-relaxed transition ${
                        isActive ? 'text-white' : 'text-zinc-200 group-hover:text-white'
                      }`}>
                        {job.title}
                      </h4>
                      <div className="flex items-center gap-1 shrink-0">
                        {job.is_hot && (
                          <span className="inline-flex items-center rounded-md bg-rose-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-rose-500 border border-rose-500/10">
                            HOT
                          </span>
                        )}
                        {job.is_new && (
                          <span className="inline-flex items-center rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-500 border border-amber-500/10">
                            NEW
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-[11px] text-zinc-400">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-zinc-500" />
                        <span>{locNames}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition ${
                        isActive ? 'bg-orange-500/10 text-orange-400' : 'bg-zinc-900/80 text-zinc-400 group-hover:text-zinc-300'
                      }`}>
                        {appCount} {appCount === 1 ? 'App' : 'Apps'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* Right Details Pane */}
        <main className="flex-1 flex flex-col bg-zinc-900/30 overflow-hidden">
          {displayJob ? (
            <>
              {/* Job Header */}
              <div className="p-6 bg-zinc-950/30 border-b border-zinc-900 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold tracking-tight text-white">{displayJob.title}</h2>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/50">
                      ID: {displayJob.id_job}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                    {displayJob.salary && (
                      <span className="inline-flex items-center gap-1 font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/10 px-2.5 py-0.5 rounded-md">
                        💰 {displayJob.salary}
                      </span>
                    )}
                    {displayJob.job_types?.data?.map(t => (
                      <span key={t.id} className="inline-flex items-center gap-1 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-md text-zinc-300">
                        📂 {t.attributes?.name}
                      </span>
                    ))}
                    {displayJob.locations?.data?.map(l => (
                      <span key={l.id} className="inline-flex items-center gap-1 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-md text-zinc-300">
                        📍 {l.attributes?.name}
                      </span>
                    ))}
                    {displayJob.expiry_date_of_application && (
                      <span className="inline-flex items-center gap-1 border border-rose-900/30 bg-rose-500/5 text-rose-400 px-2 py-0.5 rounded-md">
                        📅 Expiry: {displayJob.expiry_date_of_application}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {displayJob.application_email && (
                    <a 
                      href={`mailto:${displayJob.application_email}`}
                      className="inline-flex h-9 items-center gap-2 px-3.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-xs font-bold text-white shadow-lg shadow-orange-600/10 transition"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      Contact Hiring
                    </a>
                  )}
                </div>
              </div>

              {/* Tabs Switcher */}
              <div className="flex border-b border-zinc-900 bg-zinc-950/10 px-6 shrink-0">
                <button 
                  className={`py-3.5 text-xs font-semibold border-b-2 transition relative mr-8 ${
                    activeTab === 'info' 
                      ? 'text-orange-500 border-orange-500' 
                      : 'text-zinc-400 border-transparent hover:text-zinc-200'
                  }`}
                  onClick={() => setActiveTab('info')}
                >
                  Job Specifications
                </button>
                <button 
                  className={`py-3.5 text-xs font-semibold border-b-2 transition relative ${
                    activeTab === 'applicants' 
                      ? 'text-orange-500 border-orange-500' 
                      : 'text-zinc-400 border-transparent hover:text-zinc-200'
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
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    
                    {/* Rich text columns */}
                    <div className="lg:col-span-2 space-y-6">
                      {displayJob.job_description && (
                        <div className="bg-zinc-950/20 border border-zinc-900/60 rounded-xl p-5 space-y-3">
                          <h3 className="text-sm font-bold text-white border-l-2 border-orange-500 pl-3">Job Description</h3>
                          <div 
                            className="html-render text-zinc-300 text-xs"
                            dangerouslySetInnerHTML={{ __html: displayJob.job_description }}
                          />
                        </div>
                      )}

                      {displayJob.job_requirement && (
                        <div className="bg-zinc-950/20 border border-zinc-900/60 rounded-xl p-5 space-y-3">
                          <h3 className="text-sm font-bold text-white border-l-2 border-orange-500 pl-3">Job Requirements</h3>
                          <div 
                            className="html-render text-zinc-300 text-xs"
                            dangerouslySetInnerHTML={{ __html: displayJob.job_requirement }}
                          />
                        </div>
                      )}

                      {displayJob.benefit && (
                        <div className="bg-zinc-950/20 border border-zinc-900/60 rounded-xl p-5 space-y-3">
                          <h3 className="text-sm font-bold text-white border-l-2 border-orange-500 pl-3">Benefits & Perks</h3>
                          <div 
                            className="html-render text-zinc-300 text-xs"
                            dangerouslySetInnerHTML={{ __html: displayJob.benefit }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Metadata Widget Panel */}
                    <div className="space-y-4">
                      <div className="bg-zinc-900 border border-zinc-800/80 rounded-xl p-5 space-y-4">
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Position Summary</h4>
                        
                        <div className="space-y-3">
                          <div className="flex flex-col border-b border-zinc-800/60 pb-3">
                            <span className="text-[10px] text-zinc-500">Contact Email</span>
                            <span className="text-xs font-semibold text-zinc-200 mt-0.5 break-all">{displayJob.application_email || 'N/A'}</span>
                          </div>

                          {displayJob.secondary_email_for_applications && (
                            <div className="flex flex-col border-b border-zinc-800/60 pb-3">
                              <span className="text-[10px] text-zinc-500">Secondary Email</span>
                              <span className="text-xs font-semibold text-zinc-200 mt-0.5 break-all">{displayJob.secondary_email_for_applications}</span>
                            </div>
                          )}

                          <div className="flex flex-col border-b border-zinc-800/60 pb-3">
                            <span className="text-[10px] text-zinc-500">Published Date</span>
                            <span className="text-xs font-semibold text-zinc-200 mt-0.5">
                              {displayJob.publishedAt ? new Date(displayJob.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                            </span>
                          </div>

                          <div className="flex flex-col border-b border-zinc-800/60 pb-3">
                            <span className="text-[10px] text-zinc-500">Last Synced (crawled)</span>
                            <span className="text-xs font-semibold text-zinc-200 mt-0.5">{displayJob.crawled_at || 'N/A'}</span>
                          </div>

                          <div className="flex flex-col pb-1">
                            <span className="text-[10px] text-zinc-500">View Count</span>
                            <span className="text-xs font-semibold text-zinc-200 mt-0.5">{displayJob.views || '0'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                )}

                {/* Applicants Tab */}
                {activeTab === 'applicants' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-zinc-200">
                        Total Applications Pipeline: <span className="text-orange-500 font-bold">{displayJob.job_applications?.length || 0}</span>
                      </h3>
                    </div>

                    {(!displayJob.job_applications || displayJob.job_applications.length === 0) ? (
                      <div className="flex flex-col items-center justify-center p-12 border border-dashed border-zinc-800 rounded-xl bg-zinc-950/10 text-center gap-3">
                        <Users className="h-10 w-10 text-zinc-700" />
                        <h4 className="text-sm font-semibold text-zinc-400">No applicants registered</h4>
                        <p className="text-xs text-zinc-500">New CVs submitted through CMS will populate here.</p>
                      </div>
                    ) : (
                      <div className="border border-zinc-900 rounded-xl bg-zinc-950/20 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse text-left text-xs">
                            <thead>
                              <tr className="border-b border-zinc-900 bg-zinc-950/40 text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">
                                <th className="p-4">Applicant</th>
                                <th className="p-4">Contact Info</th>
                                <th className="p-4">Applied Date</th>
                                <th className="p-4">Status & Source</th>
                                <th className="p-4 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-900/60">
                              {displayJob.job_applications.map(app => (
                                <tr key={app.application_id} className="hover:bg-zinc-900/20 transition">
                                  <td className="p-4 font-semibold text-white">
                                    <div className="flex flex-col gap-0.5">
                                      <span>{app.name}</span>
                                      <span className="text-[10px] font-mono text-zinc-500 font-normal">ID: {app.application_id}</span>
                                    </div>
                                  </td>
                                  <td className="p-4">
                                    <div className="flex flex-col gap-1 text-zinc-300 text-[11px]">
                                      <span className="flex items-center gap-1.5">
                                        <Phone className="h-3 w-3 text-zinc-500" /> {app.phone_number || 'N/A'}
                                      </span>
                                      <span className="flex items-center gap-1.5 text-zinc-400">
                                        <Mail className="h-3 w-3 text-zinc-500" /> {app.email}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="p-4 text-zinc-300">
                                    <div className="flex items-center gap-1.5">
                                      <Calendar className="h-3.5 w-3.5 text-zinc-500" />
                                      <span>
                                        {app.applied_date ? new Date(app.applied_date).toLocaleDateString('en-GB') : 'N/A'}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="p-4">
                                    <div className="flex flex-col gap-1 items-start">
                                      <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold border ${
                                        app.status === 'Lọc CV' 
                                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/10' 
                                          : app.status === 'Đạt' 
                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/10'
                                            : app.status === 'Không đạt'
                                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/10'
                                              : 'bg-amber-500/10 text-amber-400 border-amber-500/10'
                                      }`}>
                                        {app.status || 'N/A'}
                                      </span>
                                      <span className="text-[10px] text-zinc-500 font-medium">
                                        via {app.relative || 'Direct'}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="p-4 text-right">
                                    {app.cv_url ? (
                                      <a 
                                        href={app.cv_url} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="inline-flex h-8 items-center gap-1.5 px-3 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900/50 hover:bg-zinc-900 text-[11px] font-semibold text-zinc-200 transition"
                                      >
                                        <FileText className="h-3.5 w-3.5" />
                                        Resume
                                        <ArrowUpRight className="h-3 w-3 opacity-60" />
                                      </a>
                                    ) : (
                                      <span className="text-[11px] text-zinc-600">No Resume</span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-16 text-center gap-3 h-full">
              <Briefcase className="h-10 w-10 text-zinc-850" />
              <h4 className="text-sm font-semibold text-zinc-400">Select an opening position</h4>
              <p className="text-xs text-zinc-500 max-w-xs">Select one of the crawled job listings from the sidebar to inspect statistics and applicant records.</p>
            </div>
          )}
        </main>

      </div>
    </div>
  );
}
