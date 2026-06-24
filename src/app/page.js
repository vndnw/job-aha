import { getJobsCollection } from '@/lib/db';
import Dashboard from '@/components/Dashboard';

export const revalidate = 60; // Revalidate page data every minute

export default async function Home() {
  let serializedJobs = [];
  
  try {
    const collection = await getJobsCollection();
    const rawJobs = await collection.find({}).sort({ publishedAt: -1 }).toArray();
    
    serializedJobs = rawJobs.map(job => {
      // Safely serialize MongoDB documents for Server-to-Client Component transfer
      const serialized = JSON.parse(JSON.stringify(job));
      serialized.id = serialized._id;
      return serialized;
    });
  } catch (error) {
    console.error("Error loading jobs from MongoDB:", error);
  }

  return (
    <main style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <Dashboard initialJobs={serializedJobs} />
    </main>
  );
}
