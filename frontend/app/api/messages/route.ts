import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// POST /api/messages - Send a new message
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { conversationId, content, messageType = 'text', metadata } = body;

    if (!conversationId || !content) {
      return NextResponse.json(
        { error: 'Conversation ID and content are required' },
        { status: 400 }
      );
    }

    // Verify the user is a participant in the conversation
    const participant = await prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: {
          conversationId,
          userId: session.user.id
        }
      }
    });

    if (!participant || !participant.canMessage) {
      return NextResponse.json(
        { error: 'You are not authorized to send messages in this conversation' },
        { status: 403 }
      );
    }

    // Create the message
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: session.user.id,
        content,
        messageType,
        metadata: metadata || [],
        readBy: [session.user.id] // Sender has read the message
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        conversation: {
          select: {
            id: true,
            subject: true,
            type: true
          }
        }
      }
    });

    // Update conversation's last activity
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { lastActivity: new Date() }
    });

    return NextResponse.json({
      success: true,
      data: message
    });

  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/messages - Fetch messages (with optional conversation filter)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let whereClause: any = {
      isDeleted: false
    };

    if (conversationId) {
      // Verify user is a participant in the conversation
      const participant = await prisma.conversationParticipant.findUnique({
        where: {
          conversationId_userId: {
            conversationId,
            userId: session.user.id
          }
        }
      });

      if (!participant) {
        return NextResponse.json(
          { error: 'You are not authorized to view this conversation' },
          { status: 403 }
        );
      }

      whereClause.conversationId = conversationId;
    } else {
      // Get messages from conversations where user is a participant
      const userConversations = await prisma.conversationParticipant.findMany({
        where: { userId: session.user.id },
        select: { conversationId: true }
      });

      whereClause.conversationId = {
        in: userConversations.map(p => p.conversationId)
      };
    }

    const messages = await prisma.message.findMany({
      where: whereClause,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        conversation: {
          select: {
            id: true,
            subject: true,
            type: true,
            priority: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset
    });

    return NextResponse.json({
      success: true,
      data: messages,
      pagination: {
        limit,
        offset,
        total: messages.length
      }
    });

  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
