/**
 * Types for the vector database and RAG system
 */

export interface DocumentChunk {
  id: string;
  content: string;
  metadata: DocumentMetadata;
  embedding?: number[];
}

export interface DocumentMetadata {
  documentId: string;
  title: string;
  author?: string;
  source: string;
  pageNumber?: number;
  chunkIndex: number;
  category: DocumentCategory;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  id: string;
  contentType: ContentType;
  subject?: string;
  gradeLevel?: string;
  difficultyLevel?: 'beginner' | 'intermediate' | 'advanced';
  learningObjectives?: string[];
  disabilityTypes?: string[];
  applicableSubjects?: string[];
  assessmentType?: 'diagnostic' | 'formative' | 'summative';
  resourceType?: 'article' | 'video' | 'interactive' | 'worksheet';
  url?: string;
  timestamp?: string;
  wordCount?: number;
  totalChunks?: number;
  chunkId?: string;
}

export type DocumentCategory = 
  | 'research-paper'
  | 'intervention-strategy'
  | 'accommodation-guideline'
  | 'best-practice'
  | 'case-study'
  | 'regulatory-document'
  | 'assessment-tool';

export interface QueryRequest {
  query: string;
  userContext?: UserContext;
  maxResults?: number;
  threshold?: number;
}

export interface UserContext {
  userId: string;
  learningDisabilities?: string[];
  difficultyLevel?: string;
  preferredSubjects?: string[];
  age?: number;
  role?: 'student' | 'parent' | 'teacher' | 'admin';
}

export interface QueryResponse {
  answer: string;
  sources: Source[];
  confidence: number;
  queryId: string;
  responseTime: number;
}

export interface Source {
  id: string;
  title: string;
  author?: string;
  excerpt: string;
  score: number;
  category: DocumentCategory;
  pageNumber?: number;
  url?: string;
}

export interface VectorSearchResult {
  id: string;
  score: number;
  metadata: DocumentMetadata;
  content: string;
}

export interface IndexStats {
  totalVectorCount: number;
  dimension: number;
  namespaces: Record<string, { vectorCount: number }>;
}

// Vector database configuration types
export interface VectorDBConfig {
  pineconeApiKey: string;
  pineconeEnvironment: string;
  pineconeIndexName: string;
  embeddingModel: string;
  embeddingDimensions: number;
}

// Content types for educational materials
export enum ContentType {
  LEARNING_MODULE = 'learning_module',
  ASSESSMENT = 'assessment',
  ACCOMMODATION = 'accommodation',
  RESOURCE = 'resource',
  LESSON_PLAN = 'lesson_plan',
  ACTIVITY = 'activity',
}

// Search query structure
export interface SearchQuery {
  query: string;
  filters?: {
    contentType?: ContentType[];
    subject?: string[];
    gradeLevel?: string[];
    difficultyLevel?: ('beginner' | 'intermediate' | 'advanced')[];
    disabilityTypes?: string[];
    tags?: string[];
  };
  topK?: number;
  includeMetadata?: boolean;
}

// Search result structure
export interface SearchResult {
  id: string;
  content: string;
  metadata: DocumentMetadata;
  score: number;
}

// Ingestion result structure
export interface IngestionResult {
  success: boolean;
  documentId: string;
  chunksCreated: number;
  contentType: ContentType;
  message: string;
  error?: string;
}

// Embedding response structure
export interface EmbeddingResponse {
  embedding: number[];
  tokens: number;
  model: string;
}

// Vector store statistics
export interface VectorStoreStats {
  totalDocuments: number;
  totalChunks: number;
  documentsByType: Record<ContentType, number>;
  averageChunkSize: number;
  lastUpdated: string;
}

// RAG context structure
export interface RAGContext {
  query: string;
  relevantDocs: SearchResult[];
  userProfile?: {
    learningStyle?: string;
    difficultyLevel?: string;
    disabilityTypes?: string[];
    preferredSubjects?: string[];
  };
  conversationHistory?: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>;
}

// RAG response structure
export interface RAGResponse {
  answer: string;
  sources: Array<{
    title: string;
    contentType: ContentType;
    relevanceScore: number;
    excerpt: string;
  }>;
  confidence: number;
  followUpQuestions?: string[];
  searchTime?: number;
}
