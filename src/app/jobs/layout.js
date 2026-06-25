import { getJobsCollection } from '@/lib/db';
import Sidebar from '@/components/Sidebar';

export const revalidate = 60; // Revalidate page data every minute

export default async function JobsLayout({ children }) {
  let serializedJobs = [];
  
  try {
    const collection = await getJobsCollection();
    const rawJobs = await collection.find({}).sort({ publishedAt: -1 }).toArray();
    
    serializedJobs = rawJobs.map(job => {
      const serialized = JSON.parse(JSON.stringify(job));
      serialized.id = serialized._id;
      return serialized;
    });
  } catch (error) {
    console.error("Error loading initial jobs in layout:", error);
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#fafafa] font-sans antialiased text-zinc-800">
      {/* Header */}
      <header className="flex h-16 items-center justify-between border-b border-zinc-200/80 bg-white px-6 shrink-0 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 font-extrabold text-white text-lg tracking-wide shadow-xs">
            A
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-zinc-900 flex items-center gap-1.5">
              Ahamove Careers
              <span className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-500 ring-1 ring-inset ring-zinc-200">
                Dashboard
              </span>
            </h1>
            <p className="text-[10px] text-zinc-400">Recruiter Console & Candidate Tracker</p>
          </div>
        </div>
        
        {/* Info label */}
        <div className="hidden md:flex items-center gap-2 text-xs text-zinc-400">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Synced with Strapi API</span>
        </div>
      </header>

      {/* Main Container Split View */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        <Sidebar initialJobs={serializedJobs} />
        <main className="flex-1 flex flex-col bg-[#fafafa] overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
