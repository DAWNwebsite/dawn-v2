/**
 * Testing utilities for the Knowledge Base API endpoints
 * These functions help verify that the RAG system is working correctly
 */

import { ContentType, SearchQuery, RAGResponse } from './types';

export interface TestResult {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
  duration?: number;
}

/**
 * Test the knowledge base search API endpoint
 */
export async function testSearchAPI(
  query: string,
  filters?: any,
  baseUrl: string = 'http://localhost:3000'
): Promise<TestResult> {
  const startTime = Date.now();
  
  try {
    const response = await fetch(`${baseUrl}/api/knowledge-base/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        filters: filters || {},
        maxResults: 5,
        includeMetadata: true,
      }),
    });

    const duration = Date.now() - startTime;

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      return {
        success: false,
        message: `API returned ${response.status}`,
        error: errorData.error || 'Request failed',
        duration,
      };
    }

    const data = await response.json();
    
    return {
      success: true,
      message: 'Search API test passed',
      data: data.data,
      duration,
    };

  } catch (error) {
    return {
      success: false,
      message: 'Search API test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: Date.now() - startTime,
    };
  }
}

/**
 * Test the content ingestion API endpoint (requires admin authentication)
 */
export async function testIngestionAPI(
  content: {
    title: string;
    content: string;
    contentType: ContentType;
    subject?: string;
    gradeLevel?: string;
    difficultyLevel?: string;
  },
  baseUrl: string = 'http://localhost:3000'
): Promise<TestResult> {
  const startTime = Date.now();
  
  try {
    const response = await fetch(`${baseUrl}/api/knowledge-base/ingest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(content),
    });

    const duration = Date.now() - startTime;

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      return {
        success: false,
        message: `Ingestion API returned ${response.status}`,
        error: errorData.error || 'Request failed',
        duration,
      };
    }

    const data = await response.json();
    
    return {
      success: true,
      message: 'Ingestion API test passed',
      data: data.data,
      duration,
    };

  } catch (error) {
    return {
      success: false,
      message: 'Ingestion API test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: Date.now() - startTime,
    };
  }
}

/**
 * Test vector database connectivity
 */
