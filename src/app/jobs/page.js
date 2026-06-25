import { Briefcase } from 'lucide-react';

export default function JobsPage() {
  return (
    <div className="flex flex-col items-center justify-center p-16 text-center gap-3 h-full">
      <Briefcase className="h-10 w-10 text-zinc-300" />
      <h4 className="text-sm font-semibold text-zinc-700">Select an opening position</h4>
      <p className="text-xs text-zinc-500 max-w-xs">
        Select one of the crawled job listings from the sidebar to inspect statistics and applicant records.
      </p>
    </div>
  );
}
