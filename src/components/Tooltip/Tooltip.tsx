import { cn } from '../../utils/cn';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  className?: string;
}

export function Tooltip({ text, children, className }: TooltipProps) {
  return (
    <span className={cn('group relative inline-flex', className)}>
      {children}
      <span className="
        pointer-events-none absolute left-1/2 top-full z-10 mt-1.5
        -translate-x-1/2 whitespace-nowrap rounded-lg
        bg-slate-950 px-2.5 py-1.5 text-[11px] text-slate-300
        ring-1 ring-slate-700
        opacity-0 transition-opacity duration-150 group-hover:opacity-100
      ">
        {text}
      </span>
    </span>
  );
}
