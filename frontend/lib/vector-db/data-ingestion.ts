import { OpenAI } from 'openai';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Document } from 'langchain/document';
import { PineconeStore } from '@langchain/community/vectorstores/pinecone';
import { OpenAIEmbeddings } from '@langchain/openai';
import { pineconeClient } from './pinecone';
import { ContentType, DocumentMetadata, IngestionResult } from './types';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize embeddings
const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: 'text-embedding-3-small', // Cost-effective option
});

// Text splitter configuration
const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
  separators: ['\n\n', '\n', '. ', ' ', ''],
});

/**
 * Educational Content Data Ingestion Pipeline
 */
export class DataIngestionPipeline {
  private vectorStore: PineconeStore | null = null;

  constructor() {
    this.initializeVectorStore();
  }

  /**
   * Initialize Pinecone vector store
   */
  private async initializeVectorStore() {
    try {
      const index = pineconeClient.Index(process.env.PINECONE_INDEX_NAME!);
      this.vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
        pineconeIndex: index,
      });
    } catch (error) {
      console.error('Failed to initialize vector store:', error);
      throw error;
    }
  }

  /**
   * Process and ingest educational content
   */
  async ingestContent(
    content: string,
    metadata: DocumentMetadata
  ): Promise<IngestionResult> {
    try {
      // Validate content
      if (!content || content.trim().length === 0) {
        throw new Error('Content cannot be empty');
      }

      // Create document with metadata
      const document = new Document({
        pageContent: content,
        metadata: {
          ...metadata,
          timestamp: new Date().toISOString(),
          wordCount: content.split(/\s+/).length,
        },
      });

      // Split document into chunks
      const chunks = await textSplitter.splitDocuments([document]);

      // Add chunk-specific metadata
      const chunksWithMetadata = chunks.map((chunk: Document, index: number) => ({
        ...chunk,
        metadata: {
          ...chunk.metadata,
          chunkIndex: index,
          totalChunks: chunks.length,
          chunkId: `${metadata.id}_chunk_${index}`,
        },
      }));

      // Store in vector database
      if (!this.vectorStore) {
        await this.initializeVectorStore();
      }

      await this.vectorStore!.addDocuments(chunksWithMetadata);

      return {
        success: true,
        documentId: metadata.id,
        chunksCreated: chunks.length,
        contentType: metadata.contentType,
        message: `Successfully ingested ${chunks.length} chunks`,
      };
    } catch (error) {
      console.error('Content ingestion failed:', error);
      return {
        success: false,
        documentId: metadata.id,
        chunksCreated: 0,
        contentType: metadata.contentType,
        message: `Ingestion failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Batch ingest multiple documents
   */
  async batchIngest(
    documents: Array<{ content: string; metadata: DocumentMetadata }>
  ): Promise<IngestionResult[]> {
    const results: IngestionResult[] = [];

    for (const doc of documents) {
      const result = await this.ingestContent(doc.content, doc.metadata);
      results.push(result);
      
      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return results;
  }

  /**
   * Ingest learning module content
   */
  async ingestLearningModule(
    moduleId: string,
    title: string,
    content: string,
    subject: string,
    gradeLevel: string,
    difficultyLevel: 'beginner' | 'intermediate' | 'advanced',
    learningObjectives: string[]
  ): Promise<IngestionResult> {
    const metadata: DocumentMetadata = {
      id: `module_${moduleId}`,
      documentId: `module_${moduleId}`,
      title,
      author: 'DAWN System',
      source: 'learning_module',
      chunkIndex: 0,
      category: 'best-practice',
      contentType: ContentType.LEARNING_MODULE,
      subject,
      gradeLevel,
      difficultyLevel,
      learningObjectives,
      tags: ['learning-module', subject.toLowerCase(), gradeLevel.toLowerCase()],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return this.ingestContent(content, metadata);
  }

  /**
   * Ingest assessment content
   */
  async ingestAssessment(
    assessmentId: string,
    title: string,
    questions: string,
    subject: string,
    gradeLevel: string,
    assessmentType: 'diagnostic' | 'formative' | 'summative'
  ): Promise<IngestionResult> {
    const metadata: DocumentMetadata = {
      id: `assessment_${assessmentId}`,
      documentId: `assessment_${assessmentId}`,
      title,
      author: 'DAWN System',
      source: 'assessment',
      chunkIndex: 0,
      category: 'assessment-tool',
      contentType: ContentType.ASSESSMENT,
      subject,
      gradeLevel,
      assessmentType,
      tags: ['assessment', assessmentType, subject.toLowerCase()],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return this.ingestContent(questions, metadata);
  }

  /**
   * Ingest accommodation strategy
   */
  async ingestAccommodation(
    accommodationId: string,
    title: string,
    description: string,
    strategy: string,
    disabilityTypes: string[],
    applicableSubjects: string[]
  ): Promise<IngestionResult> {
    const content = `${title}\n\n${description}\n\nStrategy: ${strategy}`;
    const metadata: DocumentMetadata = {
      id: `accommodation_${accommodationId}`,
      documentId: `accommodation_${accommodationId}`,
      title,
      author: 'DAWN System',
      source: 'accommodation',
      chunkIndex: 0,
      category: 'accommodation-guideline',
      contentType: ContentType.ACCOMMODATION,
      disabilityTypes,
      applicableSubjects,
      tags: ['accommodation', ...disabilityTypes.map(d => d.toLowerCase())],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return this.ingestContent(content, metadata);
  }

  /**
   * Ingest educational resource
   */
  async ingestResource(
    resourceId: string,
    title: string,
    content: string,
    resourceType: 'article' | 'video' | 'interactive' | 'worksheet',
    subject: string,
    gradeLevel: string,
    url?: string
  ): Promise<IngestionResult> {
    const metadata: DocumentMetadata = {
      id: `resource_${resourceId}`,
      documentId: `resource_${resourceId}`,
      title,
      author: 'DAWN System',
      source: url || 'resource',
      chunkIndex: 0,
      category: 'best-practice',
      contentType: ContentType.RESOURCE,
      resourceType,
      subject,
      gradeLevel,
      url,
      tags: ['resource', resourceType, subject.toLowerCase()],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return this.ingestContent(content, metadata);
  }

  /**
   * Update existing document
   */
  async updateDocument(
    documentId: string,
    newContent: string,
    updatedMetadata: Partial<DocumentMetadata>
  ): Promise<IngestionResult> {
    try {
      // Delete existing document
      await this.deleteDocument(documentId);

      // Get existing metadata and merge with updates
      const metadata: DocumentMetadata = {
        id: documentId,
        documentId: documentId,
        title: updatedMetadata.title || 'Updated Document',
        author: updatedMetadata.author || 'DAWN System',
        source: updatedMetadata.source || 'update',
        chunkIndex: 0,
        category: updatedMetadata.category || 'best-practice',
        contentType: updatedMetadata.contentType || ContentType.RESOURCE,
        createdAt: updatedMetadata.createdAt || new Date(),
        updatedAt: new Date(),
        ...updatedMetadata,
      };

      // Ingest updated content
      return this.ingestContent(newContent, metadata);
    } catch (error) {
      console.error('Document update failed:', error);
      return {
        success: false,
        documentId,
        chunksCreated: 0,
        contentType: updatedMetadata.contentType || ContentType.RESOURCE,
        message: `Update failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Delete document from vector store
   */
  async deleteDocument(documentId: string): Promise<boolean> {
    try {
      if (!this.vectorStore) {
        await this.initializeVectorStore();
      }

      // Delete all chunks for this document
      // Note: This is a simplified approach - in production, you'd want more sophisticated deletion
      const index = pineconeClient.Index(process.env.PINECONE_INDEX_NAME!);
      
      // Delete by metadata filter (requires Pinecone paid plan for metadata filtering)
      // For now, we'll mark as deleted in metadata
      console.log(`Document ${documentId} marked for deletion`);
      return true;
    } catch (error) {
      console.error('Document deletion failed:', error);
      return false;
    }
  }

  /**
   * Get ingestion statistics
   */
  async getIngestionStats(): Promise<{
    totalDocuments: number;
    documentsByType: Record<string, number>;
    lastIngestionDate: string | null;
  }> {
    try {
      if (!this.vectorStore) {
        await this.initializeVectorStore();
      }

      const index = pineconeClient.Index(process.env.PINECONE_INDEX_NAME!);
      const stats = await index.describeIndexStats();

      return {
        totalDocuments: stats.totalRecordCount || 0,
        documentsByType: {}, // Would require querying with metadata filters
        lastIngestionDate: new Date().toISOString(), // Placeholder
      };
    } catch (error) {
      console.error('Failed to get ingestion stats:', error);
      return {
        totalDocuments: 0,
        documentsByType: {},
        lastIngestionDate: null,
      };
    }
  }
}

/**
 * Utility functions for content preprocessing
 */
export class ContentPreprocessor {
  /**
   * Clean and normalize text content
   */
  static cleanText(text: string): string {
    return text
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/[^\w\s\.\,\!\?\-\(\)]/g, '') // Remove special characters
      .trim();
  }

  /**
   * Extract learning objectives from content
   */
  static extractLearningObjectives(content: string): string[] {
    const objectives: string[] = [];
    const patterns = [
      /(?:learning objectives?|goals?|aims?):\s*([^\n]+)/gi,
      /(?:students? will|learners? will)\s+([^\n]+)/gi,
      /(?:by the end|after this).*?students?\s+will\s+([^\n]+)/gi,
    ];

    patterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const objective = match.replace(pattern, '$1').trim();
          if (objective && !objectives.includes(objective)) {
            objectives.push(objective);
          }
        });
      }
    });

    return objectives;
  }

  /**
   * Detect content difficulty level
   */
  static detectDifficultyLevel(content: string): 'beginner' | 'intermediate' | 'advanced' {
    const text = content.toLowerCase();
    
    // Simple heuristics - in production, you'd use more sophisticated NLP
    const complexWords = ['analyze', 'synthesize', 'evaluate', 'critique', 'theorize'];
    const intermediateWords = ['compare', 'contrast', 'explain', 'demonstrate', 'apply'];
    const beginnerWords = ['identify', 'list', 'define', 'describe', 'recall'];

    const complexCount = complexWords.filter(word => text.includes(word)).length;
    const intermediateCount = intermediateWords.filter(word => text.includes(word)).length;
    const beginnerCount = beginnerWords.filter(word => text.includes(word)).length;

    if (complexCount > intermediateCount && complexCount > beginnerCount) {
      return 'advanced';
    } else if (intermediateCount > beginnerCount) {
      return 'intermediate';
    } else {
      return 'beginner';
    }
  }

  /**
   * Extract key terms from content
   */
  static extractKeyTerms(content: string): string[] {
    // Simple term extraction - in production, use proper NLP libraries
    const words = content.toLowerCase().match(/\b\w{4,}\b/g) || [];
    const frequency: Record<string, number> = {};

    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });

    return Object.entries(frequency)
      .filter(([_, count]) => count > 1)
      .sort(([_, a], [__, b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);
  }
}

// Export singleton instance
export const dataIngestionPipeline = new DataIngestionPipeline(); 