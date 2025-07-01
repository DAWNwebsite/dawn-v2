import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { wsSessionManager } from '@/lib/redis/websocket-manager';
import { redis } from '@/lib/redis/client';
import { redisPubSub } from '@/lib/redis/pubsub';

interface AuthenticatedSocket extends Socket {
  data: {
    user: {
      id: string;
      email: string;
      name: string | null;
      role: string;
    };
    userId: string;
  };
}

class WebSocketServer {
  private io: SocketIOServer | null = null;
  private httpServer: HTTPServer | null = null;
  private pubSubInitialized = false;

  constructor() {
    this.initialize = this.initialize.bind(this);
    this.handleConnection = this.handleConnection.bind(this);
    this.authenticateSocket = this.authenticateSocket.bind(this);
    this.setupCleanupInterval();
  }

  public async initialize(httpServer: HTTPServer): Promise<SocketIOServer> {
    if (this.io) {
      return this.io;
    }

    this.httpServer = httpServer;
    this.io = new SocketIOServer(httpServer, {
      path: '/api/ws',
      cors: {
        origin: [
          'http://localhost:3000',
          'http://localhost:3001',
          'http://localhost:3002',
          process.env.NEXTAUTH_URL || 'http://localhost:3000'
        ],
        methods: ['GET', 'POST'],
        credentials: true,
      },
      transports: ['websocket', 'polling'],
    });

    // Apply authentication middleware
    this.io.use(this.authenticateSocket);

    // Handle connections
    this.io.on('connection', this.handleConnection);

    // Initialize Redis Pub/Sub
    await this.initializePubSub();

    console.log('✅ WebSocket server initialized successfully');
    console.log('🔗 Redis session management enabled');
    console.log('📡 Redis Pub/Sub enabled for scalable messaging');
    return this.io;
  }

  /**
   * Initialize Redis Pub/Sub with WebSocket integration
   */
  private async initializePubSub(): Promise<void> {
    if (this.pubSubInitialized) return;

    try {
      // Set this WebSocket server as the handler for pub/sub messages
      redisPubSub.setWebSocketHandler(this);

      // Initialize pub/sub with default channel patterns
      await redisPubSub.initialize();

      this.pubSubInitialized = true;
      console.log('✅ Redis Pub/Sub integrated with WebSocket server');
    } catch (error) {
      console.error('❌ Failed to initialize Redis Pub/Sub:', error);
      throw error;
    }
  }

  private async authenticateSocket(socket: Socket, next: Function) {
    try {
      // Extract session information from cookies or auth headers
      const cookies = socket.handshake.headers.cookie;
      const authToken = socket.handshake.auth.token;

      if (!cookies && !authToken) {
        return next(new Error('Authentication failed: No credentials provided'));
      }

      // For now, we'll use a simplified approach
      // In a real implementation, you'd validate the session token properly
      
      // Mock user data for development - replace with actual session validation
      const mockUser = {
        id: 'mock-user-id',
        email: 'test@example.com',
        name: 'Test User',
        role: 'STUDENT'
      };

      // Attach user data to socket
      (socket as AuthenticatedSocket).data = {
        user: mockUser,
        userId: mockUser.id
      };

      console.log(`🔐 WebSocket: User ${mockUser.email} authenticated`);
      next();
    } catch (error) {
      console.error('❌ WebSocket authentication error:', error);
      next(new Error('Authentication failed'));
    }
  }

