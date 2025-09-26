const axios = require('axios');
const { 
  SYSTEM_PROMPT, 
  generateUserPrompt, 
  validateWorkshopOutput, 
  enhanceWorkshopContent 
} = require('./ai-prompts');

/**
 * AI Service for Workshop Landing Page Generation
 * Integrates with OpenRouter API using the optimized prompt system
 */

class AIService {
  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY;
    this.apiUrl = process.env.OPENROUTER_API_URL || 'https://openrouter.ai/api/v1/chat/completions';
    this.model = process.env.OPENROUTER_MODEL || 'qwen/qwen-2.5-72b-instruct';
  }

  /**
   * Generate workshop landing page content using AI
   * @param {string} userDescription - User's workshop description
   * @param {object} enhancements - Additional data (price, date, etc.)
   * @returns {object} Generated workshop content
   */
  async generateWorkshopContent(userDescription, enhancements = {}) {
    try {
      // Validate inputs
      if (!userDescription || userDescription.trim().length < 10) {
        throw new Error('Workshop description must be at least 10 characters long');
      }

      if (!this.apiKey) {
        throw new Error('OpenRouter API key not configured');
      }

      // Generate the user prompt
      const userPrompt = generateUserPrompt(userDescription);

      // Call OpenRouter API
      const response = await this.callOpenRouterAPI(userPrompt);

      // Validate the response
      const validation = validateWorkshopOutput(response);
      if (!validation.isValid) {
        throw new Error(`AI response validation failed: ${validation.errors.join(', ')}`);
      }

      // Enhance with additional data
      const enhancedContent = enhanceWorkshopContent(validation.data, enhancements);

      return {
        success: true,
        content: enhancedContent,
        metadata: {
          generatedAt: new Date().toISOString(),
          model: this.model,
          userDescription: userDescription
        }
      };

    } catch (error) {
      console.error('AI Service Error:', error);
      return {
        success: false,
        error: error.message,
        fallback: this.generateFallbackContent(userDescription, enhancements)
      };
    }
  }

  /**
   * Call OpenRouter API with the prompt
   * @param {string} userPrompt - The user prompt
   * @returns {object} AI response
   */
  async callOpenRouterAPI(userPrompt) {
    const requestData = {
      model: this.model,
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT
        },
        {
          role: 'user',
          content: userPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      top_p: 0.9,
      frequency_penalty: 0.1,
      presence_penalty: 0.1
    };

    const response = await axios.post(this.apiUrl, requestData, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:3000',
        'X-Title': 'Workshop Starter Kit'
      },
      timeout: 30000
    });

    if (!response.data.choices || response.data.choices.length === 0) {
      throw new Error('No response from AI service');
    }

    const aiResponse = response.data.choices[0].message.content;
    
    // Extract JSON from response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in AI response');
    }

    return JSON.parse(jsonMatch[0]);
  }

  /**
   * Generate fallback content when AI fails
   * @param {string} userDescription - User's description
   * @param {object} enhancements - Additional data
   * @returns {object} Fallback content
   */
  generateFallbackContent(userDescription, enhancements = {}) {
    const words = userDescription.split(' ');
    const title = words.slice(0, 4).join(' ') || 'Professional Workshop';
    
    return {
      hero: {
        title: title,
        subtitle: `Learn valuable skills in this comprehensive workshop designed for ${enhancements.audience || 'professionals'}.`,
        cta_text: 'Register Now'
      },
      about: {
        heading: 'About This Workshop',
        description: `This workshop provides hands-on experience and practical knowledge that you can apply immediately in your work or personal projects.`
      },
      agenda: [
        {
          time: 'Session 1',
          topic: 'Introduction and Fundamentals',
          speaker: 'Expert Instructor'
        },
        {
          time: 'Session 2',
          topic: 'Hands-on Practice',
          speaker: 'Expert Instructor'
        },
        {
          time: 'Session 3',
          topic: 'Advanced Techniques',
          speaker: 'Expert Instructor'
        },
        {
          time: 'Session 4',
          topic: 'Q&A and Next Steps',
          speaker: 'Expert Instructor'
        }
      ],
      speakers: [
        {
          name: 'Expert Instructor',
          bio: 'Experienced professional with years of expertise in the field, dedicated to helping others master new skills.'
        }
      ],
      faq: [
        {
          question: 'What do I need to prepare?',
          answer: 'Just bring yourself and a willingness to learn! All materials will be provided.'
        },
        {
          question: 'Is this suitable for beginners?',
          answer: 'Yes, this workshop is designed to accommodate all skill levels.'
        },
        {
          question: 'Will I receive a certificate?',
          answer: 'Yes, all participants receive a certificate of completion.'
        },
        {
          question: 'What if I can\'t attend live?',
          answer: 'Recordings will be available for registered participants.'
        }
      ],
      cta: {
        heading: 'Ready to Get Started?',
        button_text: 'Sign Up Now'
      }
    };
  }

  /**
   * Test the AI service with a sample prompt
   * @returns {object} Test result
   */
  async testService() {
    try {
      const testDescription = 'AI Workshop for Beginners, 2-day online bootcamp, for students and professionals';
      const result = await this.generateWorkshopContent(testDescription);
      
      return {
        success: true,
        message: 'AI service is working correctly',
        testResult: result
      };
    } catch (error) {
      return {
        success: false,
        message: 'AI service test failed',
        error: error.message
      };
    }
  }

  /**
   * Get service status and configuration
   * @returns {object} Service status
   */
  getStatus() {
    return {
      apiKeyConfigured: !!this.apiKey,
      apiUrl: this.apiUrl,
      model: this.model,
      timestamp: new Date().toISOString()
    };
  }
}

// Create singleton instance
const aiService = new AIService();

module.exports = aiService;
