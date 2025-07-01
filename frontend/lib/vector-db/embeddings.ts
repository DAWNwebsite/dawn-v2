import OpenAI from 'openai';

// Global OpenAI client instance
let openaiClient: OpenAI | null = null;

/**
 * Initialize and return the OpenAI client
 */
function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }

    openaiClient = new OpenAI({
      apiKey: apiKey,
    });
  }

  return openaiClient;
}

/**
 * Generate embeddings for a single text
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const client = getOpenAIClient();
    
    const response = await client.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text.replace(/\n/g, ' '), // Clean newlines
    });

    if (!response.data || response.data.length === 0) {
      throw new Error('No embedding data received from OpenAI');
    }

    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

/**
 * Generate embeddings for multiple texts in batch
 */
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  try {
    const client = getOpenAIClient();
    
    // Clean the texts
    const cleanedTexts = texts.map(text => text.replace(/\n/g, ' '));
    
    const response = await client.embeddings.create({
      model: 'text-embedding-ada-002',
      input: cleanedTexts,
    });

    if (!response.data || response.data.length !== texts.length) {
      throw new Error('Mismatch in embedding response length');
    }

    return response.data.map(item => item.embedding);
  } catch (error) {
    console.error('Error generating embeddings:', error);
    throw error;
  }
}

/**
 * Generate embedding for a query with optional context enrichment
 */
export async function generateQueryEmbedding(
  query: string, 
  userContext?: {
    learningDisabilities?: string[];
    difficultyLevel?: string;
    preferredSubjects?: string[];
  }
): Promise<number[]> {
  try {
    // Enrich the query with user context for better personalization
    let enrichedQuery = query;
    
    if (userContext) {
      const contextParts: string[] = [];
      
      if (userContext.learningDisabilities && userContext.learningDisabilities.length > 0) {
        contextParts.push(`Learning context: ${userContext.learningDisabilities.join(', ')}`);
      }
      
      if (userContext.difficultyLevel) {
        contextParts.push(`Difficulty level: ${userContext.difficultyLevel}`);
      }
      
      if (userContext.preferredSubjects && userContext.preferredSubjects.length > 0) {
        contextParts.push(`Subject interests: ${userContext.preferredSubjects.join(', ')}`);
      }
      
      if (contextParts.length > 0) {
        enrichedQuery = `${query} (${contextParts.join(', ')})`;
      }
    }
    
    return await generateEmbedding(enrichedQuery);
  } catch (error) {
    console.error('Error generating query embedding:', error);
    throw error;
  }
}

/**
 * Test the OpenAI embeddings API
 */
export async function testEmbeddingService(): Promise<boolean> {
  try {
    const testEmbedding = await generateEmbedding('This is a test sentence for embedding.');
    return Array.isArray(testEmbedding) && testEmbedding.length === 1536; // ada-002 dimension
  } catch (error) {
    console.error('Embedding service test failed:', error);
    return false;
  }
}
