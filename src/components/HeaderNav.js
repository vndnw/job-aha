"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function HeaderNav() {
  const pathname = usePathname();
  
  // Highlight "Jobs" if path doesn't include candidates
  const isCandidatesActive = pathname.includes('/candidates');

  const activeClasses = "bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-700 font-extrabold shadow-xs";
  const inactiveClasses = "bg-white hover:bg-zinc-50 hover:border-zinc-300 text-zinc-600 hover:text-zinc-950 border border-zinc-200 shadow-3xs";

  return (
    <nav className="flex items-center gap-2.5 ml-8 border-l border-zinc-200 pl-8 h-8 shrink-0">
      <Link 
        href="/jobs" 
        className={`px-3.5 py-1.5 rounded-lg text-xs transition-all duration-150 ${
          !isCandidatesActive ? activeClasses : inactiveClasses
        }`}
      >
        Jobs Listing
      </Link>
      <Link 
        href="/jobs/candidates" 
        className={`px-3.5 py-1.5 rounded-lg text-xs transition-all duration-150 ${
          isCandidatesActive ? activeClasses : inactiveClasses
        }`}
      >
        Global Candidates
      </Link>
    </nav>
  );
}
