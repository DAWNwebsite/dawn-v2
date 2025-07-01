import http from 'k6/http';
import { check, sleep } from 'k6';

// Test configuration
export const options = {
  stages: [
    { duration: '30s', target: 20 }, // Ramp-up to 20 virtual users over 30 seconds
    { duration: '1m', target: 20 },  // Stay at 20 virtual users for 1 minute
    { duration: '10s', target: 0 },  // Ramp-down to 0 users
  ],
  thresholds: {
    'http_req_duration': ['p(95)<500'], // 95% of requests must complete below 500ms
    'http_req_failed': ['rate<0.01'],   // Error rate must be less than 1%
  },
};

const BASE_URL = 'http://host.docker.internal:3000'; // Use this hostname to access the host from a Docker container
const INTERNAL_API_KEY = __ENV.INTERNAL_API_KEY || '';

export default function () {
  // Test the main page
  const pageRes = http.get(BASE_URL);
  check(pageRes, {
    'homepage is status 200': (r) => r.status === 200,
  });

  sleep(1);

  // Test the internal publish endpoint (simulating a backend service)
  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': INTERNAL_API_KEY,
  };

  const payload = JSON.stringify({
    target: { userId: `user-${__VU}` }, // Use virtual user ID to create unique users
    event: 'test-load',
    data: { message: `Load test from k6 user ${__VU}` },
  });

  const apiRes = http.post(`${BASE_URL}/api/internal/publish`, payload, { headers });
  check(apiRes, {
    'publish endpoint is status 202': (r) => r.status === 202,
  });

  sleep(2);
}
