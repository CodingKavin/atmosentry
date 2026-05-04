export function AQISkeleton() {
  return (
    <div className="w-full max-w-md rounded-2xl bg-slate-800 ring-1 ring-slate-700 p-6 space-y-5 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-5 w-32 rounded-md bg-slate-700" />
          <div className="h-4 w-20 rounded-md bg-slate-700/60" />
        </div>
        <div className="h-14 w-16 rounded-xl bg-slate-700" />
      </div>

      <div className="h-7 w-28 rounded-full bg-slate-700" />

      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="rounded-xl bg-slate-900/60 p-3 space-y-2">
            <div className="h-3 w-14 rounded bg-slate-700/60" />
            <div className="h-5 w-20 rounded bg-slate-700" />
          </div>
        ))}
      </div>

      <div className="h-3 w-28 rounded bg-slate-700/40 ml-auto" />
    </div>
  );
}
