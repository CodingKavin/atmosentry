import { useRef, useState } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { cn } from '../utils/cn';
import type { GeoResult } from '../types/geo';

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSelect: (location: GeoResult) => void;
  results?: GeoResult[];
  isSearching?: boolean;
  isLoading?: boolean;
}

export function SearchBar({
  value,
  onChange,
  onSelect,
  results,
  isSearching = false,
  isLoading = false,
}: Props) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const showDropdown = isOpen && results !== undefined;

  function handleChange(v: string) {
    onChange(v);
    setIsOpen(true);
    setActiveIndex(-1);
  }

  function handleSelect(location: GeoResult) {
    onSelect(location);
    setIsOpen(false);
    setActiveIndex(-1);
  }

  function handleClear() {
    onChange('');
    setIsOpen(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!showDropdown) return;
    const count = results?.length ?? 0;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, count - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && results?.[activeIndex]) {
        handleSelect(results[activeIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  }

  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none z-10" />
      <input
        ref={inputRef}
        type="text"
        role="combobox"
        aria-expanded={showDropdown}
        aria-autocomplete="list"
        aria-haspopup="listbox"
        value={value}
        onChange={e => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        placeholder="Search city…"
        className={cn(
          'w-full rounded-xl bg-slate-800 py-2.5 pl-10 pr-10 text-sm text-slate-100',
          'placeholder:text-slate-500 outline-none',
          'ring-1 ring-slate-700 focus:ring-sky-500 transition-[box-shadow]',
        )}
      />

      <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
        {isLoading ? (
          <Loader2 className="size-4 text-sky-400 animate-spin" />
        ) : isSearching ? (
          <Loader2 className="size-4 text-slate-400 animate-spin" />
        ) : value ? (
          <button
            onMouseDown={e => {
              e.preventDefault();
              handleClear();
            }}
            className="text-slate-500 hover:text-slate-300 transition-colors"
            aria-label="Clear search"
            tabIndex={-1}
          >
            <X className="size-4" />
          </button>
        ) : null}
      </div>

      {showDropdown && (
        <ul
          role="listbox"
          className={cn(
            'absolute z-20 top-full mt-1 w-full overflow-hidden shadow-lg',
            'rounded-xl bg-slate-800 ring-1 ring-slate-700',
          )}
        >
          {results.length === 0 ? (
            <li className="px-4 py-3 text-sm text-slate-500 select-none">
              No results found
            </li>
          ) : (
            results.map((location, index) => (
              <li
                key={`${location.latitude}-${location.longitude}`}
                role="option"
                aria-selected={index === activeIndex}
                onMouseDown={e => {
                  e.preventDefault();
                  handleSelect(location);
                }}
                onMouseEnter={() => setActiveIndex(index)}
                className={cn(
                  'px-4 py-2.5 text-sm cursor-pointer transition-colors select-none',
                  index === activeIndex
                    ? 'bg-slate-700 text-slate-100'
                    : 'text-slate-300 hover:bg-slate-700/60',
                )}
              >
                <span className="font-medium text-slate-100">{location.name}</span>
                {location.admin1 && (
                  <span className="text-slate-400">, {location.admin1}</span>
                )}
                <span className="text-slate-500">, {location.country}</span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
