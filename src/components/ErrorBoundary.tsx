import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { useQueryClient } from '@tanstack/react-query';
import type { ReactNode } from 'react';

function Fallback({ error, resetErrorBoundary }: FallbackProps) {
  const qc = useQueryClient();

  function handleReset() {
    qc.clear();
    resetErrorBoundary();
  }

  return (
    <div className="w-full max-w-md rounded-2xl bg-slate-800 ring-1 ring-red-800/50 p-6 space-y-4 text-center">
      <p className="text-sm font-medium text-red-400">Something went wrong</p>
      <p className="text-xs text-slate-500 break-all">
        {error instanceof Error ? error.message : 'An unexpected error occurred'}
      </p>
      <button
        onClick={handleReset}
        className="rounded-xl bg-sky-500 px-5 py-2 text-sm font-medium text-white hover:bg-sky-400 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}

export function AppErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary FallbackComponent={Fallback}>
      {children}
    </ErrorBoundary>
  );
}
