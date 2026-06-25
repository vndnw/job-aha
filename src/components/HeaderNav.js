"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function HeaderNav() {
  const pathname = usePathname();
  
  // Highlight "Jobs" if path doesn't include candidates
  const isCandidatesActive = pathname.includes('/candidates');

  return (
    <nav className="flex items-center gap-2 ml-8 border-l border-zinc-200 pl-8 h-8 shrink-0">
      <Link 
        href="/jobs" 
        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
          !isCandidatesActive 
            ? 'bg-zinc-100 text-zinc-950 shadow-3xs font-extrabold border border-zinc-200/50' 
            : 'text-zinc-500 hover:text-zinc-900 border border-transparent'
        }`}
      >
        Jobs Listing
      </Link>
      <Link 
        href="/jobs/candidates" 
        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
          isCandidatesActive 
            ? 'bg-zinc-100 text-zinc-950 shadow-3xs font-extrabold border border-zinc-200/50' 
            : 'text-zinc-500 hover:text-zinc-900 border border-transparent'
        }`}
      >
        Global Candidates
      </Link>
    </nav>
  );
}