  private async handleConnection(socket: AuthenticatedSocket) {
    const user = socket.data.user;
    console.log(`🔌 WebSocket: User ${user.email} connected (Socket ID: ${socket.id})`);

    try {
      // Register connection in Redis
      await wsSessionManager.registerConnection(
        user.id,
        socket.id,
        user.email,
        user.role
      );

      // Join user-specific rooms for targeted messaging
      socket.join(`user:${user.id}`);
      socket.join(`role:${user.role.toLowerCase()}`);

      // Handle ping/pong for connection health
      socket.on('ping', async (callback) => {
        console.log(`📡 Ping received from user ${user.id}`);
        
        // Update last activity in Redis
        await wsSessionManager.updateLastActivity(socket.id);
        
        if (callback && typeof callback === 'function') {
          callback('pong');
        }
      });

      // Handle room management
      socket.on('join-room', (roomId: string) => {
        if (typeof roomId === 'string' && roomId.length > 0) {
          socket.join(roomId);
          console.log(`🏠 User ${user.id} joined room: ${roomId}`);
          socket.emit('room-joined', { roomId, timestamp: new Date().toISOString() });
        }
      });

      socket.on('leave-room', (roomId: string) => {
        if (typeof roomId === 'string') {
          socket.leave(roomId);
          console.log(`🚪 User ${user.id} left room: ${roomId}`);
          socket.emit('room-left', { roomId, timestamp: new Date().toISOString() });
        }
      });

      // Handle custom events
      socket.on('subscribe-notifications', () => {
        socket.join(`notifications:${user.id}`);
        console.log(`🔔 User ${user.id} subscribed to notifications`);
      });

      socket.on('subscribe-progress', () => {
        socket.join(`progress:${user.id}`);
        console.log(`📈 User ${user.id} subscribed to progress updates`);
      });

      // Handle chat room subscriptions
      socket.on('join-chat', (conversationId: string) => {
        if (typeof conversationId === 'string' && conversationId.length > 0) {
          socket.join(`chat:${conversationId}`);
          console.log(`💬 User ${user.id} joined chat: ${conversationId}`);
        }
      });

      socket.on('leave-chat', (conversationId: string) => {
        if (typeof conversationId === 'string') {
          socket.leave(`chat:${conversationId}`);
          console.log(`💬 User ${user.id} left chat: ${conversationId}`);
        }
      });

      // Handle publishing events via WebSocket (for testing)
      socket.on('publish-test-notification', async (data) => {
        try {
          await redisPubSub.publishNotification(user.id, 'test-notification', {
            message: 'Test notification from WebSocket',
            ...data,
            fromUser: user.id,
          });
          socket.emit('publish-success', { type: 'notification', data });
        } catch (error) {
          socket.emit('publish-error', { error: error.message });
        }
      });

      socket.on('publish-test-progress', async (data) => {
        try {
          await redisPubSub.publishProgress(user.id, 'progress-update', {
            message: 'Test progress update from WebSocket',
            ...data,
            fromUser: user.id,
          });
          socket.emit('publish-success', { type: 'progress', data });
        } catch (error) {
          socket.emit('publish-error', { error: error.message });
        }
      });

      // Handle user status requests
      socket.on('get-user-status', async (targetUserId: string, callback) => {
        try {
          const status = await wsSessionManager.getUserStatus(targetUserId);
          if (callback && typeof callback === 'function') {
            callback(status);
          }
        } catch (error) {
          console.error('❌ Failed to get user status:', error);
          if (callback && typeof callback === 'function') {
            callback(null);
          }
        }
      });

      // Handle connection stats requests
      socket.on('get-connection-stats', async (callback) => {
        try {
          const stats = await wsSessionManager.getConnectionStats();
          const pubSubStats = await redisPubSub.getStats();
          
          if (callback && typeof callback === 'function') {
            callback({ ...stats, pubSub: pubSubStats });
          }
        } catch (error) {
          console.error('❌ Failed to get connection stats:', error);
          if (callback && typeof callback === 'function') {
            callback(null);
          }
        }
      });

      // Handle disconnection
      socket.on('disconnect', async (reason) => {
        console.log(`🔌 WebSocket: User ${user.email} disconnected - ${reason}`);
        
        try {
          // Unregister connection from Redis
          await wsSessionManager.unregisterConnection(socket.id);
          
          // Check if user still has other active connections
          const remainingConnections = await wsSessionManager.getUserSocketCount(user.id);
          
          if (remainingConnections === 0) {
            // Publish user offline status via pub/sub
            await redisPubSub.publishSystem('user-offline', {
              userId: user.id,
              userEmail: user.email,
              timestamp: new Date().toISOString(),
            });
          }
        } catch (error) {
          console.error('❌ Failed to handle disconnection cleanup:', error);
        }
      });

      // Send welcome message
      socket.emit('connected', {
        message: 'Connected to DAWN AI Study WebSocket server',
        userId: user.id,
        userRole: user.role,
        timestamp: new Date().toISOString(),
        socketId: socket.id,
        pubSubEnabled: this.pubSubInitialized,
      });

      // Get current connection count for user
      const connectionCount = await wsSessionManager.getUserSocketCount(user.id);
      
      // Emit to user's room that they're online (only if this is their first connection)
      if (connectionCount === 1) {
        // Publish user online status via pub/sub
        await redisPubSub.publishSystem('user-online', {
          userId: user.id,
          userEmail: user.email,
          userRole: user.role,
          timestamp: new Date().toISOString(),
        });
      }

    } catch (error) {
      console.error('❌ Failed to handle WebSocket connection:', error);
      socket.disconnect(true);
    }
  }

