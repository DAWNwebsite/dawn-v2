import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

interface ContentBlock {
  id: string;
  moduleId: string;
  title: string;
  order: number;
  contentType: string;
  contentData: any;
  difficultyLevel: string;
  isRequired: boolean;
  estimatedTime?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Mock learning module data for development
const mockModules = {
  'module-1': {
    id: 'module-1',
    title: 'Introduction to Reading',
    description: 'Learn the basics of reading comprehension with interactive exercises designed for neurodivergent learners.',
    subject: 'Reading',
    targetAudience: 'elementary',
    difficultyLevel: 'beginner',
    estimatedTime: 30,
    isActive: true,
    order: 1,
    contentBlocks: [
      {
        id: 'block-1-1',
        moduleId: 'module-1',
        title: 'Letter Recognition',
        order: 1,
        contentType: 'interactive_exercise',
        contentData: {
          type: 'letter_matching',
          instructions: 'Match the letters with their sounds',
          items: [
            { letter: 'A', sound: 'ay', image: '/images/apple.png' },
            { letter: 'B', sound: 'bee', image: '/images/ball.png' },
          ]
        },
        difficultyLevel: 'beginner',
        isRequired: true,
        estimatedTime: 10,
      },
      {
        id: 'block-1-2',
        moduleId: 'module-1',
        title: 'Simple Words',
        order: 2,
        contentType: 'text',
        contentData: {
          text: 'Now let\'s practice reading simple words.',
          fontSize: 'large',
          dyslexiaFriendly: true,
        },
        difficultyLevel: 'beginner',
        isRequired: true,
        estimatedTime: 15,
      }
    ]
  },
  'module-2': {
    id: 'module-2',
    title: 'Basic Math Concepts',
    description: 'Learn fundamental math concepts with visual aids and hands-on activities.',
    subject: 'Mathematics',
    targetAudience: 'elementary',
    difficultyLevel: 'beginner',
    estimatedTime: 45,
    isActive: true,
    order: 2,
    contentBlocks: [
      {
        id: 'block-2-1',
        moduleId: 'module-2',
        title: 'Counting to 10',
        order: 1,
        contentType: 'interactive_exercise',
        contentData: {
          type: 'counting',
          instructions: 'Count the objects and select the correct number',
          maxNumber: 10,
          visualAids: true,
        },
        difficultyLevel: 'beginner',
        isRequired: true,
        estimatedTime: 20,
      }
    ]
  }
};

// GET /api/learning/modules/[moduleId] - Fetch a specific learning module and its content blocks
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  try {
    const { moduleId } = await params;

    // Validate moduleId
    if (!moduleId) {
      return NextResponse.json(
        { error: 'Module ID is required' },
        { status: 400 }
      );
    }

    // For now, return mock data
    const module = mockModules[moduleId as keyof typeof mockModules];
    
    if (!module) {
      return NextResponse.json(
        { error: 'Learning module not found' },
        { status: 404 }
      );
    }

    // Add timestamps
    const now = new Date().toISOString();
    const formattedModule = {
      ...module,
      createdAt: now,
      updatedAt: now,
      contentBlocks: module.contentBlocks.map(block => ({
        ...block,
        createdAt: now,
        updatedAt: now,
      })),
      userProgress: {
        id: `progress-user-${moduleId}`,
        userId: 'mock-user-id',
        moduleId: moduleId,
        status: 'not_started',
        score: null,
        timeSpent: null,
        attempts: 0,
        lastAccessed: now,
        completedAt: null,
        createdAt: now,
        updatedAt: now,
      }
    };

    return NextResponse.json({
      success: true,
      data: formattedModule,
    });

  } catch (error) {
    console.error('Error fetching learning module:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 