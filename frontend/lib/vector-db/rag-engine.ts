import { getGroqChatCompletion } from './groq';
import {
  SearchQuery,
  SearchResult,
  RAGResponse,
  DocumentMetadata,
  ContentType
} from './types';
import { PineconeStore } from "@langchain/pinecone";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { formatDocumentsAsString } from "langchain/util/document";
import { Document } from "langchain/document";
import { pinecone } from './pinecone';
import { ChatGroq } from "@langchain/groq";

export type UserContext = {
  userId: string;
  role?: 'student' | 'parent' | 'teacher' | 'admin';
  learningStyle?: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  difficultyLevel?: 'beginner' | 'intermediate' | 'advanced';
  preferredSubjects?: string[];
  accessibility?: {
    fontSize?: number;
    contrastMode?: 'default' | 'high' | 'dark';
    prefersReducedMotion?: boolean;
  };
};

export type RAGContext = {
  context: string;
  query: string;
  userContext: UserContext;
};

const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GOOGLE_API_KEY,
  model: "text-embedding-004",
});

const chatClient = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama3-8b-8192",
});

/**
 * RAG Search Engine for educational content
 * Combines semantic search with AI-powered response generation
 */
export class RAGSearchEngine {
  private vectorStore: PineconeStore | null = null;

  constructor() {
    this.initializeVectorStore();
  }

  /**
   * Initialize Pinecone vector store
   */
  private async initializeVectorStore() {
    try {
      const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX!);
      this.vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
        pineconeIndex,
      });
      console.log('Vector store initialized successfully.');
    } catch (error) {
      console.error('Error initializing vector store:', error);
    }
  }

  /**
   * Perform semantic search and generate AI response
   */
  public async search(searchQuery: SearchQuery, userContext: UserContext): Promise<RAGResponse> {
    if (!this.vectorStore) {
      throw new Error('Vector store is not initialized.');
    }

    const startTime = Date.now();

    const sources = await this.performSemanticSearch(searchQuery, userContext);
    const context = this.buildContext(sources);
    const generatedAnswer = await this.generateResponse(context, searchQuery.query, userContext);

    const endTime = Date.now();
    const searchTime = endTime - startTime;

    return {
      query: searchQuery.query,
      answer: generatedAnswer,
      sources,
      searchTime,
      confidence: this.calculateConfidence(sources),
    };
  }

  /**
   * Perform semantic search using vector similarity
   */
  private async performSemanticSearch(searchQuery: SearchQuery, userContext: UserContext): Promise<SearchResult[]> {
    if (!this.vectorStore) {
      throw new Error('Vector store is not initialized.');
    }

    const results = await this.vectorStore.similaritySearchWithScore(searchQuery.query, searchQuery.topK, searchQuery.filters);

    return results.map(([doc, score]) => ({
      id: (doc.metadata as DocumentMetadata).documentId,
      content: doc.pageContent,
      metadata: doc.metadata as DocumentMetadata,
      score,
    }));
  }

  private buildContext(sources: SearchResult[]): string {
    return sources
      .map(source => `Source (ID: ${source.id}, Score: ${source.score.toFixed(2)}):\n${source.content}`)
      .join("\n\n---\n\n");
  }

  /**
   * Generate AI response using retrieved context
   */
  private async generateResponse(context: string, query: string, userContext: UserContext): Promise<string> {
    const template = `
      You are DAWN AI, a friendly and helpful AI learning assistant.
      Your role is to provide clear, concise, and personalized answers based on the provided context.
      ---
      CONTEXT:
      {context}
      ---
      USER QUERY:
      {query}
      ---
      USER PROFILE:
      - Role: ${userContext.role}
      - Learning Style: ${userContext.learningStyle}
      - Preferred Difficulty: ${userContext.difficultyLevel}
      ---
      INSTRUCTIONS:
      1.  Synthesize the information from the context to directly answer the user's query.
      2.  Do not make up information. If the context does not contain the answer, say "I'm sorry, but I couldn't find a specific answer in the provided materials."
      3.  Adapt your language and tone based on the user's profile. For example, use simpler language for a student, more technical language for a teacher, and focus on outcomes for a parent.
      4.  Be encouraging and supportive.

      ANSWER:
    `;

    const prompt = PromptTemplate.fromTemplate(template);

    const chain = RunnableSequence.from([
      {
        context: async () => context,
        query: () => query,
        userContext: () => userContext,
      },
      prompt,
      chatClient,
      new StringOutputParser(),
    ]);

    const result = await chain.invoke({ context, query, userContext });
    return result;
  }

  /**
   * Calculate confidence score based on search results
   */
  private calculateConfidence(sources: SearchResult[]): number {
    if (sources.length === 0) return 0;
    const totalScore = sources.reduce((sum, source) => sum + source.score, 0);
    return totalScore / sources.length;
  }

  /**
   * Get search suggestions based on partial query
   */
  async getSuggestions(partialQuery: string, limit: number = 5): Promise<string[]> {
    try {
      if (!this.vectorStore || partialQuery.length < 3) {
        return [];
      }

      // Perform a limited search for suggestions
      const results = await this.vectorStore.similaritySearch(partialQuery, limit * 2);

      // Extract unique titles and topics for suggestions
      const suggestions = new Set<string>();
      
      results.forEach(doc => {
        if (doc.metadata.title) suggestions.add(doc.metadata.title);
        if (doc.metadata.subject) suggestions.add(`${doc.metadata.subject} help`);
        
        // Extract key phrases from content
        const words = doc.pageContent.split(' ').slice(0, 10).join(' ');
        if (words.length > 10) suggestions.add(words);
      });

      return Array.from(suggestions).slice(0, limit);

    } catch (error) {
      console.error('Failed to get suggestions:', error);
      return [];
    }
  }

  private examples: SearchResult[] = [
    {
      id: "example_1",
      content: "This is an example of a search result.",
      metadata: {
        title: "Example 1",
        contentType: ContentType.CONCEPT,
        subject: "Science",
        gradeLevel: "Middle School",
        difficultyLevel: "Intermediate",
        disabilityTypes: [],
        tags: [],
        source: "Example Source",
      },
      score: 0.85,
    },
    {
      id: "example_2",
      content: "This is another example of a search result.",
      metadata: {
        title: "Example 2",
        contentType: ContentType.ACTIVITY,
        subject: "History",
        gradeLevel: "High School",
        difficultyLevel: "Advanced",
        disabilityTypes: [],
        tags: [],
        source: "Example Source",
      },
      score: 0.75,
    },
    {
      id: "example_3",
      content: "This is a third example of a search result.",
      metadata: {
        title: "Example 3",
        contentType: ContentType.QUIZ,
        subject: "Math",
        gradeLevel: "Middle School",
        difficultyLevel: "Beginner",
        disabilityTypes: [],
        tags: [],
        source: "Example Source",
      },
      score: 0.65,
    },
  ];

  getExamples(): SearchResult[] {
    if (!this.examples || this.examples.length === 0) {
      return [];
    }

    const results: SearchResult[] = this.examples.map(example => ({
      id: example.id,
      content: example.content,
      metadata: example.metadata as DocumentMetadata,
      score: example.score || 0,
    }));

    return results;
  }
}

// Export singleton instance
export const ragSearchEngine = new RAGSearchEngine(); 