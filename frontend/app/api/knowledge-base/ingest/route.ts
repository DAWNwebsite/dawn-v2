import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { dataIngestionPipeline } from '@/lib/vector-db/data-ingestion';
import { ContentType, DocumentMetadata, IngestionResult } from '@/lib/vector-db/types';

/**
 * POST /api/knowledge-base/ingest
 * 
 * Ingest educational content into the knowledge base
 * Restricted to admin users only
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { 
      content, 
      title, 
      contentType, 
      subject,
      gradeLevel,
      difficultyLevel,
      learningObjectives,
      disabilityTypes,
      applicableSubjects,
      assessmentType,
      resourceType,
      url,
      author,
      tags
    } = body;

    // Validate required fields
    if (!content || !title || !contentType) {
      return NextResponse.json(
        { error: 'Content, title, and contentType are required' },
        { status: 400 }
      );
    }

    // Validate content type
    if (!Object.values(ContentType).includes(contentType)) {
      return NextResponse.json(
        { error: 'Invalid content type' },
        { status: 400 }
      );
    }

    let result: IngestionResult;

    // Route to appropriate ingestion method based on content type
    switch (contentType) {
      case ContentType.LEARNING_MODULE:
        if (!subject || !gradeLevel || !difficultyLevel) {
          return NextResponse.json(
            { error: 'Learning modules require subject, gradeLevel, and difficultyLevel' },
            { status: 400 }
          );
        }
        result = await dataIngestionPipeline.ingestLearningModule(
          `lm_${Date.now()}`,
          title,
          content,
          subject,
          gradeLevel,
          difficultyLevel,
          learningObjectives || []
        );
        break;

      case ContentType.ASSESSMENT:
        if (!subject || !gradeLevel || !assessmentType) {
          return NextResponse.json(
            { error: 'Assessments require subject, gradeLevel, and assessmentType' },
            { status: 400 }
          );
        }
        result = await dataIngestionPipeline.ingestAssessment(
          `assess_${Date.now()}`,
          title,
          content,
          subject,
          gradeLevel,
          assessmentType
        );
        break;

      case ContentType.ACCOMMODATION:
        if (!disabilityTypes || !applicableSubjects) {
          return NextResponse.json(
            { error: 'Accommodations require disabilityTypes and applicableSubjects' },
            { status: 400 }
          );
        }
        result = await dataIngestionPipeline.ingestAccommodation(
          `accom_${Date.now()}`,
          title,
          content.split('\n\n')[0] || '', // description
          content, // strategy
          disabilityTypes,
          applicableSubjects
        );
        break;

      case ContentType.RESOURCE:
        if (!resourceType || !subject || !gradeLevel) {
          return NextResponse.json(
            { error: 'Resources require resourceType, subject, and gradeLevel' },
            { status: 400 }
          );
        }
        result = await dataIngestionPipeline.ingestResource(
          `res_${Date.now()}`,
          title,
          content,
          resourceType,
          subject,
          gradeLevel,
          url
        );
        break;

      default:
        // Generic ingestion for other content types
        const metadata: DocumentMetadata = {
          id: `content_${Date.now()}`,
          documentId: `content_${Date.now()}`,
          title,
          author: author || session.user.name || 'Admin',
          source: url || 'manual_upload',
          chunkIndex: 0,
          category: 'best-practice',
          contentType,
          subject,
          gradeLevel,
          difficultyLevel,
          learningObjectives,
          disabilityTypes,
          applicableSubjects,
          assessmentType,
          resourceType,
          url,
          tags: tags || [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        result = await dataIngestionPipeline.ingestContent(content, metadata);
        break;
    }

    // Log ingestion for audit trail
    console.log(`Content ingested by admin ${session.user.id}: ${result.documentId}`);

    return NextResponse.json({
      success: true,
      data: result,
      message: result.success ? 'Content successfully ingested' : 'Ingestion failed',
    });

  } catch (error) {
    console.error('Content ingestion error:', error);
    
    return NextResponse.json(
      { 
        error: 'Ingestion failed',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/knowledge-base/ingest/stats
 * 
 * Get ingestion statistics (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Get ingestion statistics
    const stats = await dataIngestionPipeline.getIngestionStats();

    return NextResponse.json({
      success: true,
      data: stats,
    });

  } catch (error) {
    console.error('Failed to get ingestion stats:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to get statistics',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
} 