  /**
   * Set up periodic cleanup of expired sessions
   */
  private setupCleanupInterval() {
    // Clean up expired sessions every 5 minutes
    setInterval(async () => {
      try {
        await wsSessionManager.cleanupSessions();
      } catch (error) {
        console.error('❌ Session cleanup failed:', error);
      }
    }, 5 * 60 * 1000);
  }

  public getIO(): SocketIOServer | null {
    return this.io;
  }

  /**
   * Emit event to specific user using Redis to find their active sockets
   */
  public async emitToUser(userId: string, event: string, data: any): Promise<boolean> {
    if (!this.io) return false;

    try {
      const socketIds = await wsSessionManager.getUserSockets(userId);
      
      if (socketIds.length === 0) {
        console.log(`📤 No active connections found for user ${userId}`);
        return false;
      }

      // Emit to all user's active sockets
      socketIds.forEach(socketId => {
        this.io?.to(socketId).emit(event, data);
      });

      console.log(`📤 Emitted ${event} to user ${userId} (${socketIds.length} connections)`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to emit to user ${userId}:`, error);
      return false;
    }
  }

  public emitToRole(role: string, event: string, data: any) {
    if (this.io) {
      this.io.to(`role:${role.toLowerCase()}`).emit(event, data);
      console.log(`�� Emitted ${event} to role ${role}`);
    }
  }

  public emitToRoom(room: string, event: string, data: any) {
    if (this.io) {
      this.io.to(room).emit(event, data);
      console.log(`📤 Emitted ${event} to room ${room}`);
    }
  }

  public broadcast(event: string, data: any) {
    if (this.io) {
      this.io.emit(event, data);
      console.log(`📢 Broadcasted ${event} to all clients`);
    }
  }

  /**
   * Publish methods that use Redis Pub/Sub
   */
  public async publishNotification(userId: string, event: string, data: any): Promise<void> {
    await redisPubSub.publishNotification(userId, event, data);
  }

  public async publishProgress(userId: string, event: string, data: any): Promise<void> {
    await redisPubSub.publishProgress(userId, event, data);
  }

  public async publishToRole(role: string, event: string, data: any): Promise<void> {
    await redisPubSub.publishToRole(role, event, data);
  }

  public async publishSystem(event: string, data: any): Promise<void> {
    await redisPubSub.publishSystem(event, data);
  }

  /**
   * Get connection statistics including pub/sub stats
   */
  public async getConnectionStats() {
    const wsStats = await wsSessionManager.getConnectionStats();
    const pubSubStats = await redisPubSub.getStats();
    
    return {
      ...wsStats,
      pubSub: pubSubStats,
    };
  }

  /**
   * Get all active users
   */
  public async getActiveUsers() {
    return await wsSessionManager.getActiveUsers();
  }

  /**
   * Check if a user is online
   */
  public async isUserOnline(userId: string): Promise<boolean> {
    try {
      const status = await wsSessionManager.getUserStatus(userId);
      return status?.status === 'online';
    } catch (error) {
      console.error(`❌ Failed to check if user ${userId} is online:`, error);
      return false;
    }
  }

  /**
   * Graceful shutdown
   */
  public async shutdown(): Promise<void> {
    try {
      console.log('🔚 Shutting down WebSocket server...');
      
      if (this.io) {
        this.io.close();
      }

      await redisPubSub.shutdown();
      
      console.log('✅ WebSocket server shut down gracefully');
    } catch (error) {
      console.error('❌ Error during WebSocket server shutdown:', error);
    }
  }
}

// Export singleton instance
export const webSocketServer = new WebSocketServer();
export default webSocketServer;
