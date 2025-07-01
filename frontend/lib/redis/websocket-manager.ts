import { redis } from './client';
import { Socket } from 'socket.io';

interface UserSession {
  userId: string;
  socketId: string;
  userEmail: string;
  userRole: string;
  connectedAt: string;
  lastActivity: string;
}

export class WebSocketSessionManager {
  private readonly SOCKET_KEY_PREFIX = 'user:sockets:';
  private readonly SESSION_KEY_PREFIX = 'session:';
  private readonly USER_STATUS_KEY_PREFIX = 'user:status:';
  private readonly ACTIVE_USERS_SET = 'active_users';

  /**
   * Register a new WebSocket connection in Redis
   */
  async registerConnection(userId: string, socketId: string, userEmail: string, userRole: string): Promise<void> {
    try {
      const timestamp = new Date().toISOString();
      const session: UserSession = {
        userId,
        socketId,
        userEmail,
        userRole,
        connectedAt: timestamp,
        lastActivity: timestamp,
      };

      // Use Redis pipeline for atomic operations
      const pipeline = redis.pipeline();

      // Add socket ID to user's socket set
      pipeline.sadd(`${this.SOCKET_KEY_PREFIX}${userId}`, socketId);

      // Store session details
      pipeline.hset(`${this.SESSION_KEY_PREFIX}${socketId}`, session);

      // Set user status to online
      pipeline.hset(`${this.USER_STATUS_KEY_PREFIX}${userId}`, {
        status: 'online',
        lastSeen: timestamp,
        socketCount: await this.getUserSocketCount(userId) + 1,
      });

      // Add user to active users set
      pipeline.sadd(this.ACTIVE_USERS_SET, userId);

      // Set expiration for session (24 hours)
      pipeline.expire(`${this.SESSION_KEY_PREFIX}${socketId}`, 24 * 60 * 60);

      await pipeline.exec();

      console.log(`📝 Registered WebSocket connection: User ${userId} (${userEmail}) -> Socket ${socketId}`);
    } catch (error) {
      console.error('❌ Failed to register WebSocket connection:', error);
      throw error;
    }
  }

  /**
   * Unregister a WebSocket connection from Redis
   */
  async unregisterConnection(socketId: string): Promise<void> {
    try {
      // Get session details first
      const session = await redis.hgetall(`${this.SESSION_KEY_PREFIX}${socketId}`);
      
      if (!session.userId) {
        console.warn(`⚠️ No session found for socket ${socketId}`);
        return;
      }

      const userId = session.userId;
      const pipeline = redis.pipeline();

      // Remove socket ID from user's socket set
      pipeline.srem(`${this.SOCKET_KEY_PREFIX}${userId}`, socketId);

      // Delete session details
      pipeline.del(`${this.SESSION_KEY_PREFIX}${socketId}`);

      // Check if user has other active connections
      const remainingSocketCount = await this.getUserSocketCount(userId) - 1;

      if (remainingSocketCount <= 0) {
        // User has no more active connections, set to offline
        pipeline.hset(`${this.USER_STATUS_KEY_PREFIX}${userId}`, {
          status: 'offline',
          lastSeen: new Date().toISOString(),
          socketCount: 0,
        });

        // Remove from active users set
        pipeline.srem(this.ACTIVE_USERS_SET, userId);
      } else {
        // Update socket count
        pipeline.hset(`${this.USER_STATUS_KEY_PREFIX}${userId}`, 'socketCount', remainingSocketCount);
      }

      await pipeline.exec();

      console.log(`🗑️ Unregistered WebSocket connection: Socket ${socketId} (User ${userId})`);
    } catch (error) {
      console.error('❌ Failed to unregister WebSocket connection:', error);
      throw error;
    }
  }

  /**
   * Get all socket IDs for a specific user
   */
  async getUserSockets(userId: string): Promise<string[]> {
    try {
      return await redis.smembers(`${this.SOCKET_KEY_PREFIX}${userId}`);
    } catch (error) {
      console.error(`❌ Failed to get sockets for user ${userId}:`, error);
      return [];
    }
  }

