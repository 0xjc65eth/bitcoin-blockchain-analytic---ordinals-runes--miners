"use client"

import { ErrorFallback } from '@/components/error-fallback'

interface ErrorPageProps {
  error: Error;
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return <ErrorFallback error={error} resetErrorBoundary={reset} />;
}