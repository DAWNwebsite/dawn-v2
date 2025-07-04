import Redis from 'ioredis';

// Create Redis client instance
let redisClient: Redis | null = null;

export function getRedisClient(): Redis {
  if (!redisClient) {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    console.log(`Attempting to connect to Redis at: ${redisUrl}`);

    redisClient = new Redis(redisUrl, {
      retryStrategy(times) {
        const delay = Math.min(times * 100, 2000);
        return delay;
      },
      enableReadyCheck: true,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });

    redisClient.on('connect', () => {
      console.log('🔗 Redis client connected');
    });

    redisClient.on('ready', () => {
      console.log('✅ Redis client ready');
    });

    redisClient.on('error', (error) => {
      console.error('❌ Redis client error:', error);
    });

    redisClient.on('close', () => {
      console.log('🔌 Redis client connection closed');
    });

    redisClient.on('reconnecting', () => {
      console.log('🔄 Redis client reconnecting...');
    });
  }

  return redisClient;
}

// Graceful shutdown
export async function closeRedisConnection(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    console.log('🔚 Redis connection closed gracefully');
  }
}

// Export the client for direct use
export const redis = getRedisClient();
export default redis;
