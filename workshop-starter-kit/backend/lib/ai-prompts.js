/**
 * AI Prompt System for Workshop Landing Page Generator
 * Complete setup with system prompt, user template, and JSON schema
 */

// System Prompt - Sets the AI's role and rules
const SYSTEM_PROMPT = `You are a professional landing page generator specialized in creating minimal, modern, and high-conversion workshop pages.

Your job is to take a short user prompt (example: "AI Workshop for Beginners, 2-day online bootcamp, for students and professionals") and output a clean JSON structure describing a workshop landing page.

Rules:
- Always keep design minimal, elegant, and modern (use white space, 2–3 brand colors, simple typography)
- The page must feel like a professional event landing page (like best examples on Unbounce, SaaS websites, or Eventbrite)
- The output should be JSON only (no HTML, CSS, or images)
- Stick to the provided schema strictly (no extra keys, no missing keys)
- Each section should be short, clear, and engaging
- Focus on content and structure, not design implementation
- Generate realistic, professional content that matches the workshop description
- Create compelling copy that drives conversions
- Use action-oriented language in CTAs
- Make the content scannable and easy to digest`;

// User Prompt Template - For end-users when they describe their workshop
const USER_PROMPT_TEMPLATE = `Create a workshop landing page for:
{userDescription}

Details to include:
- Workshop name
- Duration (days/hours)
- Audience (students, professionals, beginners, advanced, etc.)
- Main benefit or outcome of attending
- If available, speaker names

Generate a complete workshop landing page with all sections filled out based on the description above.`;

// JSON Schema for validation
const WORKSHOP_SCHEMA = {
  type: "object",
  required: ["hero", "about", "agenda", "speakers", "faq", "cta"],
  properties: {
    hero: {
      type: "object",
      required: ["title", "subtitle", "cta_text"],
      properties: {
        title: { type: "string", minLength: 5, maxLength: 100 },
        subtitle: { type: "string", minLength: 10, maxLength: 200 },
        cta_text: { type: "string", minLength: 3, maxLength: 50 }
      }
    },
    about: {
      type: "object",
      required: ["heading", "description"],
      properties: {
        heading: { type: "string", minLength: 5, maxLength: 100 },
        description: { type: "string", minLength: 20, maxLength: 500 }
      }
    },
    agenda: {
      type: "array",
      minItems: 2,
      maxItems: 8,
      items: {
        type: "object",
        required: ["time", "topic", "speaker"],
        properties: {
          time: { type: "string", minLength: 5, maxLength: 50 },
          topic: { type: "string", minLength: 10, maxLength: 100 },
          speaker: { type: "string", minLength: 3, maxLength: 50 }
        }
      }
    },
    speakers: {
      type: "array",
      minItems: 1,
      maxItems: 5,
      items: {
        type: "object",
        required: ["name", "bio"],
        properties: {
          name: { type: "string", minLength: 3, maxLength: 50 },
          bio: { type: "string", minLength: 20, maxLength: 200 }
        }
      }
    },
    faq: {
      type: "array",
      minItems: 3,
      maxItems: 8,
      items: {
        type: "object",
        required: ["question", "answer"],
        properties: {
          question: { type: "string", minLength: 10, maxLength: 150 },
          answer: { type: "string", minLength: 20, maxLength: 300 }
        }
      }
    },
    cta: {
      type: "object",
      required: ["heading", "button_text"],
      properties: {
        heading: { type: "string", minLength: 5, maxLength: 100 },
        button_text: { type: "string", minLength: 3, maxLength: 50 }
      }
    }
  }
};

