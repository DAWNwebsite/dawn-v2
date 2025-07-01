import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// POST /api/conversations - Create a new conversation
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { subject, type = 'general', priority = 'normal', participantIds = [], isConfidential = false } = body;

    if (!participantIds.includes(session.user.id)) {
      participantIds.push(session.user.id);
    }

    // Create the conversation
    const conversation = await prisma.conversation.create({
      data: {
        subject,
        type,
        priority,
        isConfidential,
        participants: {
          create: participantIds.map((userId: string, index: number) => ({
            userId,
            role: index === 0 ? session.user.role || 'student' : 'participant',
            canMessage: true,
            canModerate: userId === session.user.id
          }))
        }
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true
              }
            }
          }
        },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: conversation
    });

  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/conversations - Fetch user's conversations
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'active';
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    let whereClause: any = {
      status,
      participants: {
        some: {
          userId: session.user.id
        }
      }
    };

    if (type) {
      whereClause.type = type;
    }

    const conversations = await prisma.conversation.findMany({
      where: whereClause,
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true
              }
            }
          }
        },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                role: true
              }
            }
          }
        },
        _count: {
          select: {
            messages: {
              where: {
                isDeleted: false
              }
            }
          }
        }
      },
      orderBy: {
        lastActivity: 'desc'
      },
      take: limit,
      skip: offset
    });

    // Calculate unread message counts for each conversation
    const conversationsWithUnreadCounts = await Promise.all(
      conversations.map(async (conversation) => {
        const unreadCount = await prisma.message.count({
          where: {
            conversationId: conversation.id,
            isDeleted: false,
            NOT: {
              readBy: {
                array_contains: session.user.id
              }
            }
          }
        });

        return {
          ...conversation,
          unreadCount
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: conversationsWithUnreadCounts,
      pagination: {
        limit,
        offset,
        total: conversations.length
      }
    });

  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
