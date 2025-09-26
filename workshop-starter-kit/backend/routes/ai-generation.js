const express = require('express');
const aiService = require('../lib/ai-service');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

/**
 * Generate workshop content using AI
 * POST /api/ai/generate
 */
router.post('/generate', async (req, res) => {
  try {
    const { description, enhancements = {} } = req.body;

    // Validate input
    if (!description || description.trim().length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Workshop description must be at least 10 characters long'
      });
    }

    // Generate content using AI
    const result = await aiService.generateWorkshopContent(description, enhancements);

    if (result.success) {
      // Add metadata
      const workshopData = {
        id: uuidv4(),
        ...result.content,
        metadata: {
          ...result.metadata,
          generatedBy: 'ai',
          version: '1.0'
        }
      };

      res.json({
        success: true,
        workshop: workshopData,
        generatedAt: new Date().toISOString()
      });
    } else {
      // Return fallback content
      res.json({
        success: true,
        workshop: {
          id: uuidv4(),
          ...result.fallback,
          metadata: {
            generatedBy: 'fallback',
            error: result.error,
            generatedAt: new Date().toISOString()
          }
        },
        warning: 'AI generation failed, using fallback content'
      });
    }

  } catch (error) {
    console.error('AI Generation Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate workshop content'
    });
  }
});

/**
 * Test AI service
 * GET /api/ai/test
 */
router.get('/test', async (req, res) => {
  try {
    const testResult = await aiService.testService();
    
    res.json({
      success: true,
      test: testResult,
      status: aiService.getStatus()
    });
  } catch (error) {
    console.error('AI Test Error:', error);
    res.status(500).json({
      success: false,
      error: 'AI service test failed'
    });
  }
});

/**
 * Get AI service status
 * GET /api/ai/status
 */
router.get('/status', (req, res) => {
  try {
    const status = aiService.getStatus();
    
    res.json({
      success: true,
      status
    });
  } catch (error) {
    console.error('Status Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get service status'
    });
  }
});

/**
 * Generate workshop with specific template
 * POST /api/ai/generate-template
 */
router.post('/generate-template', async (req, res) => {
  try {
    const { 
      description, 
      template = 'professional',
      enhancements = {} 
    } = req.body;

    // Template-specific enhancements
    const templateEnhancements = {
      professional: {
        tone: 'professional',
        style: 'corporate',
        audience: 'professionals'
      },
      casual: {
        tone: 'casual',
        style: 'friendly',
        audience: 'general'
      },
      technical: {
        tone: 'technical',
        style: 'detailed',
        audience: 'developers'
      },
      creative: {
        tone: 'inspiring',
        style: 'creative',
        audience: 'creatives'
      }
    };

    const enhancedOptions = {
      ...enhancements,
      ...templateEnhancements[template]
    };

    const result = await aiService.generateWorkshopContent(description, enhancedOptions);

    res.json({
      success: true,
      workshop: {
        id: uuidv4(),
        ...result.content,
        template,
        metadata: {
          ...result.metadata,
          template,
          generatedBy: 'ai-template'
        }
      }
    });

  } catch (error) {
    console.error('Template Generation Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate workshop with template'
    });
  }
});

/**
 * Validate workshop content
 * POST /api/ai/validate
 */
router.post('/validate', (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        error: 'Content is required for validation'
      });
    }

    const { validateWorkshopOutput } = require('../lib/ai-prompts');
    const validation = validateWorkshopOutput(content);

    res.json({
      success: true,
      validation
    });

  } catch (error) {
    console.error('Validation Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to validate content'
    });
  }
});

module.exports = router;
