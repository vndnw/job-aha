import { getJobsCollection } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft,
  User, 
  Mail, 
  Phone, 
  GraduationCap, 
  Calendar, 
  FileText, 
  Brain, 
  UserCheck, 
  Briefcase, 
  Notebook, 
  ExternalLink 
} from 'lucide-react';

export const revalidate = 60; // Revalidate page data every minute

export default async function CandidatePage({ params }) {
  const resolvedParams = await params;
  const { id, candidateId } = resolvedParams;

  let job = null;
  let candidate = null;

  try {
    const collection = await getJobsCollection();

    // Query job by ID
    const rawJob = await collection.findOne({ id_job: id });
    if (!rawJob) {
      notFound();
    }

    job = JSON.parse(JSON.stringify(rawJob));
    
    // Find the candidate application
    candidate = job.job_applications?.find(
      app => String(app.application_id) === String(candidateId)
    );

    if (!candidate) {
      notFound();
    }
  } catch (error) {
    console.error("Error loading candidate page:", error);
    notFound();
  }

  const isApproved = candidate.status === 'Đạt';
  const isRejected = candidate.status === 'Không đạt';
  const isScreening = candidate.status === 'Lọc CV';

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#fafafa] overflow-y-auto">
      {/* Top Navigation / Breadcrumb Header */}
      <div className="px-4 sm:px-6 py-4 bg-white border-b border-zinc-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 shadow-3xs">
        <div className="flex items-center gap-3">
          <Link 
            href={`/jobs/${id}?tab=applicants`}
            className="inline-flex h-8 items-center gap-1.5 px-3 rounded-lg border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 text-xs font-bold text-zinc-600 transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Applicants
          </Link>
          <div className="h-4 w-px bg-zinc-200" />
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-400">Jobs</span>
            <span className="text-xs text-zinc-300">/</span>
            <Link href={`/jobs/${id}`} className="text-xs font-bold text-indigo-600 hover:underline">
              {job.title}
            </Link>
            <span className="text-xs text-zinc-300">/</span>
            <span className="text-xs font-semibold text-zinc-700 truncate max-w-[150px]">
              {candidate.name}
            </span>
          </div>
        </div>

        {candidate.cv_url && (
          <a 
            href={candidate.cv_url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex h-8 items-center gap-2 px-3.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white shadow-xs transition"
          >
            <FileText className="h-3.5 w-3.5" />
            Open CV File
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>

      {/* Profile Overview Header Card */}
      <div className="p-4 sm:p-6 pb-2 shrink-0">
        <div className="bg-white border border-zinc-200/80 rounded-xl p-4 sm:p-6 shadow-3xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center rounded-md bg-zinc-100 border border-zinc-200 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-zinc-500 font-mono">
                Code: {candidate.candidate_code || 'N/A'}
              </span>
              <span className="inline-flex items-center rounded-md bg-indigo-50 border border-indigo-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-indigo-600 font-mono">
                App ID: {candidate.application_id}
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900">{candidate.name}</h2>
            <div className="flex items-center gap-2.5 text-xs text-zinc-500">
              <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold border ${
                isScreening 
                  ? 'bg-zinc-100 text-zinc-700 border-zinc-200' 
                  : isApproved 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : isRejected
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {candidate.status || 'N/A'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                Applied on {candidate.applied_date ? new Date(candidate.applied_date).toLocaleDateString('en-GB') : 'N/A'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-[10px] text-zinc-400 font-semibold uppercase">Application Source</p>
              <p className="text-xs font-extrabold text-zinc-800 mt-0.5">
                via {candidate.relative || 'Direct Application'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Columns Content Area */}
      <div className="p-4 sm:p-6 pt-2 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Span 2) - Assessments, Info, Notes */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* AI Assessment Evaluation Card */}
          {(candidate.ai_score !== null || candidate.ai_evaluation) && (
            <div className="bg-white border border-zinc-200/80 rounded-xl p-6 shadow-3xs space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                  <Brain className="h-4.5 w-4.5 text-indigo-500" />
                  AI Screening Assessment
                </h3>
                {candidate.ai_score !== null && (
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-zinc-400 font-medium mr-1">Match Score:</span>
                    <span className="inline-flex items-center rounded-full bg-indigo-600 px-3 py-1 text-xs font-extrabold text-white">
                      {candidate.ai_score}/100
                    </span>
                  </div>
                )}
              </div>
              
              {candidate.ai_evaluation ? (
                <div className="text-xs text-zinc-700 leading-relaxed space-y-2">
                  <p className="font-medium text-indigo-950/80 p-4 rounded-xl bg-indigo-50/30 border border-indigo-100/50">
                    {candidate.ai_evaluation}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-zinc-400 italic">No automated AI summary written.</p>
              )}
            </div>
          )}

          {/* Education & Experience Details */}
          <div className="bg-white border border-zinc-200/80 rounded-xl p-6 shadow-3xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-100 pb-3">
              Academic & Professional Profile
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-zinc-50/50 border border-zinc-100 rounded-lg flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-500 shrink-0 border border-zinc-200/40">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase">Degree Level</p>
                  <p className="text-xs font-bold text-zinc-800 mt-1">{candidate.education || 'Not Provided'}</p>
                </div>
              </div>

              <div className="p-4 bg-zinc-50/50 border border-zinc-100 rounded-lg flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-500 shrink-0 border border-zinc-200/40">
                  <Briefcase className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase">Major / Field of Study</p>
                  <p className="text-xs font-bold text-zinc-800 mt-1">{candidate.major || 'Not Provided'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recruiter / HR Notes Section */}
          <div className="bg-white border border-zinc-200/80 rounded-xl p-6 shadow-3xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-100 pb-3 flex items-center gap-1.5">
              <Notebook className="h-4.5 w-4.5 text-zinc-400" />
              Recruitment Remarks & Notes
            </h3>
            
            {candidate.note ? (
              <div className="p-4 bg-amber-50/30 border border-amber-100/70 rounded-xl text-xs text-zinc-700 leading-relaxed font-medium">
                {candidate.note}
              </div>
            ) : (
              <div className="text-center py-6 text-zinc-400 text-xs italic border border-dashed border-zinc-200 rounded-xl bg-zinc-50/30">
                No recruiter notes added yet.
              </div>
            )}
          </div>
        </div>

        {/* Right Column (Span 1) - Side Details */}
        <div className="space-y-6">
          
          {/* Contact Details Card */}
          <div className="bg-white border border-zinc-200/80 rounded-xl p-6 shadow-3xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-100 pb-3">
              Contact Details
            </h3>
            
            <div className="space-y-3.5">
              <div className="flex items-center gap-3 text-xs">
                <div className="h-8.5 w-8.5 rounded-lg bg-zinc-50 border border-zinc-200/60 flex items-center justify-center text-zinc-400 shrink-0">
                  <Mail className="h-4 w-4" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[9px] text-zinc-400 uppercase font-bold tracking-wider">Email address</span>
                  <a href={`mailto:${candidate.email}`} className="font-bold text-zinc-800 hover:text-indigo-600 mt-0.5 break-all">
                    {candidate.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <div className="h-8.5 w-8.5 rounded-lg bg-zinc-50 border border-zinc-200/60 flex items-center justify-center text-zinc-400 shrink-0">
                  <Phone className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] text-zinc-400 uppercase font-bold tracking-wider">Phone number</span>
                  <a href={`tel:${candidate.phone_number}`} className="font-bold text-zinc-800 hover:text-indigo-600 mt-0.5">
                    {candidate.phone_number || 'N/A'}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <div className="h-8.5 w-8.5 rounded-lg bg-zinc-50 border border-zinc-200/60 flex items-center justify-center text-zinc-400 shrink-0">
                  <User className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] text-zinc-400 uppercase font-bold tracking-wider">Year of Birth</span>
                  <span className="font-bold text-zinc-800 mt-0.5">{candidate.yob || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Referral contact card if referenced */}
          <div className="bg-white border border-zinc-200/80 rounded-xl p-6 shadow-3xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-100 pb-3 flex items-center gap-1.5">
              <UserCheck className="h-4 w-4 text-zinc-400" />
              Referral Profile
            </h3>
            
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[9px] text-zinc-400 uppercase font-bold">Source Class</span>
                  <p className="font-bold text-zinc-800 mt-0.5">{candidate.relative || 'Direct'}</p>
                </div>
                {candidate.other_relative && (
                  <div>
                    <span className="text-[9px] text-zinc-400 uppercase font-bold">Details</span>
                    <p className="font-bold text-zinc-800 mt-0.5">{candidate.other_relative}</p>
                  </div>
                )}
              </div>

              {/* Referrer contacts */}
              {(candidate.referrer_name || candidate.referrer_email || candidate.referrer_phone_number) && (
                <div className="border-t border-zinc-100 pt-3.5 space-y-2.5">
                  <span className="text-[9px] text-zinc-400 uppercase font-bold tracking-wider">Referrer Information</span>
                  <div className="space-y-2">
                    {candidate.referrer_name && (
                      <div>
                        <span className="text-[9px] text-zinc-400 font-medium">Name / Type</span>
                        <p className="font-bold text-zinc-700">{candidate.referrer_name} ({candidate.referrer_type || 'Internal'})</p>
                      </div>
                    )}
                    {candidate.referrer_email && (
                      <div>
                        <span className="text-[9px] text-zinc-400 font-medium">Email</span>
                        <p className="font-bold text-zinc-700 truncate">{candidate.referrer_email}</p>
                      </div>
                    )}
                    {candidate.referrer_phone_number && (
                      <div>
                        <span className="text-[9px] text-zinc-400 font-medium">Phone</span>
                        <p className="font-bold text-zinc-700">{candidate.referrer_phone_number}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Staff referrer info */}
              {(candidate.referral_staff_name || candidate.referral_staff_id) && (
                <div className="border-t border-zinc-100 pt-3.5 space-y-2">
                  <span className="text-[9px] text-zinc-400 uppercase font-bold tracking-wider">Referring Employee</span>
                  <div className="grid grid-cols-2 gap-2">
                    {candidate.referral_staff_name && (
                      <div>
                        <span className="text-[9px] text-zinc-400 font-medium">Name</span>
                        <p className="font-bold text-zinc-700">{candidate.referral_staff_name}</p>
                      </div>
                    )}
                    {candidate.referral_staff_id && (
                      <div>
                        <span className="text-[9px] text-zinc-400 font-medium">ID</span>
                        <p className="font-bold text-zinc-700">{candidate.referral_staff_id}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Onboarding & Progress */}
          {(candidate.onboard_date || candidate.progress_status) && (
            <div className="bg-white border border-zinc-200/80 rounded-xl p-6 shadow-3xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-100 pb-3">
                Onboarding Tracker
              </h3>
              
              <div className="grid grid-cols-2 gap-4 text-xs">
                {candidate.progress_status && (
                  <div>
                    <span className="text-[9px] text-zinc-400 uppercase font-bold">Progress status</span>
                    <p className="font-bold text-zinc-800 mt-0.5">{candidate.progress_status}</p>
                  </div>
                )}
                {candidate.onboard_date && (
                  <div>
                    <span className="text-[9px] text-zinc-400 uppercase font-bold">Onboard Date</span>
                    <p className="font-bold text-zinc-800 mt-0.5">
                      {new Date(candidate.onboard_date).toLocaleDateString('en-GB')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