// Example output for reference
const EXAMPLE_OUTPUT = {
  hero: {
    title: "AI Workshop for Beginners",
    subtitle: "A 2-day hands-on workshop to learn AI fundamentals and build your first project.",
    cta_text: "Reserve Your Spot"
  },
  about: {
    heading: "Why Join?",
    description: "This workshop is designed for students and professionals who want to get started with Artificial Intelligence without prior coding experience."
  },
  agenda: [
    {
      time: "Day 1 - Morning",
      topic: "Introduction to AI & Machine Learning",
      speaker: "Dr. Jane Doe"
    },
    {
      time: "Day 1 - Afternoon",
      topic: "Building Your First AI Model",
      speaker: "John Smith"
    },
    {
      time: "Day 2 - Morning",
      topic: "Hands-on AI Project Development",
      speaker: "Dr. Jane Doe"
    },
    {
      time: "Day 2 - Afternoon",
      topic: "Deploying Your AI Solution",
      speaker: "John Smith"
    }
  ],
  speakers: [
    {
      name: "Dr. Jane Doe",
      bio: "AI researcher and educator with 10+ years of experience in machine learning and deep learning."
    },
    {
      name: "John Smith",
      bio: "Startup founder and AI engineer with expertise in practical AI implementations."
    }
  ],
  faq: [
    {
      question: "Do I need prior coding experience?",
      answer: "No, this workshop is designed for absolute beginners. We'll start from the basics."
    },
    {
      question: "Will I get a certificate?",
      answer: "Yes, participants will receive a completion certificate upon finishing the workshop."
    },
    {
      question: "What tools will we use?",
      answer: "We'll use popular AI frameworks like TensorFlow and PyTorch, with cloud-based development environments."
    },
    {
      question: "Is this workshop online or in-person?",
      answer: "This is a fully online workshop with live sessions and hands-on exercises."
    }
  ],
  cta: {
    heading: "Ready to Get Started?",
    button_text: "Sign Up Now"
  }
};

// Prompt generation functions
const generateUserPrompt = (userDescription) => {
  return USER_PROMPT_TEMPLATE.replace('{userDescription}', userDescription);
};

const generateFullPrompt = (userDescription) => {
  return {
    system: SYSTEM_PROMPT,
    user: generateUserPrompt(userDescription),
    schema: WORKSHOP_SCHEMA,
    example: EXAMPLE_OUTPUT
  };
};

// Validation function
const validateWorkshopOutput = (output) => {
  try {
    // Basic JSON validation
    const parsed = typeof output === 'string' ? JSON.parse(output) : output;
    
    // Check required top-level keys
    const requiredKeys = ['hero', 'about', 'agenda', 'speakers', 'faq', 'cta'];
    const missingKeys = requiredKeys.filter(key => !parsed[key]);
    
    if (missingKeys.length > 0) {
      return {
        isValid: false,
        errors: [`Missing required sections: ${missingKeys.join(', ')}`]
      };
    }
    
    // Check hero section
    const heroRequired = ['title', 'subtitle', 'cta_text'];
    const heroMissing = heroRequired.filter(key => !parsed.hero[key]);
    if (heroMissing.length > 0) {
      return {
        isValid: false,
        errors: [`Hero section missing: ${heroMissing.join(', ')}`]
      };
    }
    
    // Check agenda
    if (!Array.isArray(parsed.agenda) || parsed.agenda.length < 2) {
      return {
        isValid: false,
        errors: ['Agenda must have at least 2 items']
      };
    }
    
    // Check speakers
    if (!Array.isArray(parsed.speakers) || parsed.speakers.length < 1) {
      return {
        isValid: false,
        errors: ['Speakers must have at least 1 speaker']
      };
    }
    
    // Check FAQ
    if (!Array.isArray(parsed.faq) || parsed.faq.length < 3) {
      return {
        isValid: false,
        errors: ['FAQ must have at least 3 items']
      };
    }
    
    return {
      isValid: true,
      data: parsed
    };
    
  } catch (error) {
    return {
      isValid: false,
      errors: ['Invalid JSON format']
    };
  }
};

// Content enhancement functions
const enhanceWorkshopContent = (baseContent, enhancements = {}) => {
  const enhanced = { ...baseContent };
  
  // Add pricing if provided
  if (enhancements.price) {
    enhanced.pricing = {
      amount: enhancements.price,
      currency: enhancements.currency || 'USD',
      display: `$${enhancements.price}`
    };
  }
  
  // Add date/time if provided
  if (enhancements.date) {
    enhanced.schedule = {
      date: enhancements.date,
      time: enhancements.time || 'TBD',
      duration: enhancements.duration || '2 hours'
    };
  }
  
  // Add location if provided
  if (enhancements.location) {
    enhanced.location = {
      type: enhancements.locationType || 'online',
      address: enhancements.location,
      mapUrl: enhancements.mapUrl
    };
  }
  
  return enhanced;
};

module.exports = {
  SYSTEM_PROMPT,
  USER_PROMPT_TEMPLATE,
  WORKSHOP_SCHEMA,
  EXAMPLE_OUTPUT,
  generateUserPrompt,
  generateFullPrompt,
  validateWorkshopOutput,
  enhanceWorkshopContent
};
