/**
 * Next.js/Vercel SDK Integration for AI Workshop Generation
 * Complete setup for calling AI → getting JSON → rendering preview instantly
 */

import axios from 'axios';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Types for AI-generated workshop content
export interface AIWorkshopContent {
  hero: {
    title: string;
    subtitle: string;
    cta_text: string;
  };
  about: {
    heading: string;
    description: string;
  };
  agenda: Array<{
    time: string;
    topic: string;
    speaker: string;
  }>;
  speakers: Array<{
    name: string;
    bio: string;
  }>;
  faq: Array<{
    question: string;
    answer: string;
  }>;
  cta: {
    heading: string;
    button_text: string;
  };
}

export interface WorkshopGenerationRequest {
  description: string;
  enhancements?: {
    price?: number;
    currency?: string;
    date?: string;
    time?: string;
    duration?: string;
    location?: string;
    audience?: string;
    tone?: 'professional' | 'casual' | 'technical' | 'creative';
  };
}

export interface WorkshopGenerationResponse {
  success: boolean;
  workshop?: {
    id: string;
    content: AIWorkshopContent;
    metadata: {
      generatedAt: string;
      model: string;
      userDescription: string;
      generatedBy: 'ai' | 'fallback';
    };
  };
  error?: string;
  warning?: string;
}

/**
 * AI Workshop Generation Service
 * Handles communication with the backend AI service
 */
export class AIWorkshopService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  /**
   * Generate workshop content using AI
   * @param request - Workshop generation request
   * @returns Promise<WorkshopGenerationResponse>
   */
  async generateWorkshop(request: WorkshopGenerationRequest): Promise<WorkshopGenerationResponse> {
    try {
      const response = await axios.post(`${this.baseURL}/api/ai/generate`, request, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 second timeout
      });

      return response.data;
    } catch (error) {
      console.error('AI Workshop Generation Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate workshop'
      };
    }
  }

  /**
   * Generate workshop with specific template
   * @param request - Workshop generation request with template
   * @returns Promise<WorkshopGenerationResponse>
   */
  async generateWithTemplate(
    request: WorkshopGenerationRequest & { template?: string }
  ): Promise<WorkshopGenerationResponse> {
    try {
      const response = await axios.post(`${this.baseURL}/api/ai/generate-template`, request, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      });

      return response.data;
    } catch (error) {
      console.error('AI Template Generation Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate workshop with template'
      };
    }
  }

  /**
   * Test AI service connection
   * @returns Promise<boolean>
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseURL}/api/ai/test`);
      return response.data.success;
    } catch (error) {
      console.error('AI Service Test Error:', error);
      return false;
    }
  }

  /**
   * Get AI service status
   * @returns Promise<any>
   */
  async getStatus(): Promise<any> {
    try {
      const response = await axios.get(`${this.baseURL}/api/ai/status`);
      return response.data;
    } catch (error) {
      console.error('AI Service Status Error:', error);
      return null;
    }
  }

  /**
   * Validate workshop content
   * @param content - Workshop content to validate
   * @returns Promise<any>
   */
  async validateContent(content: AIWorkshopContent): Promise<any> {
    try {
      const response = await axios.post(`${this.baseURL}/api/ai/validate`, { content });
      return response.data;
    } catch (error) {
      console.error('Content Validation Error:', error);
      return { success: false, error: 'Validation failed' };
    }
  }
}

// Create singleton instance
export const aiWorkshopService = new AIWorkshopService();

/**
 * React Hook for AI Workshop Generation
 * Provides easy integration with React components
 */
export function useAIWorkshopGeneration() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<WorkshopGenerationResponse | null>(null);

  const generateWorkshop = async (request: WorkshopGenerationRequest) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await aiWorkshopService.generateWorkshop(request);
      setResult(response);
      
      if (!response.success) {
        setError(response.error || 'Generation failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const generateWithTemplate = async (
    request: WorkshopGenerationRequest & { template?: string }
  ) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await aiWorkshopService.generateWithTemplate(request);
      setResult(response);
      
      if (!response.success) {
        setError(response.error || 'Template generation failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setIsLoading(false);
    setError(null);
    setResult(null);
  };

  return {
    generateWorkshop,
    generateWithTemplate,
    isLoading,
    error,
    result,
    reset
  };
}

/**
 * Example usage component
 */
export function WorkshopGeneratorExample() {
  const { generateWorkshop, isLoading, error, result } = useAIWorkshopGeneration();
  const [description, setDescription] = useState('');

  const handleGenerate = async () => {
    if (!description.trim()) return;

    await generateWorkshop({
      description,
      enhancements: {
        tone: 'professional',
        audience: 'professionals'
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">AI Workshop Generator</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Describe your workshop:
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g., AI Workshop for Beginners, 2-day online bootcamp, for students and professionals"
          className="w-full p-3 border border-gray-300 rounded-lg"
          rows={3}
        />
      </div>

      <button
        onClick={handleGenerate}
        disabled={isLoading || !description.trim()}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Generating...' : 'Generate Workshop'}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {result?.success && result.workshop && (
        <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Generated Workshop:</h3>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(result.workshop, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

// Export everything for easy importing
export default {
  AIWorkshopService,
  aiWorkshopService,
  useAIWorkshopGeneration,
  WorkshopGeneratorExample
};
