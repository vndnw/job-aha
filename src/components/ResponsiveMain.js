"use client";

import { usePathname } from 'next/navigation';

export default function ResponsiveMain({ children }) {
  const pathname = usePathname();
  
  // If the pathname is exactly /jobs, we want to hide this main panel on mobile
  const isRootJobsPage = pathname === '/jobs';

  return (
    <main className={`flex-1 flex flex-col bg-[#fafafa] overflow-hidden w-full ${
      isRootJobsPage ? 'hidden lg:flex' : 'flex'
    }`}>
      {children}
    </main>
  );
}
