import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { wsSessionManager } from '@/lib/redis/websocket-manager';
import { redis } from '@/lib/redis/client';

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

  constructor() {
    this.initialize = this.initialize.bind(this);
    this.handleConnection = this.handleConnection.bind(this);
    this.authenticateSocket = this.authenticateSocket.bind(this);
    this.setupCleanupInterval();
  }

  public initialize(httpServer: HTTPServer): SocketIOServer {
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

    console.log('✅ WebSocket server initialized successfully');
    console.log('🔗 Redis session management enabled');
    return this.io;
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
          if (callback && typeof callback === 'function') {
            callback(stats);
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
            // Emit to user's room that they're offline
            socket.to(`user:${user.id}`).emit('user-status', {
              userId: user.id,
              status: 'offline',
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
      });

      // Get current connection count for user
      const connectionCount = await wsSessionManager.getUserSocketCount(user.id);
      
      // Emit to user's room that they're online (only if this is their first connection)
      if (connectionCount === 1) {
        socket.to(`user:${user.id}`).emit('user-status', {
          userId: user.id,
          status: 'online',
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
   * Get connection statistics
   */
  public async getConnectionStats() {
    return await wsSessionManager.getConnectionStats();
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
}

// Export singleton instance
export const webSocketServerWithRedis = new WebSocketServer();
export default webSocketServerWithRedis;
