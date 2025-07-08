'use client';

import { AidaChat } from '@/components/dashboard/unified/AidaChat';

export default function AidaPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">AIDA</h1>
        <p className="text-muted-foreground">Your personal AI assistant.</p>
      </header>
      <AidaChat />
    </div>
  );
}