import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { RAGSearchEngine } from '@/lib/vector-db/rag-engine';
import { SearchQuery, RAGResponse } from '@/lib/vector-db/types';

// Initialize RAG search engine
const ragEngine = new RAGSearchEngine();

/**
 * POST /api/knowledge-base/search
 * 
 * Performs semantic search and generates AI-powered responses
 * using the RAG (Retrieval-Augmented Generation) system
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { query, filters, maxResults = 10, includeMetadata = true } = body;

    // Validate required fields
    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 }
      );
    }

    // Build search query with user context
    const searchQuery: SearchQuery = {
      query: query.trim(),
      filters: filters || {},
      topK: Math.min(maxResults, 50), // Limit to 50 results max
      includeMetadata,
    };

    // Get user profile for personalization
    const userContext = {
      userId: session.user.id,
      role: session.user.role || 'student',
      learningDisabilities: session.user.learningDisabilities || [],
      difficultyLevel: session.user.difficultyLevel || 'intermediate',
      preferredSubjects: session.user.preferredSubjects || [],
      age: session.user.age,
    };

    // Perform RAG search and generate response
    const ragResponse: RAGResponse = await ragEngine.search(searchQuery, userContext);

    // Log search for analytics (optional)
    console.log(`Knowledge base search by user ${session.user.id}: "${query}"`);

    return NextResponse.json({
      success: true,
      data: ragResponse,
      metadata: {
        searchTime: ragResponse.searchTime || 0,
        resultsCount: ragResponse.sources.length,
        confidence: ragResponse.confidence,
      },
    });

  } catch (error) {
    console.error('Knowledge base search error:', error);
    
    return NextResponse.json(
      { 
        error: 'Search failed',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/knowledge-base/search
 * 
 * Simple search endpoint for basic queries (fallback)
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get query from URL parameters
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '10');
    const subject = searchParams.get('subject');
    const gradeLevel = searchParams.get('grade');
    const contentType = searchParams.get('type');

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 }
      );
    }

    // Build filters from query parameters
    const filters: any = {};
    if (subject) filters.subject = [subject];
    if (gradeLevel) filters.gradeLevel = [gradeLevel];
    if (contentType) filters.contentType = [contentType];

    // Build search query
    const searchQuery: SearchQuery = {
      query: query.trim(),
      filters,
      topK: Math.min(limit, 20),
      includeMetadata: true,
    };

    // Get user context
    const userContext = {
      userId: session.user.id,
      role: session.user.role || 'student',
      learningDisabilities: session.user.learningDisabilities || [],
      difficultyLevel: session.user.difficultyLevel || 'intermediate',
      preferredSubjects: session.user.preferredSubjects || [],
      age: session.user.age,
    };

    // Perform search
    const ragResponse = await ragEngine.search(searchQuery, userContext);

    return NextResponse.json({
      success: true,
      data: ragResponse,
      metadata: {
        searchTime: ragResponse.searchTime || 0,
        resultsCount: ragResponse.sources.length,
      },
    });

  } catch (error) {
    console.error('Knowledge base GET search error:', error);
    
    return NextResponse.json(
      { 
        error: 'Search failed',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
} 