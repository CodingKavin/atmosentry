import { Search, X, Loader2 } from 'lucide-react';
import { cn } from '../utils/cn';

interface Props {
  value: string;
  onChange: (v: string) => void;
  isLoading?: boolean;
}

export function SearchBar({ value, onChange, isLoading = false }: Props) {
  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search city…"
        className={cn(
          'w-full rounded-xl bg-slate-800 py-2.5 pl-10 pr-10 text-sm text-slate-100',
          'placeholder:text-slate-500 outline-none',
          'ring-1 ring-slate-700 focus:ring-sky-500 transition-[box-shadow]',
        )}
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2">
        {isLoading ? (
          <Loader2 className="size-4 text-sky-400 animate-spin" />
        ) : value ? (
          <button
            onClick={() => onChange('')}
            className="text-slate-500 hover:text-slate-300 transition-colors"
          >
            <X className="size-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
