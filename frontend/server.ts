import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { webSocketServer } from './lib/websocket/server';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
  const httpServer = createServer(async (req, res) => {
    try {
      if (req.url) {
        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
      }
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  try {
    // Initialize WebSocket server with Redis Pub/Sub
    await webSocketServer.initialize(httpServer);
    
    httpServer
      .once('error', (err) => {
        console.error(err);
        process.exit(1);
      })
      .listen(port, () => {
        console.log(`🚀 Ready on http://${hostname}:${port}`);
        console.log('🔌 WebSocket server with Redis Pub/Sub initialized');
      });

    // Graceful shutdown handling
    process.on('SIGTERM', async () => {
      console.log('📴 SIGTERM received, shutting down gracefully...');
      await webSocketServer.shutdown();
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      console.log('📴 SIGINT received, shutting down gracefully...');
      await webSocketServer.shutdown();
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Failed to initialize WebSocket server:', error);
    process.exit(1);
  }
});
