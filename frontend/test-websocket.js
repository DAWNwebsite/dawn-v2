const io = require('socket.io-client');

console.log('🧪 Testing WebSocket connection...');

const socket = io('http://localhost:3000', {
  path: '/api/ws',
  transports: ['websocket', 'polling'],
});

socket.on('connect', () => {
  console.log('✅ Connected to WebSocket server');
  console.log('Socket ID:', socket.id);
  
  // Test ping
  socket.emit('ping', (response) => {
    console.log('📡 Ping response:', response);
  });
  
  // Test room joining
  socket.emit('join-room', 'test-room');
  
  // Test notification subscription
  socket.emit('subscribe-notifications');
});

socket.on('connected', (data) => {
  console.log('🎉 Welcome message:', data);
});

socket.on('room-joined', (data) => {
  console.log('🏠 Joined room:', data);
});

socket.on('disconnect', (reason) => {
  console.log('❌ Disconnected:', reason);
});

socket.on('connect_error', (error) => {
  console.log('❌ Connection error:', error.message);
});

// Keep the test running for 10 seconds
setTimeout(() => {
  console.log('🔚 Test completed, disconnecting...');
  socket.disconnect();
  process.exit(0);
}, 10000);
