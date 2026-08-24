import { useRef, useState, useCallback } from 'react';
import { cn } from '../../utils/cn';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  className?: string;
}

export function Tooltip({ text, children, className }: TooltipProps) {
  const triggerRef = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, maxWidth: 220 });

  const show = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const margin = 8;
    const maxWidth = Math.min(220, window.innerWidth - 2 * margin);
    const idealLeft = rect.left + rect.width / 2 - maxWidth / 2;
    const left = Math.max(margin, Math.min(idealLeft, window.innerWidth - maxWidth - margin));
    setPos({ top: rect.bottom + 8, left, maxWidth });
    setVisible(true);
  }, []);

  const hide = useCallback(() => setVisible(false), []);

  return (
    <span
      ref={triggerRef}
      className={cn('inline-flex', className)}
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      {children}
      <span
        style={{ top: pos.top, left: pos.left, maxWidth: pos.maxWidth }}
        className={cn(
          'pointer-events-none fixed z-50 rounded-lg whitespace-normal min-w-32',
          'bg-slate-900 px-3 py-2 text-xs leading-snug text-slate-100 text-left',
          'ring-1 ring-slate-600 shadow-lg',
          'transition-opacity duration-150',
          visible ? 'opacity-100' : 'opacity-0',
        )}
      >
        {text}
      </span>
    </span>
  );
}
