const io = require('socket.io-client');
const fetch = require('node-fetch'); // Using node-fetch for backend requests

console.log('🧪 Starting End-to-End Real-Time Publish Test...');

const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY || 'your-fallback-api-key';
const BASE_URL = 'http://localhost:3000';
const MOCK_USER_ID = 'mock-user-id';

let testResults = {
  socketConnection: false,
  apiPublishSuccess: false,
  clientReceivedMessage: false,
};

// 1. WebSocket Client Setup
const socket = io(BASE_URL, {
  path: '/api/ws',
  transports: ['websocket'],
  auth: { userId: MOCK_USER_ID } // Pass mock user ID for association
});

socket.on('connect', () => {
  console.log(`✅ WebSocket client connected for user ${MOCK_USER_ID}`);
  testResults.socketConnection = true;

  // Join the notification channel for this user
  socket.emit('subscribe-notifications');

  // Trigger the API publish after connection is established
  setTimeout(publishEventViaApi, 1000);
});

socket.on('progress-update', (data) => {
  console.log('🎉 Client received progress-update event:', data);
  if (data.taskId === 'task-123' && data.status === 'completed') {
    testResults.clientReceivedMessage = true;
  }
  
  // End the test after receiving the message
  setTimeout(summarizeAndExit, 500);
});

socket.on('connect_error', (err) => {
  console.error('❌ WebSocket connection error:', err.message);
  summarizeAndExit(1);
});

socket.on('disconnect', (reason) => {
  console.log('🔌 WebSocket disconnected:', reason);
});

// 2. API Publishing Function
async function publishEventViaApi() {
  console.log('🚀 Publishing event via internal API...');
  
  const payload = {
    target: {
      userId: MOCK_USER_ID
    },
    event: 'progress-update',
    data: {
      taskId: 'task-123',
      status: 'completed',
      message: `Progress update for user ${MOCK_USER_ID}`
    }
  };

  try {
    const response = await fetch(`${BASE_URL}/api/internal/publish`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': INTERNAL_API_KEY,
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 202) {
      console.log('✅ API publish request accepted');
      testResults.apiPublishSuccess = true;
    } else {
      console.error(`❌ API publish failed with status: ${response.status}`);
      const body = await response.json();
      console.error('Error details:', body);
      summarizeAndExit(1);
    }
  } catch (error) {
    console.error('❌ Error publishing via API:', error.message);
    summarizeAndExit(1);
  }
}

// 3. Test Summary and Exit
function summarizeAndExit(exitCode = undefined) {
  console.log('\n📊 E2E Test Results Summary:');
  console.log('Socket Connection:', testResults.socketConnection ? '✅ PASS' : '❌ FAIL');
  console.log('API Publish Success:', testResults.apiPublishSuccess ? '✅ PASS' : '❌ FAIL');
  console.log('Client Received Message:', testResults.clientReceivedMessage ? '✅ PASS' : '❌ FAIL');
  
  const passedTests = Object.values(testResults).filter(Boolean).length;
  const totalTests = Object.keys(testResults).length;
  
  console.log(`\n🎯 Overall: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All E2E real-time tests passed!');
  } else {
    console.log('⚠️ Some E2E tests failed.');
  }
  
  socket.disconnect();
  process.exit(exitCode !== undefined ? exitCode : (passedTests === totalTests ? 0 : 1));
}

// Timeout to prevent the test from running indefinitely
setTimeout(() => {
  console.log('⏰ Test timed out.');
  summarizeAndExit(1);
}, 10000);
