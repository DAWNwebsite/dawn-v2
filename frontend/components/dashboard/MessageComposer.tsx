'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MessageComposerProps {
  recipients?: { id: string; name: string; role: string }[];
  onMessageSent?: () => void;
  className?: string;
}

export function MessageComposer({ recipients = [], onMessageSent, className }: MessageComposerProps) {
  const [recipientId, setRecipientId] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [messageType, setMessageType] = useState<string>('general');
  const [priority, setPriority] = useState<string>('normal');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Create a new conversation first
      const conversationResponse = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: subject || 'New Message',
          type: messageType,
          priority,
          participantIds: recipientId ? [recipientId] : []
        }),
      });

      if (!conversationResponse.ok) {
        throw new Error('Failed to create conversation');
      }

      const conversationData = await conversationResponse.json();
      const targetConversationId = conversationData.data.id;

      // Send the message
      const messageResponse = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId: targetConversationId,
          content,
          messageType: 'text'
        }),
      });

      if (!messageResponse.ok) {
        const errorData = await messageResponse.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      setSuccess('Message sent successfully!');
      setContent('');
      setSubject('');
      setRecipientId('');
      onMessageSent?.();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={`w-full max-w-2xl ${className}`}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Send Secure Message</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Recipient Selection */}
          {recipients.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="recipient">Send to</Label>
              <Select value={recipientId} onValueChange={setRecipientId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select recipient" />
                </SelectTrigger>
                <SelectContent>
                  {recipients.map((recipient) => (
                    <SelectItem key={recipient.id} value={recipient.id}>
                      {recipient.name} ({recipient.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Message Type */}
          <div className="space-y-2">
            <Label htmlFor="messageType">Message Type</Label>
            <Select value={messageType} onValueChange={setMessageType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="academic">Academic</SelectItem>
                <SelectItem value="behavioral">Behavioral</SelectItem>
                <SelectItem value="administrative">Administrative</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Subject (optional) */}
          <div className="space-y-2">
            <Label htmlFor="subject">Subject (optional)</Label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter subject..."
            />
          </div>

          {/* Message Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Message *</Label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px] resize-y"
              placeholder="Type your message..."
            />
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
              {success}
            </div>
          )}

          {/* Submit Button */}
          <Button 
            type="submit" 
            disabled={isLoading || !content.trim()}
            className="w-full"
          >
            {isLoading ? 'Sending...' : 'Send Message'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
