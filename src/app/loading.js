export default function RootLoading() {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#fafafa] font-sans antialiased text-zinc-800">
      
      {/* Header Skeleton */}
      <header className="flex h-16 items-center justify-between border-b border-zinc-200/80 bg-white px-6 shrink-0 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-200 animate-pulse font-extrabold text-transparent select-none text-lg">
            A
          </div>
          <div className="space-y-1.5 animate-pulse">
            <div className="h-4 w-32 bg-zinc-200 rounded-md" />
            <div className="h-3 w-48 bg-zinc-100 rounded-md" />
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 animate-pulse">
          <span className="h-2 w-2 rounded-full bg-zinc-200" />
          <div className="h-3.5 w-36 bg-zinc-150 rounded-md" />
        </div>
      </header>

      {/* Main Split Area Skeleton */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        
        {/* Sidebar Skeleton (Persistent on Desktop) */}
        <aside className="w-96 flex flex-col border-r border-zinc-200/80 bg-white shrink-0 shadow-3xs h-full">
          <div className="p-4 border-b border-zinc-200/80 flex flex-col gap-3 animate-pulse">
            {/* Search Input Box */}
            <div className="h-9 w-full bg-zinc-100 rounded-lg" />
            {/* Dropdown Filters */}
            <div className="grid grid-cols-2 gap-2">
              <div className="h-8 bg-zinc-100 rounded-md" />
              <div className="h-8 bg-zinc-100 rounded-md" />
            </div>
            {/* Badge Filters */}
            <div className="flex gap-2 pt-2 border-t border-zinc-100">
              <div className="h-5 w-8 bg-zinc-100 rounded-full" />
              <div className="h-5 w-12 bg-zinc-100 rounded-full" />
              <div className="h-5 w-12 bg-zinc-100 rounded-full" />
            </div>
          </div>

          {/* Job List items */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-[#fafafa] animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white border border-zinc-200/60 rounded-xl p-4 space-y-3 shadow-3xs">
                <div className="flex justify-between items-start">
                  <div className="h-4 w-40 bg-zinc-200 rounded-md" />
                  <div className="h-3.5 w-12 bg-zinc-100 rounded-md" />
                </div>
                <div className="flex gap-1.5 pt-1">
                  <div className="h-4 w-16 bg-zinc-100 rounded-md" />
                  <div className="h-4 w-16 bg-zinc-100 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Viewport content placeholder skeleton */}
        <main className="flex-1 flex flex-col bg-[#fafafa] overflow-hidden">
          {/* Viewport loading panel */}
          <div className="flex-1 flex flex-col min-h-0 animate-pulse">
            {/* Stats grid */}
            <div className="p-6 pb-2 shrink-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white border border-zinc-200/80 rounded-xl p-4 shadow-3xs space-y-2">
                    <div className="h-3 w-20 bg-zinc-100 rounded-md" />
                    <div className="h-6 w-16 bg-zinc-200 rounded-md" />
                  </div>
                ))}
              </div>
            </div>

            {/* Header bar placeholder */}
            <div className="px-6 py-5 bg-white border-y border-zinc-200/80 flex justify-between items-center gap-4 shrink-0 shadow-3xs">
              <div className="space-y-2">
                <div className="h-5 w-56 bg-zinc-200 rounded-md" />
                <div className="h-3 w-40 bg-zinc-100 rounded-md" />
              </div>
              <div className="h-8 w-24 bg-zinc-200 rounded-lg" />
            </div>

            {/* Content text block placeholder */}
            <div className="flex-1 p-6 space-y-4">
              <div className="h-3 w-1/4 bg-zinc-200 rounded-md" />
              <div className="space-y-2.5 bg-white border border-zinc-200/80 rounded-xl p-5 shadow-3xs">
                <div className="h-4 w-3/4 bg-zinc-200 rounded-md" />
                <div className="h-3 w-full bg-zinc-100 rounded-md" />
                <div className="h-3 w-full bg-zinc-100 rounded-md" />
                <div className="h-3 w-5/6 bg-zinc-100 rounded-md" />
              </div>
            </div>

          </div>
        </main>

      </div>
    </div>
  );
}
