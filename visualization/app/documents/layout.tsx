import React from 'react';

export default function DocumentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-zinc-100 p-6">
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
        {children}
      </div>
    </div>
  );
}
