import { NextRequest, NextResponse } from 'next/server';

interface ProgressUpdate {
  moduleId?: string;
  contentBlockId?: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'skipped';
  score?: number;
  timeSpent?: number;
}

// Mock progress storage (in production, this would be in the database)
let mockProgressData: { [key: string]: any } = {};

// POST /api/learning/progress - Log user progress on a content block or module
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, moduleId, contentBlockId, status, score, timeSpent }: {
      userId: string;
      moduleId?: string;
      contentBlockId?: string;
      status: string;
      score?: number;
      timeSpent?: number;
    } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!moduleId && !contentBlockId) {
      return NextResponse.json(
        { error: 'Either moduleId or contentBlockId is required' },
        { status: 400 }
      );
    }

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ['not_started', 'in_progress', 'completed', 'skipped'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    // Validate score if provided
    if (score !== undefined && (score < 0 || score > 100)) {
      return NextResponse.json(
        { error: 'Score must be between 0 and 100' },
        { status: 400 }
      );
    }

    // Create progress record
    const progressId = contentBlockId 
      ? `${userId}-${contentBlockId}` 
      : `${userId}-${moduleId}`;

    const now = new Date().toISOString();
    const progressRecord = {
      id: progressId,
      userId,
      moduleId: moduleId || null,
      contentBlockId: contentBlockId || null,
      status,
      score: score || null,
      timeSpent: timeSpent || null,
      attempts: (mockProgressData[progressId]?.attempts || 0) + 1,
      lastAccessed: now,
      completedAt: status === 'completed' ? now : null,
      createdAt: mockProgressData[progressId]?.createdAt || now,
      updatedAt: now,
    };

    // Store in mock data (in production, this would be saved to database)
    mockProgressData[progressId] = progressRecord;

    return NextResponse.json({
      success: true,
      message: 'Progress updated successfully',
      data: progressRecord,
    });

  } catch (error) {
    console.error('Error updating progress:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/learning/progress - Get user progress (with query parameters)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const moduleId = searchParams.get('moduleId');
    const contentBlockId = searchParams.get('contentBlockId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Filter progress records
    let progressRecords = Object.values(mockProgressData).filter(
      (record: any) => record.userId === userId
    );

    if (moduleId) {
      progressRecords = progressRecords.filter(
        (record: any) => record.moduleId === moduleId
      );
    }

    if (contentBlockId) {
      progressRecords = progressRecords.filter(
        (record: any) => record.contentBlockId === contentBlockId
      );
    }

    return NextResponse.json({
      success: true,
      data: progressRecords,
    });

  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 