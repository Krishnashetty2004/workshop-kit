import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { API_CONFIG } from './config';
import { handleApiError, AppError } from './errors';
import { Workshop, WorkshopPrompt, ApiResponse, WorkshopListResponse, AnalyticsResponse } from '../types';

/**
 * Base API client configuration
 */
const createApiClient = (baseURL?: string): AxiosInstance => {
  return axios.create({
    baseURL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * OpenRouter API client for AI workshop generation
 */
class OpenRouterClient {
  private client: AxiosInstance;

  constructor() {
    this.client = createApiClient(API_CONFIG.openrouter.url);
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      'X-Title': 'Workshop Starter Kit',
    };
  }

  async generateWorkshop(prompt: WorkshopPrompt): Promise<Workshop> {
    try {
      const systemPrompt = this.buildSystemPrompt();
      const userPrompt = this.buildUserPrompt(prompt);

      const response = await this.client.post(
        '',
        {
          model: API_CONFIG.openrouter.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: API_CONFIG.openrouter.temperature,
          max_tokens: API_CONFIG.openrouter.maxTokens,
          top_p: API_CONFIG.openrouter.topP,
        },
        { headers: this.getHeaders() }
      );

      return this.parseWorkshopResponse(response.data, prompt);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  private buildSystemPrompt(): string {
    return `You are an expert workshop creator and marketing specialist. Generate a comprehensive workshop based on the user's description. Return ONLY valid JSON with the following structure:

{
  "title": "Workshop title (engaging and descriptive)",
  "description": "Detailed workshop description (2-3 sentences)",
  "instructor": {
    "name": "Realistic instructor name",
    "bio": "Professional bio (2-3 sentences with relevant experience)"
  },
  "category": "One of: Design, Development, Marketing, Writing, Business, Health, Creative, Technology",
  "skills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
  "agenda": [
    {
      "time": "2:00",
      "title": "Session title",
      "description": "What will be covered in this session"
    },
    {
      "time": "2:30", 
      "title": "Session title",
      "description": "What will be covered in this session"
    },
    {
      "time": "3:00",
      "title": "Session title", 
      "description": "What will be covered in this session"
    },
    {
      "time": "3:30",
      "title": "Session title",
      "description": "What will be covered in this session"
    }
  ],
  "testimonials": [
    {
      "name": "Realistic name",
      "role": "Professional role",
      "content": "Authentic testimonial content"
    },
    {
      "name": "Realistic name", 
      "role": "Professional role",
      "content": "Authentic testimonial content"
    }
  ],
  "faq": [
    {
      "question": "Common workshop question",
      "answer": "Helpful answer"
    },
    {
      "question": "Common workshop question",
      "answer": "Helpful answer"
    },
    {
      "question": "Common workshop question", 
      "answer": "Helpful answer"
    }
  ]
}

Make the content specific to the workshop topic, realistic, and professional. Ensure all fields are filled with relevant, high-quality content.`;
  }

  private buildUserPrompt(prompt: WorkshopPrompt): string {
    return `Create a workshop for: ${prompt.prompt}
    
Tone: ${prompt.tone}
Price Range: ${prompt.priceRange}
Target Audience: ${prompt.targetAudience || 'General audience'}

Generate comprehensive workshop content including title, description, instructor profile, agenda, testimonials, and FAQ.`;
  }

  private parseWorkshopResponse(response: any, prompt: WorkshopPrompt): Workshop {
    try {
      const aiResponse = response.choices[0].message.content;
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        throw new Error('No JSON found in AI response');
      }

      const workshopData = JSON.parse(jsonMatch[0]);
      return this.transformToWorkshop(workshopData, prompt);
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      throw new AppError('Failed to parse AI response', 'API_INVALID_RESPONSE', 500);
    }
  }

  private transformToWorkshop(data: any, prompt: WorkshopPrompt): Workshop {
    const { generateWorkshopId, generatePrice, generateTheme, getNextWorkshopDate } = require('./utils');
    
    return {
      id: generateWorkshopId(),
      title: data.title,
      description: data.description,
      instructor: data.instructor,
      date: getNextWorkshopDate(),
      time: '2:00 PM EST',
      duration: '2 hours',
      price: generatePrice(prompt.priceRange || 'premium'),
      currency: 'USD',
      maxAttendees: Math.floor(Math.random() * 30) + 15,
      category: data.category,
      skills: data.skills,
      agenda: data.agenda,
      testimonials: data.testimonials,
      faq: data.faq,
      theme: generateTheme(data.category, prompt.tone),
      status: 'draft',
      createdAt: new Date().toISOString(),
      attendees: []
    };
  }
}

/**
 * Workshop API service
 */
class WorkshopService {
  private client: AxiosInstance;

  constructor() {
    this.client = createApiClient('/api');
  }

  async generateWorkshop(prompt: WorkshopPrompt): Promise<Workshop> {
    try {
      const response = await this.client.post('/workshop/generate', prompt);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getWorkshops(): Promise<WorkshopListResponse> {
    try {
      const response = await this.client.get('/workshops');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getWorkshop(id: string): Promise<Workshop> {
    try {
      const response = await this.client.get(`/workshops/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async publishWorkshop(id: string): Promise<ApiResponse> {
    try {
      const response = await this.client.post(`/workshops/${id}/publish`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async registerForWorkshop(workshopId: string, attendeeData: any): Promise<ApiResponse> {
    try {
      const response = await this.client.post(`/workshops/${workshopId}/register`, attendeeData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getWorkshopAttendees(id: string): Promise<any[]> {
    try {
      const response = await this.client.get(`/workshops/${id}/attendees`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getAnalytics(): Promise<AnalyticsResponse> {
    try {
      const response = await this.client.get('/analytics/overview');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

/**
 * Export API services
 */
export const openRouterClient = new OpenRouterClient();
export const workshopService = new WorkshopService();

/**
 * Legacy function for backward compatibility
 */
export async function generateWorkshopWithAI(prompt: WorkshopPrompt): Promise<Workshop> {
  return workshopService.generateWorkshop(prompt);
}
