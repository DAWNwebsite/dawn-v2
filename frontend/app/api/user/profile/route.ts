import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET /api/user/profile - Fetch user's learning profile
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch the user's learning profile
    const learningProfile = await prisma.learningProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            dateOfBirth: true
          }
        }
      }
    });

    if (!learningProfile) {
      // If no profile exists, create a default one
      const defaultProfile = await prisma.learningProfile.create({
        data: {
          userId: session.user.id,
          learningDisabilities: [],
          learningStyle: 'visual',
          difficultyLevel: 'beginner',
          preferredSubjects: [],
          accommodations: [],
          subjectStrengthsWeaknesses: {},
          preferredPace: 'medium',
          attentionSpanMinutes: 25,
          preferredTimeOfDay: 'morning',
          breakFrequencyMinutes: 10,
          multitaskingPreference: false,
          sensoryProcessingNotes: '',
          communicationPreferences: 'visual',
          executiveFunctionSupport: false,
          preferredRewardSystem: 'badges',
          interestAreas: '',
          feedbackStyle: 'direct',
          assessmentFormat: 'multiple_choice',
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              dateOfBirth: true
            }
          }
        }
      });

      return NextResponse.json({
        success: true,
        data: defaultProfile
      });
    }

    return NextResponse.json({
      success: true,
      data: learningProfile
    });

  } catch (error) {
    console.error('Error fetching learning profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/user/profile - Update user's learning profile
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      learningDisabilities,
      learningStyle,
      difficultyLevel,
      preferredSubjects,
      accommodations
    } = body;

    // Validate input data
    if (learningStyle && !['visual', 'auditory', 'kinesthetic', 'reading/writing'].includes(learningStyle)) {
      return NextResponse.json(
        { error: 'Invalid learning style' },
        { status: 400 }
      );
    }

    if (difficultyLevel && !['beginner', 'intermediate', 'advanced'].includes(difficultyLevel)) {
      return NextResponse.json(
        { error: 'Invalid difficulty level' },
        { status: 400 }
      );
    }

    // Prepare update data - only include fields that are provided
    const updateData: any = {};
    if (learningDisabilities !== undefined) updateData.learningDisabilities = learningDisabilities;
    if (learningStyle !== undefined) updateData.learningStyle = learningStyle;
    if (difficultyLevel !== undefined) updateData.difficultyLevel = difficultyLevel;
    if (preferredSubjects !== undefined) updateData.preferredSubjects = preferredSubjects;
    if (accommodations !== undefined) updateData.accommodations = accommodations;

    // Update or create the learning profile
    const updatedProfile = await prisma.learningProfile.upsert({
      where: { userId: session.user.id },
      update: updateData,
      create: {
        userId: session.user.id,
        learningDisabilities: learningDisabilities || [],
        learningStyle: learningStyle || 'visual',
        difficultyLevel: difficultyLevel || 'beginner',
        preferredSubjects: preferredSubjects || [],
        accommodations: accommodations || [],
        subjectStrengthsWeaknesses: {},
        preferredPace: 'medium',
        attentionSpanMinutes: 25,
        preferredTimeOfDay: 'morning',
        breakFrequencyMinutes: 10,
        multitaskingPreference: false,
        sensoryProcessingNotes: '',
        communicationPreferences: 'visual',
        executiveFunctionSupport: false,
        preferredRewardSystem: 'badges',
        interestAreas: '',
        feedbackStyle: 'direct',
        assessmentFormat: 'multiple_choice',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            dateOfBirth: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedProfile,
      message: 'Learning profile updated successfully'
    });

  } catch (error) {
    console.error('Error updating learning profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 