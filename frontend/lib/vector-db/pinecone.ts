import { Pinecone } from '@pinecone-database/pinecone';

// Configuration for the knowledge base index
export const KNOWLEDGE_BASE_CONFIG = {
  indexName: 'dawn-knowledge-base',
  dimension: 1536, // OpenAI text-embedding-ada-002 dimension
  metric: 'cosine' as const,
  namespace: 'educational-content',
} as const;

// Initialize Pinecone client
export const pineconeClient = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

/**
 * Get Pinecone client instance
 * @deprecated Use pineconeClient directly instead
 */
export const getPineconeClient = () => pineconeClient;

/**
 * Get the knowledge base index
 */
export async function getKnowledgeBaseIndex() {
  const client = await getPineconeClient();
  return client.index(KNOWLEDGE_BASE_CONFIG.indexName);
}

/**
 * Initialize Pinecone index with proper configuration
 */
export async function initializePineconeIndex(indexName: string, dimension: number = 1536) {
  try {
    // Check if index exists
    const indexList = await pineconeClient.listIndexes();
    const existingIndex = indexList.indexes?.find(index => index.name === indexName);

    if (!existingIndex) {
      console.log(`Creating Pinecone index: ${indexName}`);
      await pineconeClient.createIndex({
        name: indexName,
        dimension,
        metric: 'cosine',
        spec: {
          serverless: {
            cloud: 'aws',
            region: 'us-east-1'
          }
        }
      });

      // Wait for index to be ready
      console.log('Waiting for index to be ready...');
      await new Promise(resolve => setTimeout(resolve, 10000));
    }

    return pineconeClient.Index(indexName);
  } catch (error) {
    console.error('Failed to initialize Pinecone index:', error);
    throw error;
  }
}

/**
 * Delete Pinecone index
 */
export async function deletePineconeIndex(indexName: string) {
  try {
    await pineconeClient.deleteIndex(indexName);
    console.log(`Deleted Pinecone index: ${indexName}`);
  } catch (error) {
    console.error('Failed to delete Pinecone index:', error);
    throw error;
  }
}

/**
 * Test the connection to Pinecone
 */
export async function testPineconeConnection(): Promise<boolean> {
  try {
    const client = await getPineconeClient();
    await client.listIndexes();
    return true;
  } catch (error) {
    console.error('Pinecone connection test failed:', error);
    return false;
  }
}

/**
 * Get index statistics
 */
export async function getIndexStats(indexName: string) {
  try {
    const index = pineconeClient.Index(indexName);
    return await index.describeIndexStats();
  } catch (error) {
    console.error('Failed to get index stats:', error);
    throw error;
  }
} 