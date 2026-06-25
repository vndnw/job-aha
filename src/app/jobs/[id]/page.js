import { getJobsCollection } from '@/lib/db';
import { makeVietnameseRegex } from '@/lib/utils';
import JobDetailsContainer from '@/components/JobDetailsContainer';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

export const revalidate = 0; // Disable static cache to allow dynamic paginated search responses

export default async function JobPage({ params, searchParams }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const resolvedSearchParams = await searchParams;
  const tab = resolvedSearchParams.tab || 'info';
  const page = parseInt(resolvedSearchParams.page) || 1;
  const search = resolvedSearchParams.search || '';
  const limit = parseInt(resolvedSearchParams.limit) || 10;

  let job = null;
  let totalJobsCount = 0;
  let hotJobsCount = 0;
  let newJobsCount = 0;
  let totalApplicantsCount = 0;
  let jobApplicantsCount = 0;
  let paginatedApplicants = [];
  let filteredTotal = 0;
  let totalPages = 0;

  try {
    const collection = await getJobsCollection();

    // Query job details by ID from MongoDB, projecting out the full job_applications array to save payload size
    const rawJob = await collection.findOne({ id_job: id }, { projection: { job_applications: 0 } });
    if (!rawJob) {
      notFound();
    }

    // Serialize MongoDB document
    job = JSON.parse(JSON.stringify(rawJob));
    job.id = job._id;

    // Fetch overall dashboard summary metrics on the server cheaply
    totalJobsCount = await collection.countDocuments({});
    hotJobsCount = await collection.countDocuments({ is_hot: true });
    newJobsCount = await collection.countDocuments({ is_new: true });

    // Count all applicants globally
    const countPipeline = [
      { $project: { count: { $size: { $ifNull: ["$job_applications", []] } } } },
      { $group: { _id: null, total: { $sum: "$count" } } }
    ];
    const totalCountRes = await collection.aggregate(countPipeline).toArray();
    totalApplicantsCount = totalCountRes[0]?.total || 0;

    // Count applications for this job
    const jobCountRes = await collection.aggregate([
      { $match: { id_job: id } },
      { $project: { count: { $size: { $ifNull: ["$job_applications", []] } } } }
    ]).toArray();
    jobApplicantsCount = jobCountRes[0]?.count || 0;

    // Fetch paginated applications if current tab is applicants
    if (tab === 'applicants') {
      const skip = (page - 1) * limit;
      const searchRegex = search ? makeVietnameseRegex(search) : null;

      const pipeline = [
        { $match: { id_job: id } },
        { $unwind: "$job_applications" },
        {
          $project: {
            _id: 0,
            application_id: "$job_applications.application_id",
            name: "$job_applications.name",
            email: "$job_applications.email",
            phone_number: "$job_applications.phone_number",
            status: "$job_applications.status",
            applied_date: "$job_applications.applied_date",
            relative: "$job_applications.relative",
            cv_url: "$job_applications.cv_url"
          }
        }
      ];

      if (searchRegex) {
        pipeline.push({
          $match: {
            $or: [
              { name: searchRegex },
              { email: searchRegex },
              { phone_number: searchRegex },
              { status: searchRegex },
              { relative: searchRegex }
            ]
          }
        });
      }

      pipeline.push({
        $facet: {
          metadata: [{ $count: "total" }],
          data: [
            { $sort: { applied_date: -1 } },
            { $skip: skip },
            { $limit: limit }
          ]
        }
      });

      const results = await collection.aggregate(pipeline).toArray();
      filteredTotal = results[0]?.metadata[0]?.total || 0;
      paginatedApplicants = results[0]?.data || [];
      totalPages = Math.ceil(filteredTotal / limit);

      // Serialize MongoDB data
      paginatedApplicants = JSON.parse(JSON.stringify(paginatedApplicants));
    }

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
        jobApplicantsCount={jobApplicantsCount}
        paginatedApplicants={paginatedApplicants}
        currentPage={page}
        totalPages={totalPages}
        filteredTotal={filteredTotal}
        initialSearch={search}
        limit={limit}
      />
    </Suspense>
  );
}

