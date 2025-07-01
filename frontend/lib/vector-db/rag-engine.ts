import { OpenAI } from 'openai';
import { PineconeStore } from '@langchain/community/vectorstores/pinecone';
import { OpenAIEmbeddings } from '@langchain/openai';
import { pineconeClient } from './pinecone';
import { 
  SearchQuery, 
  SearchResult, 
  RAGResponse, 
  RAGContext,
  UserContext 
} from './types';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize embeddings
const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: 'text-embedding-3-small',
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
   * Perform semantic search and generate AI response
   */
  async search(
    query: SearchQuery, 
    userContext?: UserContext
  ): Promise<RAGResponse> {
    const startTime = Date.now();

    try {
      // Ensure vector store is initialized
      if (!this.vectorStore) {
        await this.initializeVectorStore();
      }

      // Perform similarity search
      const searchResults = await this.performSemanticSearch(query);

      // Generate AI response using retrieved context
      const ragResponse = await this.generateResponse(
        query.query,
        searchResults,
        userContext
      );

      // Calculate search time
      const searchTime = Date.now() - startTime;

      return {
        ...ragResponse,
        searchTime,
      };

    } catch (error) {
      console.error('RAG search failed:', error);
      throw error;
    }
  }

  /**
   * Perform semantic search using vector similarity
   */
  private async performSemanticSearch(query: SearchQuery): Promise<SearchResult[]> {
    try {
      if (!this.vectorStore) {
        throw new Error('Vector store not initialized');
      }

      // Build metadata filter
      const filter = this.buildMetadataFilter(query.filters);

      // Perform similarity search
      const results = await this.vectorStore.similaritySearchWithScore(
        query.query,
        query.topK || 10,
        filter
      );

      // Transform results to our format
      return results.map(([doc, score], index) => ({
        id: doc.metadata.id || `result_${index}`,
        content: doc.pageContent,
        metadata: doc.metadata,
        score: score,
      }));

    } catch (error) {
      console.error('Semantic search failed:', error);
      throw error;
    }
  }

  /**
   * Build metadata filter for Pinecone query
   */
  private buildMetadataFilter(filters?: any): any {
    if (!filters) return {};

    const filter: any = {};

    // Content type filter
    if (filters.contentType && filters.contentType.length > 0) {
      filter.contentType = { $in: filters.contentType };
    }

    // Subject filter
    if (filters.subject && filters.subject.length > 0) {
      filter.subject = { $in: filters.subject };
    }

    // Grade level filter
    if (filters.gradeLevel && filters.gradeLevel.length > 0) {
      filter.gradeLevel = { $in: filters.gradeLevel };
    }

    // Difficulty level filter
    if (filters.difficultyLevel && filters.difficultyLevel.length > 0) {
      filter.difficultyLevel = { $in: filters.difficultyLevel };
    }

    // Disability types filter
    if (filters.disabilityTypes && filters.disabilityTypes.length > 0) {
      filter.disabilityTypes = { $in: filters.disabilityTypes };
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      filter.tags = { $in: filters.tags };
    }

    return filter;
  }

  /**
   * Generate AI response using retrieved context
   */
  private async generateResponse(
    query: string,
    searchResults: SearchResult[],
    userContext?: UserContext
  ): Promise<RAGResponse> {
    try {
      // Build context from search results
      const context = this.buildRAGContext(query, searchResults, userContext);

      // Generate response using OpenAI
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini', // Cost-effective option
        messages: [
          {
            role: 'system',
            content: this.buildSystemPrompt(userContext),
          },
          {
            role: 'user',
            content: this.buildUserPrompt(context),
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      const answer = completion.choices[0]?.message?.content || 'No response generated';

      // Calculate confidence based on search results relevance
      const confidence = this.calculateConfidence(searchResults);

      // Extract sources for citation
      const sources = this.extractSources(searchResults);

      // Generate follow-up questions
      const followUpQuestions = this.generateFollowUpQuestions(query, searchResults);

      return {
        answer,
        sources,
        confidence,
        followUpQuestions,
      };

    } catch (error) {
      console.error('Response generation failed:', error);
      throw error;
    }
  }

  /**
   * Build RAG context for prompt
   */
  private buildRAGContext(
    query: string,
    searchResults: SearchResult[],
    userContext?: UserContext
  ): RAGContext {
    return {
      query,
      relevantDocs: searchResults,
      userProfile: userContext ? {
        learningStyle: userContext.difficultyLevel,
        difficultyLevel: userContext.difficultyLevel,
        disabilityTypes: userContext.learningDisabilities,
        preferredSubjects: userContext.preferredSubjects,
      } : undefined,
    };
  }

  /**
   * Build system prompt for AI response generation
   */
  private buildSystemPrompt(userContext?: UserContext): string {
    let prompt = `You are AIDA, an AI assistant specialized in supporting neurodivergent K-12 learners. You provide educational guidance based on research-backed information.

Key Principles:
- Provide clear, accessible explanations appropriate for the user's level
- Include specific accommodations and strategies for learning disabilities
- Reference credible educational sources when possible
- Maintain an encouraging and supportive tone
- Break down complex concepts into manageable steps`;

    if (userContext) {
      prompt += `\n\nUser Context:`;
      if (userContext.role) prompt += `\n- Role: ${userContext.role}`;
      if (userContext.learningDisabilities?.length) {
        prompt += `\n- Learning disabilities: ${userContext.learningDisabilities.join(', ')}`;
      }
      if (userContext.difficultyLevel) {
        prompt += `\n- Difficulty level: ${userContext.difficultyLevel}`;
      }
      if (userContext.preferredSubjects?.length) {
        prompt += `\n- Preferred subjects: ${userContext.preferredSubjects.join(', ')}`;
      }
      if (userContext.age) prompt += `\n- Age: ${userContext.age}`;
    }

    return prompt;
  }

  /**
   * Build user prompt with context
   */
  private buildUserPrompt(context: RAGContext): string {
    const { query, relevantDocs } = context;

    let prompt = `Question: ${query}\n\nRelevant Information:\n`;

    relevantDocs.forEach((doc, index) => {
      prompt += `\n[Source ${index + 1}] ${doc.metadata.title || 'Educational Content'}\n`;
      prompt += `${doc.content}\n`;
      if (doc.metadata.source) prompt += `Source: ${doc.metadata.source}\n`;
    });

    prompt += `\nBased on the above information, please provide a comprehensive answer to the question. Include:
1. A clear, direct answer
2. Specific strategies or accommodations if relevant
3. Examples or practical applications
4. References to the sources provided

Make your response educational, supportive, and tailored to neurodivergent learners.`;

    return prompt;
  }

  /**
   * Calculate confidence score based on search results
   */
  private calculateConfidence(searchResults: SearchResult[]): number {
    if (searchResults.length === 0) return 0;

    // Calculate average similarity score
    const avgScore = searchResults.reduce((sum, result) => sum + result.score, 0) / searchResults.length;
    
    // Convert to confidence percentage (higher similarity = higher confidence)
    // Pinecone cosine similarity ranges from -1 to 1, we normalize to 0-100
    return Math.max(0, Math.min(100, (avgScore + 1) * 50));
  }

  /**
   * Extract sources for citation
   */
  private extractSources(searchResults: SearchResult[]): RAGResponse['sources'] {
    return searchResults.slice(0, 5).map(result => ({
      title: result.metadata.title || 'Educational Content',
      contentType: result.metadata.contentType,
      relevanceScore: Math.round(result.score * 100) / 100,
      excerpt: this.truncateText(result.content, 150),
    }));
  }

  /**
   * Generate follow-up questions based on query and results
   */
  private generateFollowUpQuestions(query: string, searchResults: SearchResult[]): string[] {
    const questions: string[] = [];

    // Extract subjects and topics from results
    const subjects = new Set(
      searchResults
        .map(r => r.metadata.subject)
        .filter(Boolean)
    );

    const contentTypes = new Set(
      searchResults
        .map(r => r.metadata.contentType)
        .filter(Boolean)
    );

    // Generate contextual follow-up questions
    if (subjects.size > 0) {
      const subject = Array.from(subjects)[0];
      questions.push(`What are effective teaching strategies for ${subject}?`);
    }

    if (contentTypes.has('accommodation')) {
      questions.push('What other accommodations might be helpful?');
    }

    if (contentTypes.has('assessment')) {
      questions.push('How can I prepare for similar assessments?');
    }

    // Add general follow-up questions
    questions.push(
      'Can you provide more specific examples?',
      'What resources would help me learn more about this topic?',
      'How can I apply this information in practice?'
    );

    return questions.slice(0, 3); // Return top 3 questions
  }

  /**
   * Truncate text to specified length
   */
  private truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
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
}

// Export singleton instance
export const ragSearchEngine = new RAGSearchEngine(); 