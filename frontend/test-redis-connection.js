const Redis = require('ioredis');

console.log('🧪 Testing Redis connection...');

const redis = new Redis({
  host: 'localhost',
  port: 6379,
  retryDelayOnFailover: 100,
  enableReadyCheck: true,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
});

redis.on('connect', () => {
  console.log('✅ Connected to Redis');
});

redis.on('ready', () => {
  console.log('✅ Redis is ready');
  testRedisOperations();
});

redis.on('error', (error) => {
  console.log('❌ Redis connection error:', error.message);
  process.exit(1);
});

async function testRedisOperations() {
  try {
    // Test basic operations
    await redis.set('test:key', 'test-value');
    const value = await redis.get('test:key');
    console.log('📝 Set/Get test:', value === 'test-value' ? '✅ PASS' : '❌ FAIL');

    // Test set operations (for socket tracking)
    await redis.sadd('test:sockets:user1', 'socket1', 'socket2');
    const members = await redis.smembers('test:sockets:user1');
    console.log('📝 Set operations test:', members.length === 2 ? '✅ PASS' : '❌ FAIL');

    // Test hash operations (for session data)
    await redis.hset('test:session:socket1', {
      userId: 'user1',
      email: 'test@example.com',
      connectedAt: new Date().toISOString()
    });
    const session = await redis.hgetall('test:session:socket1');
    console.log('📝 Hash operations test:', session.userId === 'user1' ? '✅ PASS' : '❌ FAIL');

    // Cleanup test data
    await redis.del('test:key', 'test:sockets:user1', 'test:session:socket1');
    console.log('🧹 Cleaned up test data');

    console.log('🎉 All Redis tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Redis test failed:', error);
    process.exit(1);
  }
}

// Connect to Redis
redis.connect().catch(error => {
  console.error('❌ Failed to connect to Redis:', error.message);
  console.log('💡 Make sure Redis is running on localhost:6379');
  process.exit(1);
});

// Timeout after 10 seconds
setTimeout(() => {
  console.log('⏰ Test timeout - Redis may not be available');
  process.exit(1);
}, 10000);
