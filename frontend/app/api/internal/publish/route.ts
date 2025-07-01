import { NextRequest, NextResponse } from 'next/server';
import { redisPubSub } from '@/lib/redis/pubsub';

/**
 * API route to publish real-time events via Redis Pub/Sub.
 *
 * This endpoint is intended for internal use by other backend services.
 * It must be secured by an API key.
 *
 * @param {NextRequest} req - The incoming request object.
 * @returns {NextResponse} The response object.
 */
export async function POST(req: NextRequest) {
  // 1. Authenticate the request
  const apiKey = req.headers.get('x-api-key');
  if (apiKey !== process.env.INTERNAL_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Validate the request body
  let body;
  try {
    body = await req.json();
  } catch (error) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { channel, event, data, target } = body;

  if (!event || !data) {
    return NextResponse.json(
      { error: 'Missing required fields: event and data are required.' },
      { status: 400 }
    );
  }

  if (!channel && !target) {
    return NextResponse.json(
      { error: 'Missing required fields: channel or target (userId, role) is required.' },
      { status: 400 }
    );
  }

  // 3. Publish the event using the Redis Pub/Sub service
  try {
    if (target?.userId) {
      const channel = `notifications:${target.userId}`;
      await redisPubSub.publish(channel, event, data, { userId: target.userId });
    } else if (target?.role) {
      const channel = `role:${target.role.toLowerCase()}`;
      await redisPubSub.publish(channel, event, data, { targetRoles: [target.role] });
    } else if (channel) {
      await redisPubSub.publish(channel, event, data);
    } else {
      // If no specific target, broadcast to a system channel
      await redisPubSub.publishSystem(event, data);
    }

    return NextResponse.json(
      { success: true, message: 'Event published successfully.' },
      { status: 202 } // 202 Accepted
    );
  } catch (error) {
    console.error('❌ Failed to publish event via internal API:', error);
    return NextResponse.json(
      { error: 'Failed to publish event.', details: error.message },
      { status: 500 }
    );
  }
}
