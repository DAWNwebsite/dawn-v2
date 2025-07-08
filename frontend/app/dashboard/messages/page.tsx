'use client';

import { MessageList } from '@/components/dashboard/MessageList';
import { MessageComposer } from '@/components/dashboard/MessageComposer';

export default function MessagesPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-muted-foreground">
          Communicate with teachers, parents, and administrators.
        </p>
      </header>
      
      <div className="space-y-4">
        <MessageComposer />
        <MessageList />
      </div>
    </div>
  );
} 