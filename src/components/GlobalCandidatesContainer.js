"use client";

import { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, X, Calendar, Mail, Phone, FileText, ArrowUpRight, Inbox, Eye, Briefcase } from 'lucide-react';
import StatsGrid from './StatsGrid';
import Skeleton from './Skeleton';

export default function GlobalCandidatesContainer({ 
  candidates,
  totalJobsCount,
  hotJobsCount,
  newJobsCount,
  totalApplicantsCount,
  filteredTotal,
  currentPage,
  totalPages,
  initialSearch,
  limit
}) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(initialSearch || '');
  const [jumpPage, setJumpPage] = useState('');
  const [isPending, startTransition] = useTransition();

  const itemsPerPage = limit;

  // Debounce search input and update URL parameters
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm !== (initialSearch || '')) {
        startTransition(() => {
          router.push(`/jobs/candidates?search=${encodeURIComponent(searchTerm)}&page=1&limit=${limit}`);
        });
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm, router, initialSearch, limit]);

  const handlePageChange = (pageNum) => {
    if (pageNum === currentPage) return;
    startTransition(() => {
      router.push(`/jobs/candidates?search=${encodeURIComponent(searchTerm)}&page=${pageNum}&limit=${limit}`);
    });
  };

  const handleLimitChange = (newLimit) => {
    startTransition(() => {
      router.push(`/jobs/candidates?search=${encodeURIComponent(searchTerm)}&page=1&limit=${newLimit}`);
    });
  };

  const handleJumpPage = (e) => {
    e.preventDefault();
    const pageNum = parseInt(jumpPage);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      handlePageChange(pageNum);
      setJumpPage('');
    } else if (pageNum > totalPages) {
      handlePageChange(totalPages);
      setJumpPage('');
    } else if (pageNum < 1) {
      handlePageChange(1);
      setJumpPage('');
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    startTransition(() => {
      router.push(`/jobs/candidates?search=&page=1&limit=${limit}`);
    });
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + candidates.length, filteredTotal);

  // Skeleton rows for rendering during pending transitions
  const SkeletonRow = () => (
    <tr className="animate-pulse bg-white/40">
      <td className="p-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-28 bg-zinc-200" />
          <Skeleton className="h-3 w-16 bg-zinc-100" />
        </div>
      </td>
      <td className="p-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-3.5 w-3.5 rounded bg-zinc-200" />
          <Skeleton className="h-4 w-32 bg-zinc-200" />
        </div>
      </td>
      <td className="p-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3.5 w-24 bg-zinc-200" />
          <Skeleton className="h-3 w-32 bg-zinc-100" />
        </div>
      </td>
      <td className="p-4">
        <Skeleton className="h-4 w-20 bg-zinc-200" />
      </td>
      <td className="p-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-16 bg-zinc-200 rounded-md" />
          <Skeleton className="h-3 w-12 bg-zinc-100" />
        </div>
      </td>
      <td className="p-4 text-right">
        <div className="inline-flex gap-2 justify-end w-full">
          <Skeleton className="h-8 w-24 bg-zinc-200 rounded-lg" />
          <Skeleton className="h-8 w-20 bg-zinc-200 rounded-lg" />
        </div>
      </td>
    </tr>
  );

  return (
    <>
      {/* Stats Grid at the top */}
      <div className="p-4 sm:p-6 pb-2 shrink-0">
        <StatsGrid 
          totalJobs={totalJobsCount}
          hotJobs={hotJobsCount}
          totalApplicants={totalApplicantsCount}
          newJobs={newJobsCount}
        />
      </div>

      {/* Global Candidates Header */}
      <div className="px-4 sm:px-6 py-4 bg-white border-y border-zinc-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 shadow-3xs">
        <div className="space-y-1">
          <h2 className="text-base font-bold tracking-tight text-zinc-900">Global Candidate Search</h2>
          <p className="text-xs text-zinc-400">Search and filter candidates across all active hiring campaigns</p>
        </div>
      </div>

      {/* Main Panel Scroll */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 min-h-0 space-y-4">
        
        {/* Search controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white border border-zinc-200/80 rounded-xl p-4 shadow-3xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Total Candidates: <span className="text-zinc-900 font-extrabold">{filteredTotal}</span> / {totalApplicantsCount} global
          </h3>
          
          <div className="relative flex items-center w-full sm:w-80">
            <Search className="absolute left-2.5 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
            <input 
              type="text" 
              placeholder="Search by name, phone, email, status, or job title..." 
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

        {/* Master Table */}
        {!isPending && candidates.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 border border-dashed border-zinc-200 rounded-xl bg-zinc-50/55 text-center gap-3">
            <Inbox className="h-10 w-10 text-zinc-300" />
            <h4 className="text-sm font-semibold text-zinc-800 font-bold">
              {searchTerm ? 'No candidates match your search' : 'No applicants registered globally'}
            </h4>
            <p className="text-xs text-zinc-500 max-w-xs">
              {searchTerm ? 'Try a different search term or clear the filter.' : 'New applications submitted through CMS will populate here.'}
            </p>
          </div>
        ) : (
          <div className="border border-zinc-200/80 rounded-xl bg-white overflow-hidden shadow-xs relative">
            
            {/* Loading Overlay */}
            {isPending && (
              <div className="absolute inset-0 bg-white/20 backdrop-blur-xs flex items-center justify-center z-10" />
            )}

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50/70 text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="p-4">Applicant</th>
                    <th className="p-4">Target Position</th>
                    <th className="p-4">Contact Info</th>
                    <th className="p-4">Applied Date</th>
                    <th className="p-4">Status & Source</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {isPending ? (
                    <>
                      <SkeletonRow />
                      <SkeletonRow />
                      <SkeletonRow />
                      <SkeletonRow />
                      <SkeletonRow />
                    </>
                  ) : (
                    candidates.map(cand => (
                      <tr 
                        key={`${cand.job_id}-${cand.application_id}`} 
                        className="hover:bg-zinc-50/55 transition cursor-pointer group/row animate-fade-in"
                        onClick={() => router.push(`/jobs/${cand.job_id}/candidates/${cand.application_id}?from=global`)}
                      >
                        {/* Applicant details */}
                        <td className="p-4 font-semibold text-zinc-950">
                          <div className="flex flex-col gap-0.5">
                            <Link 
                              href={`/jobs/${cand.job_id}/candidates/${cand.application_id}?from=global`}
                              className="group-hover/row:text-indigo-600 hover:underline transition font-bold"
                              onClick={e => e.stopPropagation()}
                            >
                              {cand.name}
                            </Link>
                            <span className="text-[10px] font-mono text-zinc-400 font-normal">ID: {cand.application_id}</span>
                          </div>
                        </td>

                        {/* Target Position */}
                        <td className="p-4 font-semibold text-zinc-900">
                          <div className="flex items-center gap-1.5 min-w-0 max-w-[200px] text-zinc-800">
                            <Briefcase className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                            <Link 
                              href={`/jobs/${cand.job_id}`}
                              className="hover:text-indigo-600 truncate transition"
                              onClick={e => e.stopPropagation()}
                            >
                              {cand.job_title}
                            </Link>
                          </div>
                        </td>
                        
                        {/* Contact Info */}
                        <td className="p-4">
                          <div className="flex flex-col gap-1 text-zinc-700 text-[11px]">
                            <span className="flex items-center gap-1.5 font-medium">
                              <Phone className="h-3.5 w-3.5 text-zinc-400" /> {cand.phone_number || 'N/A'}
                            </span>
                            <span className="flex items-center gap-1.5 text-zinc-500">
                              <Mail className="h-3.5 w-3.5 text-zinc-400" /> {cand.email}
                            </span>
                          </div>
                        </td>

                        {/* Date */}
                        <td className="p-4 text-zinc-600">
                          <div className="flex items-center gap-1.5 text-[11px]">
                            <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                            <span>
                              {cand.applied_date ? new Date(cand.applied_date).toLocaleDateString('en-GB') : 'N/A'}
                            </span>
                          </div>
                        </td>

                        {/* Status & Source */}
                        <td className="p-4">
                          <div className="flex flex-col gap-1 items-start">
                            <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold border ${
                              cand.status === 'Lọc CV' 
                                ? 'bg-zinc-100 text-zinc-700 border-zinc-200' 
                                : cand.status === 'Đạt' 
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : cand.status === 'Không đạt'
                                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                                    : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                              {cand.status || 'N/A'}
                            </span>
                            <span className="text-[10px] text-zinc-400 font-medium">
                              via {cand.relative || 'Direct'}
                            </span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="p-4 text-right">
                          <div className="inline-flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                            <Link 
                              href={`/jobs/${cand.job_id}/candidates/${cand.application_id}?from=global`}
                              className="inline-flex h-8 items-center gap-1.5 px-3 rounded-lg border border-zinc-200 hover:border-zinc-300 bg-white hover:bg-zinc-50 text-[11px] font-semibold text-zinc-700 transition"
                            >
                              <Eye className="h-3.5 w-3.5 text-zinc-400" />
                              View Profile
                            </Link>
                            {cand.cv_url ? (
                              <a 
                                href={cand.cv_url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="inline-flex h-8 items-center gap-1.5 px-3 rounded-lg border border-zinc-200 hover:border-zinc-300 bg-white hover:bg-zinc-50 text-[11px] font-semibold text-zinc-700 transition"
                              >
                                <FileText className="h-3.5 w-3.5 text-zinc-400" />
                                Resume
                                <ArrowUpRight className="h-3 w-3 opacity-60" />
                              </a>
                            ) : (
                              <span className="text-[11px] text-zinc-400 italic px-2">No Resume</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-200/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shrink-0">
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-xs text-zinc-500 font-medium">
                  Showing <span className="font-bold text-zinc-900">{filteredTotal === 0 ? 0 : startIndex + 1}</span> to{" "}
                  <span className="font-bold text-zinc-900">{endIndex}</span> of{" "}
                  <span className="font-bold text-zinc-900">{filteredTotal}</span> candidates
                </span>
                
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-zinc-400 font-medium">Show:</span>
                  <select
                    value={limit}
                    onChange={(e) => handleLimitChange(parseInt(e.target.value))}
                    disabled={isPending}
                    className="h-7 rounded border border-zinc-200 bg-white text-[11px] font-bold text-zinc-700 px-1.5 outline-none cursor-pointer focus:border-zinc-400"
                  >
                    {[10, 20, 50, 100].map(size => (
                      <option key={size} value={size}>{size} rows</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center flex-wrap gap-3 self-end sm:self-auto">
                {totalPages > 1 && (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                      disabled={currentPage === 1 || isPending}
                      className="inline-flex h-8 items-center gap-1 px-3 rounded-lg border border-zinc-200 hover:border-zinc-300 disabled:opacity-50 disabled:cursor-not-allowed bg-white hover:bg-zinc-50 text-[11px] font-semibold text-zinc-700 transition cursor-pointer"
                    >
                      Previous
                    </button>

                    {getPageNumbers().map(pageNum => (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        disabled={isPending}
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-[11px] font-bold border transition cursor-pointer ${
                          currentPage === pageNum
                            ? 'bg-indigo-600 border-indigo-700 text-white shadow-3xs'
                            : 'bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-700'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {pageNum}
                      </button>
                    ))}

                    <button
                      onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                      disabled={currentPage === totalPages || isPending}
                      className="inline-flex h-8 items-center gap-1 px-3 rounded-lg border border-zinc-200 hover:border-zinc-300 disabled:opacity-50 disabled:cursor-not-allowed bg-white hover:bg-zinc-50 text-[11px] font-semibold text-zinc-700 transition cursor-pointer"
                    >
                      Next
                    </button>
                  </div>
                )}

                {totalPages > 1 && (
                  <form onSubmit={handleJumpPage} className="flex items-center gap-1.5 border-l border-zinc-200 pl-3">
                    <span className="text-xs text-zinc-400 font-medium">Go to:</span>
                    <input
                      type="text"
                      value={jumpPage}
                      onChange={(e) => setJumpPage(e.target.value.replace(/\D/g, ''))}
                      disabled={isPending}
                      placeholder={currentPage}
                      className="w-9 h-7 rounded border border-zinc-200 bg-white text-center text-xs font-bold text-zinc-700 outline-none focus:border-zinc-400 placeholder-zinc-300"
                    />
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
