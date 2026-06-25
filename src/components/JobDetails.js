"use client";

import { Calendar, Mail } from 'lucide-react';

export default function JobDetails({ job }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      
      {/* Specifications Details columns */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Description */}
        {job.job_description && (
          <div className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-xs hover:border-zinc-300 transition">
            <h3 className="text-sm font-bold text-zinc-900 border-l-2 border-indigo-600 pl-3">Job Description</h3>
            <div 
              className="html-render text-zinc-700 text-xs mt-4"
              dangerouslySetInnerHTML={{ __html: job.job_description }}
            />
          </div>
        )}

        {/* Requirements */}
        {job.job_requirement && (
          <div className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-xs hover:border-zinc-300 transition">
            <h3 className="text-sm font-bold text-zinc-900 border-l-2 border-indigo-600 pl-3">Job Requirements</h3>
            <div 
              className="html-render text-zinc-700 text-xs mt-4"
              dangerouslySetInnerHTML={{ __html: job.job_requirement }}
            />
          </div>
        )}

        {/* Benefits */}
        {job.benefit && (
          <div className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-xs hover:border-zinc-300 transition">
            <h3 className="text-sm font-bold text-zinc-900 border-l-2 border-indigo-600 pl-3">Benefits & Perks</h3>
            <div 
              className="html-render text-zinc-700 text-xs mt-4"
              dangerouslySetInnerHTML={{ __html: job.benefit }}
            />
          </div>
        )}

      </div>

      {/* Position Summary Card */}
      <div className="space-y-4">
        <div className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-xs hover:border-zinc-300 transition">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Position Summary</h4>
          
          <div className="space-y-4 mt-4">
            <div className="flex flex-col border-b border-zinc-100 pb-3">
              <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">Contact Email</span>
              <span className="text-xs font-semibold text-zinc-800 mt-1 break-all flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-zinc-400" />
                {job.application_email || 'N/A'}
              </span>
            </div>

            {job.secondary_email_for_applications && (
              <div className="flex flex-col border-b border-zinc-100 pb-3">
                <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">Secondary Email</span>
                <span className="text-xs font-semibold text-zinc-800 mt-1 break-all flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-zinc-400" />
                  {job.secondary_email_for_applications}
                </span>
              </div>
            )}

            <div className="flex flex-col border-b border-zinc-100 pb-3">
              <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">Published Date</span>
              <span className="text-xs font-semibold text-zinc-800 mt-1 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                {job.publishedAt 
                  ? new Date(job.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) 
                  : 'N/A'}
              </span>
            </div>

            <div className="flex flex-col border-b border-zinc-100 pb-3">
              <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">Last Synced</span>
              <span className="text-xs font-semibold text-zinc-800 mt-1">{job.crawled_at || 'N/A'}</span>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">View Count</span>
              <span className="text-xs font-semibold text-zinc-800 mt-1">{job.views || '0'} views</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
