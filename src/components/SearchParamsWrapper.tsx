'use client';

import { Suspense, ReactNode } from 'react';

interface SearchParamsWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function SearchParamsWrapper({ 
  children, 
  fallback = (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div>Loading...</div>
    </div>
  )
}: SearchParamsWrapperProps) {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
}