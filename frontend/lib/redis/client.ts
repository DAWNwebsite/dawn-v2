import Redis from 'ioredis';

// Redis client configuration
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0', 10),
  retryDelayOnFailover: 100,
  enableReadyCheck: true,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
};

// Create Redis client instance
let redisClient: Redis | null = null;

export function getRedisClient(): Redis {
  if (!redisClient) {
    redisClient = new Redis(redisConfig);

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
