import { getJobsCollection } from '@/lib/db';
import Sidebar from '@/components/Sidebar';
import HeaderNav from '@/components/HeaderNav';
import ResponsiveMain from '@/components/ResponsiveMain';
import HeaderLogo from '@/components/HeaderLogo';

export const revalidate = 60; // Revalidate page data every minute

export default async function JobsLayout({ children }) {
  let serializedJobs = [];

  try {
    const collection = await getJobsCollection();
    const rawJobs = await collection.find({}).sort({ publishedAt: -1 }).limit(10).toArray();

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
          <HeaderLogo />
          <HeaderNav />
        </div>

        {/* Info label */}
        <div className="hidden md:flex items-center gap-2 text-xs text-zinc-400">
          <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span> 
          <a href="https://ahanext.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 font-medium transition-colors underline underline-offset-2">
            Upgrade to Premium
          </a>
        </div>
      </header>

      {/* Main Container Split View */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        <Sidebar initialJobs={serializedJobs} />
        <ResponsiveMain>
          {children}
        </ResponsiveMain>
      </div>
    </div>
  );
}
