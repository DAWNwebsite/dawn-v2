import { NextRequest } from 'next/server';
import { webSocketServer } from '@/lib/websocket/server';

// Handle WebSocket status requests
export async function GET(req: NextRequest) {
  const io = webSocketServer.getIO();
  
  return Response.json({
    status: 'WebSocket server is running',
    initialized: !!io,
    timestamp: new Date().toISOString(),
  });
}

// Handle POST requests for server-side event publishing
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { room, event, data, userId, role } = body;

    const io = webSocketServer.getIO();
    if (!io) {
      return Response.json({ 
        error: 'WebSocket server not initialized' 
      }, { status: 500 });
    }

    // Emit event based on target type
    if (userId) {
      webSocketServer.emitToUser(userId, event, data);
    } else if (role) {
      webSocketServer.emitToRole(role, event, data);
    } else if (room) {
      webSocketServer.emitToRoom(room, event, data);
    } else {
      webSocketServer.broadcast(event, data);
    }

    return Response.json({ 
      success: true, 
      message: 'Event sent successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('WebSocket POST error:', error);
    return Response.json({ 
      error: 'Failed to send event',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