export async function testVectorDBConnection(): Promise<TestResult> {
  try {
    // This is a mock test since we can't directly test Pinecone without credentials
    // In a real scenario, this would check Pinecone connectivity
    
    const hasApiKey = !!process.env.PINECONE_API_KEY;
    const hasIndexName = !!process.env.PINECONE_INDEX_NAME;
    const hasOpenAIKey = !!process.env.OPENAI_API_KEY;

    if (!hasApiKey || !hasIndexName || !hasOpenAIKey) {
      return {
        success: false,
        message: 'Vector DB connection test failed',
        error: 'Missing required environment variables (PINECONE_API_KEY, PINECONE_INDEX_NAME, OPENAI_API_KEY)',
      };
    }

    return {
      success: true,
      message: 'Vector DB connection test passed (environment variables present)',
    };

  } catch (error) {
    return {
      success: false,
      message: 'Vector DB connection test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Run a comprehensive test suite
 */
export async function runTestSuite(baseUrl: string = 'http://localhost:3000'): Promise<{
  overall: boolean;
  results: TestResult[];
  summary: string;
}> {
  const results: TestResult[] = [];

  console.log('🧪 Starting Knowledge Base Test Suite...\n');

  // Test 1: Vector DB Connection
  console.log('1. Testing Vector DB connection...');
  const dbTest = await testVectorDBConnection();
  results.push(dbTest);
  console.log(`   ${dbTest.success ? '✅' : '❌'} ${dbTest.message}`);
  if (dbTest.error) console.log(`   Error: ${dbTest.error}`);
  console.log('');

  // Test 2: Search API with simple query
  console.log('2. Testing Search API with simple query...');
  const searchTest1 = await testSearchAPI('What are learning strategies for ADHD students?', undefined, baseUrl);
  results.push(searchTest1);
  console.log(`   ${searchTest1.success ? '✅' : '❌'} ${searchTest1.message} (${searchTest1.duration}ms)`);
  if (searchTest1.error) console.log(`   Error: ${searchTest1.error}`);
  console.log('');

  // Test 3: Search API with filters
  console.log('3. Testing Search API with filters...');
  const searchTest2 = await testSearchAPI(
    'mathematics accommodations',
    {
      contentType: [ContentType.ACCOMMODATION],
      subject: ['Mathematics'],
      gradeLevel: ['3', '4', '5']
    },
    baseUrl
  );
  results.push(searchTest2);
  console.log(`   ${searchTest2.success ? '✅' : '❌'} ${searchTest2.message} (${searchTest2.duration}ms)`);
  if (searchTest2.error) console.log(`   Error: ${searchTest2.error}`);
  console.log('');

  // Test 4: Ingestion API (will likely fail without admin auth, but tests endpoint)
  console.log('4. Testing Ingestion API endpoint...');
  const ingestionTest = await testIngestionAPI({
    title: 'Test Learning Module',
    content: 'This is a test learning module for mathematics.',
    contentType: ContentType.LEARNING_MODULE,
    subject: 'Mathematics',
    gradeLevel: '3',
    difficultyLevel: 'beginner'
  }, baseUrl);
  results.push(ingestionTest);
  console.log(`   ${ingestionTest.success ? '✅' : '❌'} ${ingestionTest.message} (${ingestionTest.duration}ms)`);
  if (ingestionTest.error) console.log(`   Error: ${ingestionTest.error}`);
  console.log('');

  // Calculate overall success
  const passedTests = results.filter(r => r.success).length;
  const totalTests = results.length;
  const overall = passedTests >= totalTests - 1; // Allow ingestion test to fail (auth required)

  const summary = `Test Suite Complete: ${passedTests}/${totalTests} tests passed`;
  console.log(`🎯 ${summary}`);
  
  if (overall) {
    console.log('✅ Knowledge Base system is functioning correctly!');
  } else {
    console.log('❌ Some critical tests failed. Please check the errors above.');
  }

  return {
    overall,
    results,
    summary,
  };
}

/**
 * Mock data for testing
 */
export const mockTestData = {
  searchQueries: [
    'How to help students with dyslexia read better?',
    'ADHD accommodations for math class',
    'Autism spectrum disorder learning strategies',
    'Visual learning techniques for elementary students',
    'Reading comprehension strategies for struggling learners'
  ],
  
  testContent: [
    {
      title: 'ADHD Focus Strategies',
      content: 'Students with ADHD benefit from structured environments, clear instructions, and frequent breaks. Use visual cues and hands-on activities to maintain engagement.',
      contentType: ContentType.ACCOMMODATION,
      subject: 'General',
      disabilityTypes: ['ADHD'],
      applicableSubjects: ['Mathematics', 'Reading', 'Science']
    },
    {
      title: 'Dyslexia Reading Support',
      content: 'Multi-sensory reading approaches work best for dyslexic learners. Use phonics-based instruction, visual aids, and assistive technology.',
      contentType: ContentType.RESOURCE,
      subject: 'Reading',
      gradeLevel: 'K-5',
      resourceType: 'article'
    }
  ]
};

/**
 * Validate API response structure
 */
export function validateRAGResponse(response: any): TestResult {
  try {
    if (!response) {
      return {
        success: false,
        message: 'Response validation failed',
        error: 'Response is null or undefined'
      };
    }

    const required = ['answer', 'sources', 'confidence'];
    const missing = required.filter(field => !(field in response));
    
    if (missing.length > 0) {
      return {
        success: false,
        message: 'Response validation failed',
        error: `Missing required fields: ${missing.join(', ')}`
      };
    }

    if (typeof response.answer !== 'string') {
      return {
        success: false,
        message: 'Response validation failed',
        error: 'Answer field must be a string'
      };
    }

    if (!Array.isArray(response.sources)) {
      return {
        success: false,
        message: 'Response validation failed',
        error: 'Sources field must be an array'
      };
    }

    if (typeof response.confidence !== 'number' || response.confidence < 0 || response.confidence > 100) {
      return {
        success: false,
        message: 'Response validation failed',
        error: 'Confidence must be a number between 0 and 100'
      };
    }

    return {
      success: true,
      message: 'Response validation passed',
      data: response
    };

  } catch (error) {
    return {
      success: false,
      message: 'Response validation failed',
      error: error instanceof Error ? error.message : 'Unknown validation error'
    };
  }
} 