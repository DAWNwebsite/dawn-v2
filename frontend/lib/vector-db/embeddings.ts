import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

let embeddingsClient: GoogleGenerativeAIEmbeddings | null = null;

/**
 * Initialize and return the Google Generative AI Embeddings client
 */
function getEmbeddingsClient(): GoogleGenerativeAIEmbeddings {
  if (!embeddingsClient) {
    const apiKey = process.env.GOOGLE_API_KEY;
    
    if (!apiKey) {
      throw new Error('GOOGLE_API_KEY environment variable is required');
    }

    embeddingsClient = new GoogleGenerativeAIEmbeddings({
      apiKey: apiKey,
      model: "text-embedding-004", // The latest and recommended model
    });
  }
  return embeddingsClient;
}

/**
 * Generate embeddings for a single text
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const client = getEmbeddingsClient();
    return await client.embedQuery(text);
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
    const client = getEmbeddingsClient();
    return await client.embedDocuments(texts);
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
 * Test the Google embedding service
 */
export async function testEmbeddingService(): Promise<boolean> {
  try {
    const testEmbedding = await generateEmbedding('This is a test sentence for embedding.');
    // text-embedding-004 has a dimension of 768
    return Array.isArray(testEmbedding) && testEmbedding.length === 768; 
  } catch (error) {
    console.error('Embedding service test failed:', error);
    return false;
  }
}
