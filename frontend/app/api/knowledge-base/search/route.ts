import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { RAGSearchEngine, UserContext } from '@/lib/vector-db/rag-engine';
import { SearchQuery, RAGResponse } from '@/lib/vector-db/types';
import prisma from '@/lib/prisma'; // Import Prisma client

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
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { query, filters, maxResults = 10, includeMetadata = true } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Query is required and must be a string' }, { status: 400 });
    }

    const learningProfile = await prisma.learningProfile.findUnique({
      where: { userId: session.user.id },
    });
    const accessibilityPreferences = await prisma.accessibilityPreferences.findUnique({
      where: { userId: session.user.id },
    });

    const userContext: UserContext = {
      userId: session.user.id,
      role: session.user.role as UserContext['role'],
      learningStyle: learningProfile?.learningStyle as UserContext['learningStyle'],
      difficultyLevel: 'intermediate',
      preferredSubjects: [],
      accessibility: {
        fontSize: accessibilityPreferences?.fontSize || 16,
        contrastMode: accessibilityPreferences?.contrastMode as UserContext['accessibility']['contrastMode'],
        prefersReducedMotion: accessibilityPreferences?.prefersReducedMotion || false,
      }
    };

    const searchQuery: SearchQuery = {
      query: query.trim(),
      filters: { ...filters },
      topK: Math.min(maxResults, 50),
      includeMetadata,
    };

    const ragResponse: RAGResponse = await ragEngine.search(searchQuery, userContext);

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
      { error: 'Search failed', message: error instanceof Error ? error.message : 'Unknown error occurred' },
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
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    if (!query) {
      return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
    }

    const searchQuery: SearchQuery = {
      query: query.trim(),
      filters: {},
      topK: 10,
      includeMetadata: true,
    };
    
    const userContext: UserContext = { 
      userId: session.user.id, 
      role: session.user.role as UserContext['role']
    };

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
      { error: 'Search failed', message: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    );
  }
} 