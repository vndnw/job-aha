"use client";

import { usePathname } from 'next/navigation';

export default function ResponsiveMain({ children }) {
  const pathname = usePathname();
  
  const isRootJobsPage = pathname === '/jobs';
  const isCandidatesPage = pathname.startsWith('/jobs/candidates');
  const isCandidateDetailsPage = pathname.includes('/candidates/');
  const shouldHideSidebar = isCandidatesPage || isCandidateDetailsPage;

  return (
    <main className={`flex-1 flex flex-col bg-[#fafafa] overflow-hidden w-full ${
      shouldHideSidebar ? 'flex' : (isRootJobsPage ? 'hidden lg:flex' : 'flex')
    }`}>
      {children}
    </main>
  );
}
