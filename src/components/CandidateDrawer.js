"use client";

import { 
  X, 
  User, 
  Mail, 
  Phone, 
  GraduationCap, 
  Calendar, 
  Award, 
  FileText, 
  Brain, 
  UserCheck, 
  Briefcase, 
  Notebook, 
  ExternalLink 
} from 'lucide-react';

export default function CandidateDrawer({ candidate, onClose }) {
  if (!candidate) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-zinc-950/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Slide-over Panel */}
      <div className="relative w-full max-w-xl bg-white h-full shadow-2xl border-l border-zinc-200 flex flex-col z-10 transition-transform duration-300 animate-slide-in">
        
        {/* Header */}
        <div className="p-6 border-b border-zinc-200/80 bg-zinc-50 flex items-start justify-between shrink-0">
          <div className="space-y-1">
            <span className="inline-flex items-center rounded-md bg-zinc-200 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-zinc-600">
              Code: {candidate.candidate_code || 'N/A'}
            </span>
            <h2 className="text-lg font-bold text-zinc-900">{candidate.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold border ${
                candidate.status === 'Lọc CV' 
                  ? 'bg-zinc-100 text-zinc-700 border-zinc-200' 
                  : candidate.status === 'Đạt' 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : candidate.status === 'Không đạt'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {candidate.status || 'N/A'}
              </span>
              <span className="text-[10px] text-zinc-400 font-medium">
                Applied on {candidate.applied_date ? new Date(candidate.applied_date).toLocaleDateString('en-GB') : 'N/A'}
              </span>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300 text-zinc-500 hover:text-zinc-700 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Scroll area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* AI Assessment (AI score & Evaluation) */}
          {(candidate.ai_score !== null || candidate.ai_evaluation) && (
            <div className="rounded-xl border border-indigo-100 bg-indigo-50/30 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
                  <Brain className="h-4 w-4 text-indigo-600" />
                  AI Screening Assessment
                </h3>
                {candidate.ai_score !== null && (
                  <span className="inline-flex items-center rounded-full bg-indigo-600 px-3 py-1 text-xs font-extrabold text-white">
                    Score: {candidate.ai_score}/100
                  </span>
                )}
              </div>
              {candidate.ai_evaluation ? (
                <p className="text-xs text-indigo-950/80 leading-relaxed font-medium">
                  {candidate.ai_evaluation}
                </p>
              ) : (
                <p className="text-xs text-zinc-400 italic">No automated AI summary written.</p>
              )}
            </div>
          )}

          {/* Education & Major */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Academic Background</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-zinc-50 border border-zinc-100 rounded-lg flex items-center gap-3">
                <div className="h-8 w-8 rounded bg-zinc-200/50 flex items-center justify-center text-zinc-500 shrink-0">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[9px] text-zinc-400 font-semibold uppercase">Degree</p>
                  <p className="text-xs font-bold text-zinc-800 mt-0.5">{candidate.education || 'N/A'}</p>
                </div>
              </div>

              <div className="p-3 bg-zinc-50 border border-zinc-100 rounded-lg flex items-center gap-3">
                <div className="h-8 w-8 rounded bg-zinc-200/50 flex items-center justify-center text-zinc-500 shrink-0">
                  <Briefcase className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[9px] text-zinc-400 font-semibold uppercase">Major</p>
                  <p className="text-xs font-bold text-zinc-800 mt-0.5 truncate max-w-[150px]">{candidate.major || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Contact Details</h3>
            <div className="space-y-2.5">
              <div className="flex items-center gap-3 text-xs">
                <div className="h-8 w-8 rounded bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-500 shrink-0">
                  <Mail className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] text-zinc-400 uppercase font-semibold">Email address</span>
                  <a href={`mailto:${candidate.email}`} className="font-semibold text-zinc-700 hover:text-indigo-600 mt-0.5 break-all">
                    {candidate.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <div className="h-8 w-8 rounded bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-500 shrink-0">
                  <Phone className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] text-zinc-400 uppercase font-semibold">Phone number</span>
                  <a href={`tel:${candidate.phone_number}`} className="font-semibold text-zinc-700 hover:text-indigo-600 mt-0.5">
                    {candidate.phone_number || 'N/A'}
                  </a>
                </div>
              </div>

              {candidate.yob && (
                <div className="flex items-center gap-3 text-xs">
                  <div className="h-8 w-8 rounded bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-500 shrink-0">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] text-zinc-400 uppercase font-semibold">Year of Birth</span>
                    <span className="font-semibold text-zinc-700 mt-0.5">{candidate.yob}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Referral details */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Referral & Origin</h3>
            <div className="rounded-xl border border-zinc-200 p-4 space-y-3 bg-zinc-50/30">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[9px] text-zinc-400 uppercase font-semibold">Application Source</span>
                  <p className="font-semibold text-zinc-800 mt-0.5">{candidate.relative || 'Direct'}</p>
                </div>
                {candidate.other_relative && (
                  <div>
                    <span className="text-[9px] text-zinc-400 uppercase font-semibold">Other Referral Source</span>
                    <p className="font-semibold text-zinc-800 mt-0.5">{candidate.other_relative}</p>
                  </div>
                )}
              </div>

              {/* Referrer info */}
              {(candidate.referrer_name || candidate.referrer_email) && (
                <div className="border-t border-zinc-200/80 pt-3 space-y-2">
                  <span className="text-[9px] text-zinc-400 uppercase font-semibold flex items-center gap-1">
                    <UserCheck className="h-3 w-3" />
                    Referrer Contact Details
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {candidate.referrer_name && (
                      <div>
                        <span className="text-[9px] text-zinc-400 font-medium">Name</span>
                        <p className="font-semibold text-zinc-700">{candidate.referrer_name} ({candidate.referrer_type || 'Internal'})</p>
                      </div>
                    )}
                    {candidate.referrer_email && (
                      <div>
                        <span className="text-[9px] text-zinc-400 font-medium">Email</span>
                        <p className="font-semibold text-zinc-700 truncate">{candidate.referrer_email}</p>
                      </div>
                    )}
                    {candidate.referrer_phone_number && (
                      <div className="col-span-2">
                        <span className="text-[9px] text-zinc-400 font-medium">Phone</span>
                        <p className="font-semibold text-zinc-700">{candidate.referrer_phone_number}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Staff referrer info */}
              {(candidate.referral_staff_name || candidate.referral_staff_id) && (
                <div className="border-t border-zinc-200/80 pt-3 space-y-2">
                  <span className="text-[9px] text-zinc-400 uppercase font-semibold">Referral Staff</span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {candidate.referral_staff_name && (
                      <div>
                        <span className="text-[9px] text-zinc-400 font-medium">Staff Name</span>
                        <p className="font-semibold text-zinc-700">{candidate.referral_staff_name}</p>
                      </div>
                    )}
                    {candidate.referral_staff_id && (
                      <div>
                        <span className="text-[9px] text-zinc-400 font-medium">Staff ID</span>
                        <p className="font-semibold text-zinc-700">{candidate.referral_staff_id}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {candidate.note && (
            <div className="space-y-3">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                <Notebook className="h-3.5 w-3.5 text-zinc-400" /> Notes
              </h3>
              <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-xl text-xs text-zinc-700 leading-relaxed">
                {candidate.note}
              </div>
            </div>
          )}

          {/* Onboarding info */}
          {(candidate.onboard_date || candidate.progress_status) && (
            <div className="space-y-3">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Onboarding & Progress</h3>
              <div className="rounded-xl border border-zinc-200 p-4 grid grid-cols-2 gap-4 text-xs bg-zinc-50/20">
                {candidate.progress_status && (
                  <div>
                    <span className="text-[9px] text-zinc-400 uppercase font-semibold">Progress Status</span>
                    <p className="font-semibold text-zinc-800 mt-0.5">{candidate.progress_status}</p>
                  </div>
                )}
                {candidate.onboard_date && (
                  <div>
                    <span className="text-[9px] text-zinc-400 uppercase font-semibold">Onboard Date</span>
                    <p className="font-semibold text-zinc-800 mt-0.5">
                      {new Date(candidate.onboard_date).toLocaleDateString('en-GB')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-zinc-200 bg-zinc-50 flex items-center justify-end gap-3 shrink-0">
          {candidate.cv_url && (
            <a 
              href={candidate.cv_url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex h-9 items-center gap-2 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white shadow-xs transition"
            >
              <FileText className="h-4 w-4" />
              Open Resume (CV)
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
          <button 
            onClick={onClose}
            className="inline-flex h-9 items-center px-4 rounded-lg border border-zinc-200 hover:bg-zinc-100 text-xs font-bold text-zinc-700 bg-white transition"
          >
            Close Profile
          </button>
        </div>

      </div>
    </div>
  );
}
