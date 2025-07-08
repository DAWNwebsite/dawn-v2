import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET /api/user/accessibility - Fetch user's accessibility preferences
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch the user's accessibility preferences
    const accessibilityPreferences = await prisma.accessibilityPreferences.findUnique({
      where: { userId: session.user.id },
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
    });

    if (!accessibilityPreferences) {
      // If no preferences exist, create default ones
      const defaultPreferences = await prisma.accessibilityPreferences.create({
        data: {
          userId: session.user.id,
          fontSize: 16,
          contrastMode: 'default',
          enableTextToSpeech: false,
          prefersReducedMotion: false,
          colorBlindnessSupport: 'none',
          keyboardNavigation: true,
          screenReaderOptimized: false,
          focusIndicatorStyle: 'default',
        },
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
      });

      return NextResponse.json({
        success: true,
        data: defaultPreferences
      });
    }

    return NextResponse.json({
      success: true,
      data: accessibilityPreferences
    });

  } catch (error) {
    console.error('Error fetching accessibility preferences:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/user/accessibility - Update user's accessibility preferences
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      fontSize,
      theme,
      highContrast,
      reducedMotion,
      screenReader,
      keyboardNavigation,
      focusIndicator,
      textToSpeech,
      closedCaptions
    } = body;

    // Convert font size string to integer
    const fontSizeMap: { [key: string]: number } = {
      small: 14,
      medium: 16,
      large: 18,
      'extra-large': 20,
    };
    const fontSizeInt = fontSize ? fontSizeMap[fontSize] : undefined;

    // Validate input data
    if (fontSize && !fontSizeInt) {
      return NextResponse.json(
        { error: 'Invalid font size' },
        { status: 400 }
      );
    }

    if (theme && !['light', 'dark', 'auto'].includes(theme)) {
      return NextResponse.json(
        { error: 'Invalid theme' },
        { status: 400 }
      );
    }

    // Prepare update data - only include fields that are provided
    const updateData: any = {};
    if (fontSizeInt !== undefined) updateData.fontSize = fontSizeInt;
    if (theme !== undefined) updateData.theme = theme;
    if (highContrast !== undefined) updateData.highContrast = highContrast;
    if (reducedMotion !== undefined) updateData.reducedMotion = reducedMotion;
    if (screenReader !== undefined) updateData.screenReader = screenReader;
    if (keyboardNavigation !== undefined) updateData.keyboardNavigation = keyboardNavigation;
    if (focusIndicator !== undefined) updateData.focusIndicator = focusIndicator;
    if (textToSpeech !== undefined) updateData.textToSpeech = textToSpeech;
    if (closedCaptions !== undefined) updateData.closedCaptions = closedCaptions;

    // Update or create the accessibility preferences
    const updatedPreferences = await prisma.accessibilityPreferences.upsert({
      where: { userId: session.user.id },
      update: updateData,
      create: {
        userId: session.user.id,
        fontSize: fontSizeInt || 16,
        contrastMode: 'default',
        enableTextToSpeech: false,
        prefersReducedMotion: false,
        colorBlindnessSupport: 'none',
        keyboardNavigation: true,
        screenReaderOptimized: false,
        focusIndicatorStyle: 'default',
      },
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
    });

    return NextResponse.json({
      success: true,
      data: updatedPreferences,
      message: 'Accessibility preferences updated successfully'
    });

  } catch (error) {
    console.error('Error updating accessibility preferences:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
