import { getJobsCollection } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const location = searchParams.get('location') || 'all';
    const category = searchParams.get('category') || 'all';
    const badge = searchParams.get('badge') || 'all';

    const collection = await getJobsCollection();
    const query = {};

    // 1. Full-text search regex match
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { id_job: { $regex: search, $options: 'i' } },
        { job_description: { $regex: search, $options: 'i' } },
        { job_requirement: { $regex: search, $options: 'i' } }
      ];
    }

    // 2. Location filter
    if (location !== 'all') {
      query["locations.data.attributes.name"] = location;
    }

    // 3. Category filter
    if (category !== 'all') {
      query["job_types.data.attributes.name"] = category;
    }

    // 4. Badges (Hot / New)
    if (badge === 'hot') {
      query.is_hot = true;
    } else if (badge === 'new') {
      query.is_new = true;
    }

    const rawJobs = await collection.find(query).sort({ publishedAt: -1 }).toArray();

    // Serialize MongoDB ObjectIds
    const jobs = rawJobs.map(job => {
      const serialized = JSON.parse(JSON.stringify(job));
      serialized.id = serialized._id;
      return serialized;
    });

    return Response.json(jobs);
  } catch (error) {
    console.error("API Jobs Error:", error);
    return Response.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}
