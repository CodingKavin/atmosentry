import { useRef, useState } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Typography } from '../Typography/Typography';
import type { GeoResult } from '../../types/geo';

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
    <div className="relative w-full max-w-md md:max-w-lg lg:max-w-xl">
      <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 size-4 md:size-5 text-slate-400 pointer-events-none z-10" />
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
          'w-full rounded-xl bg-slate-800 py-2.5 md:py-3 pl-10 md:pl-12 pr-10 md:pr-12',
          'text-sm md:text-base text-slate-100',
          'placeholder:text-slate-500 outline-none',
          'ring-1 ring-slate-700 focus:ring-sky-500 transition-[box-shadow]',
        )}
      />

      <div className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 z-10">
        {isLoading ? (
          <Loader2 className="size-4 md:size-5 text-sky-400 animate-spin" />
        ) : isSearching ? (
          <Loader2 className="size-4 md:size-5 text-slate-400 animate-spin" />
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
            <X className="size-4 md:size-5" />
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
            <li className="px-4 md:px-5 py-3 md:py-4 text-slate-500 select-none">
              <Typography variant="cardSub">No results found</Typography>
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
                  'px-4 md:px-5 py-2.5 md:py-3 cursor-pointer transition-colors select-none',
                  index === activeIndex
                    ? 'bg-slate-700 text-slate-100'
                    : 'text-slate-300 hover:bg-slate-700/60',
                )}
              >
                <Typography variant="cardSub" className="font-medium text-slate-100">{location.name}</Typography>
                {location.admin1 && (
                  <Typography variant="cardSub" className="text-slate-400">, {location.admin1}</Typography>
                )}
                <Typography variant="cardSub" className="text-slate-500">, {location.country}</Typography>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
