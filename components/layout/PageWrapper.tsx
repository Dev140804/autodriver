'use client';

import React from 'react';

interface PageWrapperProps {
  children: React.ReactNode;
}

export default function PageWrapper({ children }: PageWrapperProps) {
  return <div className="page-slide">{children}</div>;
}