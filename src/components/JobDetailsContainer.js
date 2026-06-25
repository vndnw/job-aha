"use client";

import { useState, useEffect, useTransition } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Calendar, Coins, FolderOpen, MapPin, Search, X, ArrowLeft } from 'lucide-react';
import StatsGrid from './StatsGrid';
import JobDetails from './JobDetails';
import ApplicantsList from './ApplicantsList';

export default function JobDetailsContainer({ 
  job, 
  totalJobsCount, 
  hotJobsCount, 
  newJobsCount, 
  totalApplicantsCount,
  jobApplicantsCount,
  paginatedApplicants,
  currentPage,
  totalPages,
  filteredTotal,
  initialSearch,
  limit
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get('tab');
  
  const [activeTab, setActiveTab] = useState(tabParam === 'applicants' ? 'applicants' : 'info');
  const [searchTerm, setSearchTerm] = useState(initialSearch || '');
  const [isPending, startTransition] = useTransition();

  // Sync activeTab when query param changes
  useEffect(() => {
    if (tabParam === 'applicants') {
      setActiveTab('applicants');
    } else if (tabParam === 'info') {
      setActiveTab('info');
    }
  }, [tabParam]);

  // Debounce candidate search input
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm !== (initialSearch || '')) {
        startTransition(() => {
          router.push(`/jobs/${job.id_job}?tab=applicants&page=1&search=${encodeURIComponent(searchTerm)}&limit=${limit}`);
        });
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm, router, job.id_job, initialSearch, limit]);

  // Reset applicant search filter when job changes
  useEffect(() => {
    setSearchTerm('');
  }, [job.id_job]);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    startTransition(() => {
      router.push(`/jobs/${job.id_job}?tab=${tabName}&page=1&search=${encodeURIComponent(searchTerm)}&limit=${limit}`);
    });
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    startTransition(() => {
      router.push(`/jobs/${job.id_job}?tab=applicants&page=1&search=&limit=${limit}`);
    });
  };

  const handlePageChange = (pageNum) => {
    if (pageNum === currentPage) return;
    startTransition(() => {
      router.push(`/jobs/${job.id_job}?tab=applicants&page=${pageNum}&search=${encodeURIComponent(searchTerm)}&limit=${limit}`);
    });
  };

  const handleLimitChange = (newLimit) => {
    startTransition(() => {
      router.push(`/jobs/${job.id_job}?tab=applicants&page=1&search=${encodeURIComponent(searchTerm)}&limit=${newLimit}`);
    });
  };

  return (
    <>
      {/* Stats Grid at the top */}
      <div className="p-4 sm:p-6 pb-2 shrink-0">
        {/* Back to Jobs button for Mobile/Tablet */}
        <div className="lg:hidden mb-4">
          <Link 
            href="/jobs" 
            className="inline-flex h-8 items-center gap-1.5 px-3 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-xs font-bold text-zinc-600 transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Jobs List
          </Link>
        </div>

        <StatsGrid 
          totalJobs={totalJobsCount}
          hotJobs={hotJobsCount}
          totalApplicants={totalApplicantsCount}
          newJobs={newJobsCount}
        />
      </div>

      {/* Job Header */}
      <div className="px-4 sm:px-6 py-4 bg-white border-y border-zinc-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 shadow-3xs">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base font-bold tracking-tight text-zinc-900">{job.title}</h2>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-100 text-zinc-500 border border-zinc-200">
              ID: {job.id_job}
            </span>
          </div>
          
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-zinc-500">
            {job.salary && (
              <span className="inline-flex items-center gap-1 font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
                <Coins className="h-3.5 w-3.5 text-emerald-600" />
                {job.salary}
              </span>
            )}
            {job.job_types?.data?.map(t => (
              <span key={t.id} className="inline-flex items-center gap-1 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded-md text-zinc-600">
                <FolderOpen className="h-3.5 w-3.5 text-zinc-400" />
                {t.attributes?.name}
              </span>
            ))}
            {job.locations?.data?.map(l => (
              <span key={l.id} className="inline-flex items-center gap-1 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded-md text-zinc-600">
                <MapPin className="h-3.5 w-3.5 text-zinc-400" />
                {l.attributes?.name}
              </span>
            ))}
            {job.expiry_date_of_application && (
              <span className="inline-flex items-center gap-1 border border-rose-100 bg-rose-50 text-rose-600 px-2 py-0.5 rounded-md font-medium">
                <Calendar className="h-3.5 w-3.5 text-rose-500" />
                Expiry: {job.expiry_date_of_application}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {job.application_email && (
            <a 
              href={`mailto:${job.application_email}`}
              className="inline-flex h-8 items-center gap-2 px-3.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white shadow-xs transition"
            >
              <Mail className="h-3.5 w-3.5" />
              Contact Hiring
            </a>
          )}
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-zinc-200/80 bg-white px-4 sm:px-6 shrink-0">
        <button 
          className={`py-3 text-xs font-bold border-b-2 transition relative mr-8 ${
            activeTab === 'info' 
              ? 'text-indigo-600 border-indigo-600' 
              : 'text-zinc-400 border-transparent hover:text-zinc-600'
          }`}
          onClick={() => handleTabChange('info')}
        >
          Job Specifications
        </button>
        <button 
          className={`py-3 text-xs font-bold border-b-2 transition relative ${
            activeTab === 'applicants' 
              ? 'text-indigo-600 border-indigo-600' 
              : 'text-zinc-400 border-transparent hover:text-zinc-600'
          }`}
          onClick={() => handleTabChange('applicants')}
        >
          Applicants ({jobApplicantsCount})
        </button>
      </div>

      {/* Content Panel Scroll */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 min-h-0">
        
        {/* Specifications Tab */}
        {activeTab === 'info' && (
          <JobDetails job={job} />
        )}

        {/* Applicants Tab */}
        {activeTab === 'applicants' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white border border-zinc-200/80 rounded-xl p-4 shadow-3xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Applications: <span className="text-zinc-900 font-extrabold">{filteredTotal}</span> / {jobApplicantsCount} total
              </h3>
              
              {/* Search box for applicants */}
              <div className="relative flex items-center w-full sm:w-64">
                <Search className="absolute left-2.5 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
                <input 
                  type="text" 
                  placeholder="Search candidate name, email, phone..." 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full h-8 pl-8 pr-7 rounded-md bg-zinc-50 border border-zinc-200 text-xs text-zinc-800 placeholder-zinc-400 outline-none focus:border-zinc-400 focus:bg-white transition"
                />
                {searchTerm && (
                  <button 
                    onClick={handleClearSearch}
                    className="absolute right-2 p-0.5 rounded-md hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
            
            <ApplicantsList 
              applications={paginatedApplicants} 
              jobId={job.id_job}
              isFiltered={!!searchTerm}
              currentPage={currentPage}
              totalPages={totalPages}
              filteredTotal={filteredTotal}
              isPending={isPending}
              onPageChange={handlePageChange}
              limit={limit}
              onLimitChange={handleLimitChange}
            />
          </div>
        )}

      </div>
    </>
  );
}
