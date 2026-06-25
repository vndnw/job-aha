import { getJobsCollection } from '@/lib/db';
import JobDetailsContainer from '@/components/JobDetailsContainer';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

export const revalidate = 60; // Revalidate page data every minute

export default async function JobPage({ params }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  let job = null;
  let totalJobsCount = 0;
  let hotJobsCount = 0;
  let newJobsCount = 0;
  let totalApplicantsCount = 0;

  try {
    const collection = await getJobsCollection();

    // Query job details by ID from MongoDB
    const rawJob = await collection.findOne({ id_job: id });
    if (!rawJob) {
      notFound();
    }

    // Serialize MongoDB document
    job = JSON.parse(JSON.stringify(rawJob));
    job.id = job._id;

    // Fetch overall dashboard summary metrics on the server
    totalJobsCount = await collection.countDocuments({});
    hotJobsCount = await collection.countDocuments({ is_hot: true });
    newJobsCount = await collection.countDocuments({ is_new: true });

    const allJobs = await collection.find({}).toArray();
    totalApplicantsCount = allJobs.reduce((acc, j) => acc + (j.job_applications?.length || 0), 0);

  } catch (error) {
    console.error("Error loading job details on server:", error);
    notFound();
  }

  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center bg-[#fafafa]">
        <div className="text-center space-y-2">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          <p className="text-xs text-zinc-400 font-medium">Loading Job Console...</p>
        </div>
      </div>
    }>
      <JobDetailsContainer 
        job={job}
        totalJobsCount={totalJobsCount}
        hotJobsCount={hotJobsCount}
        newJobsCount={newJobsCount}
        totalApplicantsCount={totalApplicantsCount}
      />
    </Suspense>
  );
}
