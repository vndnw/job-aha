"use client";

import { Calendar, Mail, Phone, FileText, ArrowUpRight, Inbox } from 'lucide-react';

export default function ApplicantsList({ applications }) {
  if (!applications || applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border border-dashed border-zinc-200 rounded-xl bg-zinc-50/50 text-center gap-3">
        <Inbox className="h-10 w-10 text-zinc-300" />
        <h4 className="text-sm font-semibold text-zinc-800">No applicants registered</h4>
        <p className="text-xs text-zinc-500 max-w-xs">New applications submitted through CMS will populate here.</p>
      </div>
    );
  }

  return (
    <div className="border border-zinc-200/80 rounded-xl bg-white overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50/70 text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">
              <th className="p-4">Applicant</th>
              <th className="p-4">Contact Info</th>
              <th className="p-4">Applied Date</th>
              <th className="p-4">Status & Source</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {applications.map(app => (
              <tr key={app.application_id} className="hover:bg-zinc-50/50 transition">
                {/* Applicant Details */}
                <td className="p-4 font-semibold text-zinc-950">
                  <div className="flex flex-col gap-0.5">
                    <span>{app.name}</span>
                    <span className="text-[10px] font-mono text-zinc-400 font-normal">ID: {app.application_id}</span>
                  </div>
                </td>
                
                {/* Contact Info */}
                <td className="p-4">
                  <div className="flex flex-col gap-1 text-zinc-700 text-[11px]">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Phone className="h-3.5 w-3.5 text-zinc-400" /> {app.phone_number || 'N/A'}
                    </span>
                    <span className="flex items-center gap-1.5 text-zinc-500">
                      <Mail className="h-3.5 w-3.5 text-zinc-400" /> {app.email}
                    </span>
                  </div>
                </td>

                {/* Date */}
                <td className="p-4 text-zinc-600">
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                    <span>
                      {app.applied_date ? new Date(app.applied_date).toLocaleDateString('en-GB') : 'N/A'}
                    </span>
                  </div>
                </td>

                {/* Status & Source */}
                <td className="p-4">
                  <div className="flex flex-col gap-1 items-start">
                    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold border ${
                      app.status === 'Lọc CV' 
                        ? 'bg-zinc-100 text-zinc-700 border-zinc-200' 
                        : app.status === 'Đạt' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : app.status === 'Không đạt'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {app.status || 'N/A'}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-medium">
                      via {app.relative || 'Direct'}
                    </span>
                  </div>
                </td>

                {/* CV Action */}
                <td className="p-4 text-right">
                  {app.cv_url ? (
                    <a 
                      href={app.cv_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex h-8 items-center gap-1.5 px-3 rounded-lg border border-zinc-200 hover:border-zinc-300 bg-white hover:bg-zinc-50 text-[11px] font-semibold text-zinc-700 transition"
                    >
                      <FileText className="h-3.5 w-3.5 text-zinc-400" />
                      Resume
                      <ArrowUpRight className="h-3 w-3 opacity-60" />
                    </a>
                  ) : (
                    <span className="text-[11px] text-zinc-400 italic">No Resume</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
