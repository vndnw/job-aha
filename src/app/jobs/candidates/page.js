import { getJobsCollection } from '@/lib/db';
import GlobalCandidatesContainer from '@/components/GlobalCandidatesContainer';
import { Suspense } from 'react';

export const revalidate = 60; // Revalidate page data every minute

export default async function GlobalCandidatesPage() {
  let serializedCandidates = [];
  let totalJobsCount = 0;
  let hotJobsCount = 0;
  let newJobsCount = 0;
  let totalApplicantsCount = 0;

  try {
    const collection = await getJobsCollection();
    const allJobs = await collection.find({}).toArray();

    totalJobsCount = allJobs.length;
    hotJobsCount = allJobs.filter(j => j.is_hot).length;
    newJobsCount = allJobs.filter(j => j.is_new).length;

    allJobs.forEach(job => {
      if (job.job_applications) {
        job.job_applications.forEach(app => {
          serializedCandidates.push({
            ...app,
            job_id: job.id_job,
            job_title: job.title
          });
        });
      }
    });

    // Sort by applied date descending
    serializedCandidates.sort((a, b) => new Date(b.applied_date || 0) - new Date(a.applied_date || 0));
    totalApplicantsCount = serializedCandidates.length;

    // Serialize MongoDB data
    serializedCandidates = JSON.parse(JSON.stringify(serializedCandidates));

  } catch (error) {
    console.error("Error loading global candidates on server:", error);
  }

  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center bg-[#fafafa]">
        <div className="text-center space-y-2">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          <p className="text-xs text-zinc-400 font-medium">Loading Global Recruiter Console...</p>
        </div>
      </div>
    }>
      <GlobalCandidatesContainer 
        candidates={serializedCandidates}
        totalJobsCount={totalJobsCount}
        hotJobsCount={hotJobsCount}
        newJobsCount={newJobsCount}
        totalApplicantsCount={totalApplicantsCount}
      />
    </Suspense>
  );
}
