/**
 * DAWN AI Study API Client
 * 
 * Connects the frontend with the MCP server for AI diagnostic assessments,
 * learning profile management, and content adaptation.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_MCP_SERVER_URL || 'http://localhost:8000';

// Types
export interface AssessmentResponse {
  user_id: string;
  responses: Record<string, any>;
}

export interface ADHDAssessmentResponses {
  attention_questions: number[];
  hyperactivity_questions: number[];
  impulsivity_questions: number[];
  age: number;
  duration_months: number;
}

export interface DyslexiaAssessmentResponses {
  reading_speed: number;
  comprehension_score: number;
  phonological_awareness: number[];
  spelling_accuracy: number;
  word_recognition: number[];
}

export interface AutismAssessmentResponses {
  social_communication: number[];
  repetitive_behaviors: number[];
  sensory_processing: number[];
  age_of_concerns: number;
}

export interface LearningProfile {
  user_id: string;
  learning_style: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  attention_span: number;
  processing_speed: 'fast' | 'average' | 'slow';
  sensory_preferences: Record<string, any>;
  cognitive_load_preference: 'low' | 'medium' | 'high';
  accessibility_needs: string[];
}

export interface DiagnosticResult {
  assessment_type: string;
  confidence_level: number;
  indicators: string[];
  recommendations: string[];
  next_steps?: string[];
  accommodations?: string[];
  supports?: string[];
  error?: string;
}

export interface ContentAdaptation {
  content_id: string;
  adapted_content: string;
  applied_adaptations: string[];
  original_length: number;
  adapted_length: number;
  error?: string;
}

// API Client Class
class DAWNAPIClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Assessment Methods
  async runADHDAssessment(
    userId: string,
    responses: ADHDAssessmentResponses
  ): Promise<DiagnosticResult> {
    return this.request<DiagnosticResult>('/api/assessment/adhd', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        responses,
      }),
    });
  }

  async runDyslexiaAssessment(
    userId: string,
    responses: DyslexiaAssessmentResponses
  ): Promise<DiagnosticResult> {
    return this.request<DiagnosticResult>('/api/assessment/dyslexia', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        responses,
      }),
    });
  }

  async runAutismAssessment(
    userId: string,
    responses: AutismAssessmentResponses
  ): Promise<DiagnosticResult> {
    return this.request<DiagnosticResult>('/api/assessment/autism', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        responses,
      }),
    });
  }

  // Learning Profile Methods
  async createLearningProfile(profile: LearningProfile): Promise<any> {
    return this.request('/api/profile/create', {
      method: 'POST',
      body: JSON.stringify(profile),
    });
  }

  async getLearningProfile(userId: string): Promise<LearningProfile | null> {
    try {
      const result = await this.request<any>(`/api/profile/${userId}`);
      
      if (result.status === 'not_found') {
        return null;
      }
      
      return result;
    } catch (error) {
      console.error('Error fetching learning profile:', error);
      return null;
    }
  }

  // Content Adaptation Methods
  async adaptContent(
    content: string,
    userId: string,
    adaptations: string[] = []
  ): Promise<ContentAdaptation> {
    return this.request<ContentAdaptation>('/api/content/adapt', {
      method: 'POST',
      body: JSON.stringify({
        content,
        user_id: userId,
        adaptations,
      }),
    });
  }

  // Health Check
  async healthCheck(): Promise<any> {
    return this.request('/api/health');
  }

  // Utility Methods
  async isServerHealthy(): Promise<boolean> {
    try {
      await this.healthCheck();
      return true;
    } catch {
      return false;
    }
  }
}

// Create singleton instance
export const apiClient = new DAWNAPIClient();

// React Hook for API Client
export function useAPIClient() {
  return apiClient;
}

// Assessment Helper Functions
export const assessmentHelpers = {
  // ADHD Assessment Helpers
  calculateADHDScore: (responses: ADHDAssessmentResponses) => {
    const attentionAvg = responses.attention_questions.reduce((a, b) => a + b, 0) / responses.attention_questions.length;
    const hyperactivityAvg = responses.hyperactivity_questions.reduce((a, b) => a + b, 0) / responses.hyperactivity_questions.length;
    const impulsivityAvg = responses.impulsivity_questions.reduce((a, b) => a + b, 0) / responses.impulsivity_questions.length;
    
    return {
      attention: attentionAvg,
      hyperactivity: hyperactivityAvg,
      impulsivity: impulsivityAvg,
      overall: (attentionAvg + hyperactivityAvg + impulsivityAvg) / 3
    };
  },

  // Dyslexia Assessment Helpers
  calculateDyslexiaRisk: (responses: DyslexiaAssessmentResponses) => {
    let riskFactors = 0;
    
    if (responses.reading_speed < 100) riskFactors++;
    if (responses.comprehension_score < 70) riskFactors++;
    if (responses.spelling_accuracy < 70) riskFactors++;
    
    const phonologicalAvg = responses.phonological_awareness.reduce((a, b) => a + b, 0) / responses.phonological_awareness.length;
    if (phonologicalAvg < 3.0) riskFactors++;
    
    const wordRecognitionAvg = responses.word_recognition.reduce((a, b) => a + b, 0) / responses.word_recognition.length;
    if (wordRecognitionAvg < 3.0) riskFactors++;
    
    return {
      riskFactors,
      riskLevel: riskFactors >= 3 ? 'high' : riskFactors >= 2 ? 'medium' : 'low'
    };
  },

  // Autism Assessment Helpers
  calculateAutismIndicators: (responses: AutismAssessmentResponses) => {
    const socialCommAvg = responses.social_communication.reduce((a, b) => a + b, 0) / responses.social_communication.length;
    const repetitiveBehaviorAvg = responses.repetitive_behaviors.reduce((a, b) => a + b, 0) / responses.repetitive_behaviors.length;
    const sensoryProcessingAvg = responses.sensory_processing.reduce((a, b) => a + b, 0) / responses.sensory_processing.length;
    
    return {
      socialCommunication: socialCommAvg,
      repetitiveBehaviors: repetitiveBehaviorAvg,
      sensoryProcessing: sensoryProcessingAvg,
      overall: (socialCommAvg + repetitiveBehaviorAvg + sensoryProcessingAvg) / 3
    };
  }
};

export default apiClient; 