import { getJobsCollection } from '@/lib/db';
import { makeVietnameseRegex } from '@/lib/utils';
import GlobalCandidatesContainer from '@/components/GlobalCandidatesContainer';
import { Suspense } from 'react';

export const revalidate = 0; // Disable static cache or make dynamic to reflect real-time DB changes with search query

export default async function GlobalCandidatesPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page) || 1;
  const search = resolvedSearchParams.search || '';
  const limit = parseInt(resolvedSearchParams.limit) || 10;

  let serializedCandidates = [];
  let totalJobsCount = 0;
  let hotJobsCount = 0;
  let newJobsCount = 0;
  let totalApplicantsCount = 0;
  let filteredTotal = 0;
  let totalPages = 0;

  try {
    const collection = await getJobsCollection();

    // Fetch dashboard metrics
    totalJobsCount = await collection.countDocuments({});
    hotJobsCount = await collection.countDocuments({ is_hot: true });
    newJobsCount = await collection.countDocuments({ is_new: true });

    // Cheap count of all applicants globally
    const countPipeline = [
      { $project: { count: { $size: { $ifNull: ["$job_applications", []] } } } },
      { $group: { _id: null, total: { $sum: "$count" } } }
    ];
    const totalCountRes = await collection.aggregate(countPipeline).toArray();
    totalApplicantsCount = totalCountRes[0]?.total || 0;

    // Build the aggregation pipeline for paginated candidates
    const skip = (page - 1) * limit;
    const searchRegex = search ? makeVietnameseRegex(search) : null;

    const pipeline = [
      { $unwind: "$job_applications" },
      {
        $project: {
          _id: 0,
          job_id: "$id_job",
          job_title: "$title",
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
            { relative: searchRegex },
            { job_title: searchRegex }
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
    serializedCandidates = results[0]?.data || [];
    totalPages = Math.ceil(filteredTotal / limit);

    // Serialize MongoDB results
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
        filteredTotal={filteredTotal}
        currentPage={page}
        totalPages={totalPages}
        initialSearch={search}
        limit={limit}
      />
    </Suspense>
  );
}