  /**
   * Get the number of active socket connections for a user
   */
  async getUserSocketCount(userId: string): Promise<number> {
    try {
      return await redis.scard(`${this.SOCKET_KEY_PREFIX}${userId}`);
    } catch (error) {
      console.error(`❌ Failed to get socket count for user ${userId}:`, error);
      return 0;
    }
  }

  /**
   * Get user status (online/offline)
   */
  async getUserStatus(userId: string): Promise<{ status: string; lastSeen: string; socketCount: number } | null> {
    try {
      const status = await redis.hgetall(`${this.USER_STATUS_KEY_PREFIX}${userId}`);
      if (!status.status) return null;

      return {
        status: status.status,
        lastSeen: status.lastSeen,
        socketCount: parseInt(status.socketCount || '0', 10),
      };
    } catch (error) {
      console.error(`❌ Failed to get status for user ${userId}:`, error);
      return null;
    }
  }

  /**
   * Get all currently active users
   */
  async getActiveUsers(): Promise<string[]> {
    try {
      return await redis.smembers(this.ACTIVE_USERS_SET);
    } catch (error) {
      console.error('❌ Failed to get active users:', error);
      return [];
    }
  }

  /**
   * Update user's last activity timestamp
   */
  async updateLastActivity(socketId: string): Promise<void> {
    try {
      const timestamp = new Date().toISOString();
      await redis.hset(`${this.SESSION_KEY_PREFIX}${socketId}`, 'lastActivity', timestamp);
    } catch (error) {
      console.error(`❌ Failed to update last activity for socket ${socketId}:`, error);
    }
  }

  /**
   * Get session information for a socket
   */
  async getSession(socketId: string): Promise<UserSession | null> {
    try {
      const session = await redis.hgetall(`${this.SESSION_KEY_PREFIX}${socketId}`);
      if (!session.userId) return null;

      return session as UserSession;
    } catch (error) {
      console.error(`❌ Failed to get session for socket ${socketId}:`, error);
      return null;
    }
  }

  /**
   * Clean up expired or orphaned sessions
   */
  async cleanupSessions(): Promise<void> {
    try {
      console.log('🧹 Starting WebSocket session cleanup...');

      // Get all session keys
      const sessionKeys = await redis.keys(`${this.SESSION_KEY_PREFIX}*`);
      
      let cleanedCount = 0;
      for (const sessionKey of sessionKeys) {
        const ttl = await redis.ttl(sessionKey);
        
        // If TTL is -1 (no expiration) or session is very old, clean it up
        if (ttl === -1) {
          const socketId = sessionKey.replace(this.SESSION_KEY_PREFIX, '');
          await this.unregisterConnection(socketId);
          cleanedCount++;
        }
      }

      console.log(`🧹 Cleaned up ${cleanedCount} expired sessions`);
    } catch (error) {
      console.error('❌ Failed to cleanup sessions:', error);
    }
  }

  /**
   * Get comprehensive connection statistics
   */
  async getConnectionStats(): Promise<{
    totalActiveSessions: number;
    activeUsers: number;
    averageConnectionsPerUser: number;
  }> {
    try {
      const sessionKeys = await redis.keys(`${this.SESSION_KEY_PREFIX}*`);
      const activeUsers = await redis.scard(this.ACTIVE_USERS_SET);
      
      return {
        totalActiveSessions: sessionKeys.length,
        activeUsers,
        averageConnectionsPerUser: activeUsers > 0 ? sessionKeys.length / activeUsers : 0,
      };
    } catch (error) {
      console.error('❌ Failed to get connection stats:', error);
      return {
        totalActiveSessions: 0,
        activeUsers: 0,
        averageConnectionsPerUser: 0,
      };
    }
  }
}

// Export singleton instance
export const wsSessionManager = new WebSocketSessionManager();
export default wsSessionManager;
