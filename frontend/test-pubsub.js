const io = require('socket.io-client');
const Redis = require('ioredis');

console.log('🧪 Testing Redis Pub/Sub with WebSocket integration...');

// Create Redis publisher for testing
const publisher = new Redis({
  host: 'localhost',
  port: 6379,
  retryDelayOnFailover: 100,
  enableReadyCheck: true,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
});

// Create WebSocket client
const socket = io('http://localhost:3000', {
  path: '/api/ws',
  transports: ['websocket', 'polling'],
});

let testResults = {
  socketConnection: false,
  redisConnection: false,
  pubSubDelivery: false,
  bidirectionalComm: false,
};

socket.on('connect', () => {
  console.log('✅ WebSocket connected');
  testResults.socketConnection = true;
  
  // Subscribe to notifications for testing
  socket.emit('subscribe-notifications');
  
  // Test publishing via WebSocket
  socket.emit('publish-test-notification', {
    message: 'Test from WebSocket client',
    timestamp: new Date().toISOString(),
  });
});

socket.on('connected', (data) => {
  console.log('🎉 WebSocket welcome:', data);
  console.log('📡 Pub/Sub enabled:', data.pubSubEnabled);
});

socket.on('test-notification', (data) => {
  console.log('🔔 Received notification via Pub/Sub:', data);
  testResults.pubSubDelivery = true;
});

socket.on('publish-success', (data) => {
  console.log('✅ WebSocket publish successful:', data);
  testResults.bidirectionalComm = true;
});

socket.on('publish-error', (data) => {
  console.log('❌ WebSocket publish failed:', data);
});

socket.on('disconnect', (reason) => {
  console.log('❌ WebSocket disconnected:', reason);
});

socket.on('connect_error', (error) => {
  console.log('❌ WebSocket connection error:', error.message);
});

// Test Redis publishing
publisher.on('ready', async () => {
  console.log('✅ Redis publisher ready');
  testResults.redisConnection = true;
  
  // Wait a bit for WebSocket to be ready
  setTimeout(async () => {
    try {
      // Test direct Redis publishing to notification channel
      const message = {
        channel: 'notifications:mock-user-id',
        event: 'test-notification',
        data: {
          message: 'Test notification from Redis publisher',
          timestamp: new Date().toISOString(),
          source: 'redis-direct',
        },
        timestamp: new Date().toISOString(),
        serverId: 'test-publisher',
      };

      const subscribers = await publisher.publish(
        'notifications:mock-user-id',
        JSON.stringify(message)
      );

      console.log(`📤 Published to Redis (${subscribers} subscribers)`);
    } catch (error) {
      console.error('❌ Failed to publish to Redis:', error);
    }
  }, 2000);
});

publisher.on('error', (error) => {
  console.log('❌ Redis publisher error:', error.message);
});

// Connect to Redis
publisher.connect().catch(error => {
  console.error('❌ Failed to connect Redis publisher:', error.message);
});

// Test summary after 10 seconds
setTimeout(() => {
  console.log('\n📊 Test Results Summary:');
  console.log('Socket Connection:', testResults.socketConnection ? '✅ PASS' : '❌ FAIL');
  console.log('Redis Connection:', testResults.redisConnection ? '✅ PASS' : '❌ FAIL');
  console.log('Pub/Sub Delivery:', testResults.pubSubDelivery ? '✅ PASS' : '❌ FAIL');
  console.log('Bidirectional Comm:', testResults.bidirectionalComm ? '✅ PASS' : '❌ FAIL');
  
  const passedTests = Object.values(testResults).filter(Boolean).length;
  const totalTests = Object.keys(testResults).length;
  
  console.log(`\n🎯 Overall: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All Redis Pub/Sub tests passed!');
  } else {
    console.log('⚠️ Some tests failed - check Redis and WebSocket server');
  }
  
  socket.disconnect();
  publisher.quit();
  process.exit(passedTests === totalTests ? 0 : 1);
}, 10000);
