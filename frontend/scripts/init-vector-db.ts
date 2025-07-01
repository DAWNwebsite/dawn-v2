#!/usr/bin/env tsx

/**
 * Script to initialize the vector database for the DAWN Knowledge Base
 * This script should be run once to set up the Pinecone index
 */

import { initializeKnowledgeBaseIndex, testPineconeConnection, getIndexStats } from '../lib/vector-db/pinecone';
import { testEmbeddingService } from '../lib/vector-db/embeddings';

async function main() {
  console.log('🚀 Initializing DAWN Knowledge Base Vector Database...\n');

  try {
    // Test Pinecone connection
    console.log('1. Testing Pinecone connection...');
    const pineconeConnected = await testPineconeConnection();
    if (!pineconeConnected) {
      throw new Error('Failed to connect to Pinecone. Please check your PINECONE_API_KEY.');
    }
    console.log('✅ Pinecone connection successful\n');

    // Test OpenAI embeddings
    console.log('2. Testing OpenAI embeddings service...');
    const embeddingsWorking = await testEmbeddingService();
    if (!embeddingsWorking) {
      throw new Error('Failed to test OpenAI embeddings. Please check your OPENAI_API_KEY.');
    }
    console.log('✅ OpenAI embeddings service working\n');

    // Initialize the knowledge base index
    console.log('3. Initializing knowledge base index...');
    await initializeKnowledgeBaseIndex();
    console.log('✅ Knowledge base index initialized\n');

    // Get and display index statistics
    console.log('4. Getting index statistics...');
    const stats = await getIndexStats();
    console.log('📊 Index Statistics:');
    console.log(`   - Total vectors: ${stats.totalVectorCount || 0}`);
    console.log(`   - Dimension: ${stats.dimension || 'N/A'}`);
    console.log(`   - Namespaces: ${Object.keys(stats.namespaces || {}).length}`);
    console.log('');

    console.log('🎉 Vector database initialization completed successfully!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Add educational content documents to the knowledge base');
    console.log('2. Run the data ingestion pipeline');
    console.log('3. Test the RAG query endpoint');

  } catch (error) {
    console.error('❌ Error during initialization:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
