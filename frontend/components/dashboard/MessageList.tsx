'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  content: string;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    role: string;
  };
  conversation: {
    id: string;
    subject: string;
    type: string;
    priority: string;
  };
}

interface Conversation {
  id: string;
  subject: string;
  type: string;
  priority: string;
  status: string;
  lastActivity: string;
  unreadCount?: number;
  messages: Message[];
  participants: Array<{
    user: {
      id: string;
      name: string;
      role: string;
    };
  }>;
}

interface MessageListProps {
  className?: string;
}

export function MessageList({ className }: MessageListProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/conversations');
      
      if (!response.ok) {
        throw new Error('Failed to fetch conversations');
      }

      const data = await response.json();
      setConversations(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load conversations');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/messages?conversationId=${conversationId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      setMessages(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    }
  };

  const handleConversationClick = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    fetchMessages(conversation.id);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'academic': return 'bg-green-100 text-green-800';
      case 'behavioral': return 'bg-purple-100 text-purple-800';
      case 'administrative': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center">Loading messages...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center text-red-600">{error}</div>
          <Button onClick={fetchConversations} className="mt-4 w-full">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-3 gap-4 h-96 ${className}`}>
      {/* Conversations List */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Messages ({conversations.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-80 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No conversations yet
              </div>
            ) : (
              conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                    selectedConversation?.id === conversation.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handleConversationClick(conversation)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-sm truncate">
                      {conversation.subject || 'No Subject'}
                    </h4>
                    {conversation.unreadCount && conversation.unreadCount > 0 && (
                      <Badge className="bg-red-500 text-white text-xs">
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-2 mb-2">
                    <Badge className={`text-xs ${getTypeColor(conversation.type)}`}>
                      {conversation.type}
                    </Badge>
                    <Badge className={`text-xs ${getPriorityColor(conversation.priority)}`}>
                      {conversation.priority}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDate(conversation.lastActivity)}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {conversation.participants.length} participant(s)
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Messages View */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            {selectedConversation ? selectedConversation.subject || 'Conversation' : 'Select a conversation'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedConversation ? (
            <div className="max-h-80 overflow-y-auto space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500">
                  No messages in this conversation
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className="border-b pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">
                          {message.sender.name}
                        </span>
                        <Badge className="text-xs bg-gray-100 text-gray-800">
                          {message.sender.role}
                        </Badge>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDate(message.createdAt)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-700 whitespace-pre-wrap">
                      {message.content}
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              Select a conversation to view messages
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
