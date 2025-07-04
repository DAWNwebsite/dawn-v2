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
    console.log('🔄 Initializing WebSocket server...');
    await webSocketServer.initialize(httpServer);
    
    httpServer
      .once('error', (err) => {
        console.error(err);
        process.exit(1);
      })
      .listen(port, () => {
        console.log(`🚀 Ready on http://${hostname}:${port}`);
        console.log('🔌 WebSocket server initialized');
        if (dev) {
          console.log('🔧 Running in development mode - Redis errors are non-fatal');
        }
      });

    // Graceful shutdown handling
    const gracefulShutdown = async (signal: string) => {
      console.log(`📴 ${signal} received, shutting down gracefully...`);
      try {
        await webSocketServer.shutdown();
        process.exit(0);
      } catch (error) {
        console.error('❌ Error during shutdown:', error);
        process.exit(1);
      }
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error('❌ Failed to initialize server:', error);
    
    if (dev) {
      console.log('🔧 Development mode: Starting server without Redis features...');
      
      // Start a basic HTTP server without WebSocket/Redis
      httpServer
        .once('error', (err) => {
          console.error(err);
          process.exit(1);
        })
        .listen(port, () => {
          console.log(`🚀 Ready on http://${hostname}:${port}`);
          console.log('⚠️  WebSocket/Redis features disabled - start Redis to enable them');
        });
    } else {
      process.exit(1);
    }
  }
});
