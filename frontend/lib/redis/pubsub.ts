import Redis from 'ioredis';
import { getRedisClient } from './client';

export interface PubSubMessage {
  channel: string;
  event: string;
  data: any;
  timestamp: string;
  serverId?: string;
  userId?: string;
  targetUsers?: string[];
  targetRoles?: string[];
}

export interface ChannelPattern {
  pattern: string;
  description: string;
  handler: (channel: string, message: PubSubMessage) => Promise<void>;
}

class RedisPubSubService {
  private publisher: Redis;
  private subscriber: Redis;
  private isInitialized = false;
  private channelHandlers = new Map<string, (channel: string, message: PubSubMessage) => Promise<void>>();
  private serverId: string;

  constructor() {
    this.serverId = `server-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.publisher = getRedisClient();
    
    // Create separate subscriber instance (Redis requirement)
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    this.subscriber = new Redis(redisUrl, {
      retryStrategy(times) {
        const delay = Math.min(times * 100, 2000);
        return delay;
      },
      enableReadyCheck: true,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });

    this.setupSubscriberEvents();
  }

  private setupSubscriberEvents() {
    this.subscriber.on('connect', () => {
      console.log('📡 Redis Pub/Sub subscriber connected');
    });

    this.subscriber.on('ready', () => {
      console.log('✅ Redis Pub/Sub subscriber ready');
    });

    this.subscriber.on('error', (error) => {
      console.error('❌ Redis Pub/Sub subscriber error:', error);
    });

    this.subscriber.on('message', async (channel: string, message: string) => {
      try {
        const parsedMessage: PubSubMessage = JSON.parse(message);
        
        // Skip messages from the same server instance to prevent loops
        if (parsedMessage.serverId === this.serverId) {
          return;
        }

        console.log(`📨 Received message on channel ${channel}:`, parsedMessage.event);
        
        // Find and execute the appropriate handler
        const handler = this.channelHandlers.get(channel);
        if (handler) {
          await handler(channel, parsedMessage);
        } else {
          // Try pattern matching for wildcard handlers
          for (const [pattern, patternHandler] of this.channelHandlers.entries()) {
            if (this.matchesPattern(channel, pattern)) {
              await patternHandler(channel, parsedMessage);
              break;
            }
          }
        }
      } catch (error) {
        console.error(`❌ Failed to process message on channel ${channel}:`, error);
      }
    });

    this.subscriber.on('pmessage', async (pattern: string, channel: string, message: string) => {
      try {
        const parsedMessage: PubSubMessage = JSON.parse(message);
        
        // Skip messages from the same server instance
        if (parsedMessage.serverId === this.serverId) {
          return;
        }

        console.log(`📨 Received pattern message on ${pattern} -> ${channel}:`, parsedMessage.event);
        
        const handler = this.channelHandlers.get(pattern);
        if (handler) {
          await handler(channel, parsedMessage);
        }
      } catch (error) {
        console.error(`❌ Failed to process pattern message on ${pattern} -> ${channel}:`, error);
      }
    });
  }

  /**
   * Initialize the pub/sub service with channel subscriptions
   */
  async initialize(channelPatterns: ChannelPattern[] = []): Promise<void> {
    if (this.isInitialized) {
      console.log('⚠️ Redis Pub/Sub service already initialized');
      return;
    }

    try {
      // Connect subscriber
      await this.subscriber.connect();

      // Set up default channel patterns for DAWN AI Study
      const defaultPatterns: ChannelPattern[] = [
        {
          pattern: 'notifications:*',
          description: 'User-specific notifications',
          handler: this.handleNotificationMessage.bind(this),
        },
        {
          pattern: 'progress:*',
          description: 'User progress updates',
          handler: this.handleProgressMessage.bind(this),
        },
        {
          pattern: 'chat:*',
          description: 'Chat and messaging',
          handler: this.handleChatMessage.bind(this),
        },
        {
          pattern: 'system:*',
          description: 'System-wide broadcasts',
          handler: this.handleSystemMessage.bind(this),
        },
        {
          pattern: 'role:*',
          description: 'Role-based messages',
          handler: this.handleRoleMessage.bind(this),
        },
      ];

      // Combine default patterns with custom ones
      const allPatterns = [...defaultPatterns, ...channelPatterns];

      // Subscribe to patterns and register handlers
      for (const { pattern, description, handler } of allPatterns) {
        if (pattern.includes('*')) {
          await this.subscriber.psubscribe(pattern);
          console.log(`🔔 Subscribed to pattern: ${pattern} (${description})`);
        } else {
          await this.subscriber.subscribe(pattern);
          console.log(`🔔 Subscribed to channel: ${pattern} (${description})`);
        }
        
        this.channelHandlers.set(pattern, handler);
      }

      this.isInitialized = true;
      console.log(`✅ Redis Pub/Sub service initialized (Server ID: ${this.serverId})`);
    } catch (error) {
      console.error('❌ Failed to initialize Redis Pub/Sub service:', error);
      throw error;
    }
  }

  /**
   * Publish a message to a specific channel
   */
  async publish(channel: string, event: string, data: any, options: {
    userId?: string;
    targetUsers?: string[];
    targetRoles?: string[];
  } = {}): Promise<void> {
    try {
      const message: PubSubMessage = {
        channel,
        event,
        data,
        timestamp: new Date().toISOString(),
        serverId: this.serverId,
        userId: options.userId,
        targetUsers: options.targetUsers,
        targetRoles: options.targetRoles,
      };

      const messageStr = JSON.stringify(message);
      const subscribers = await this.publisher.publish(channel, messageStr);
      
      console.log(`📤 Published ${event} to ${channel} (${subscribers} subscribers)`);
    } catch (error) {
      console.error(`❌ Failed to publish to channel ${channel}:`, error);
      throw error;
    }
  }

  /**
   * Publish a notification to a specific user
   */
  async publishNotification(userId: string, event: string, data: any): Promise<void> {
    await this.publish(`notifications:${userId}`, event, data, { userId });
  }

  /**
   * Publish a progress update for a specific user
   */
  async publishProgress(userId: string, event: string, data: any): Promise<void> {
    await this.publish(`progress:${userId}`, event, data, { userId });
  }

  /**
   * Publish a message to a chat room
   */
  async publishChat(conversationId: string, event: string, data: any, fromUserId?: string): Promise<void> {
    await this.publish(`chat:${conversationId}`, event, data, { userId: fromUserId });
  }

  /**
   * Publish a system-wide message
   */
  async publishSystem(event: string, data: any): Promise<void> {
    await this.publish('system:broadcast', event, data);
  }

  /**
   * Publish a message to users of a specific role
   */
  async publishToRole(role: string, event: string, data: any): Promise<void> {
    await this.publish(`role:${role.toLowerCase()}`, event, data, { targetRoles: [role] });
  }

  /**
   * Default handler for notification messages
   */
  private async handleNotificationMessage(channel: string, message: PubSubMessage): Promise<void> {
    const userId = channel.split(':')[1];
    if (userId && this.webSocketHandler) {
      await this.webSocketHandler.emitToUser(userId, message.event, message.data);
    }
  }

  /**
   * Default handler for progress messages
   */
  private async handleProgressMessage(channel: string, message: PubSubMessage): Promise<void> {
    const userId = channel.split(':')[1];
    if (userId && this.webSocketHandler) {
      await this.webSocketHandler.emitToUser(userId, message.event, message.data);
    }
  }

  /**
   * Default handler for chat messages
   */
  private async handleChatMessage(channel: string, message: PubSubMessage): Promise<void> {
    const conversationId = channel.split(':')[1];
    if (conversationId && this.webSocketHandler) {
      this.webSocketHandler.emitToRoom(`chat:${conversationId}`, message.event, message.data);
    }
  }

  /**
   * Default handler for system messages
   */
  private async handleSystemMessage(channel: string, message: PubSubMessage): Promise<void> {
    if (this.webSocketHandler) {
      this.webSocketHandler.broadcast(message.event, message.data);
    }
  }

  /**
   * Default handler for role-based messages
   */
  private async handleRoleMessage(channel: string, message: PubSubMessage): Promise<void> {
    const role = channel.split(':')[1];
    if (role && this.webSocketHandler) {
      this.webSocketHandler.emitToRole(role, message.event, message.data);
    }
  }

  /**
   * Simple pattern matching for channel patterns
   */
  private matchesPattern(channel: string, pattern: string): boolean {
    if (!pattern.includes('*')) return channel === pattern;
    
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
    return regex.test(channel);
  }

  /**
   * Set the WebSocket handler for message forwarding
   */
  private webSocketHandler: any = null;
  
  setWebSocketHandler(handler: any): void {
    this.webSocketHandler = handler;
    console.log('🔗 WebSocket handler connected to Pub/Sub service');
  }

  /**
   * Get service statistics
   */
  async getStats(): Promise<{
    serverId: string;
    isInitialized: boolean;
    subscribedChannels: number;
    publisherConnected: boolean;
    subscriberConnected: boolean;
  }> {
    return {
      serverId: this.serverId,
      isInitialized: this.isInitialized,
      subscribedChannels: this.channelHandlers.size,
      publisherConnected: this.publisher.status === 'ready',
      subscriberConnected: this.subscriber.status === 'ready',
    };
  }

  /**
   * Graceful shutdown
   */
  async shutdown(): Promise<void> {
    try {
      console.log('🔚 Shutting down Redis Pub/Sub service...');
      
      if (this.subscriber.status === 'ready') {
        await this.subscriber.unsubscribe();
        await this.subscriber.punsubscribe();
        await this.subscriber.quit();
      }

      this.isInitialized = false;
      console.log('✅ Redis Pub/Sub service shut down gracefully');
    } catch (error) {
      console.error('❌ Error during Pub/Sub shutdown:', error);
    }
  }
}

// Export singleton instance
export const redisPubSub = new RedisPubSubService();
export default redisPubSub;
