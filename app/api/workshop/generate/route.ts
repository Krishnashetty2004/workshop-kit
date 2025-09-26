import { NextRequest, NextResponse } from 'next/server';
import { Workshop, WorkshopPrompt, WorkshopCategory } from '../../../../types';
import { API_CONFIG } from '../../../../lib/config';
import { createErrorResponse, handleApiError, validateWorkshopData } from '../../../../lib/errors';
import { generateWorkshopId, generatePrice, generateTheme, getNextWorkshopDate } from '../../../../lib/utils';
import { DEFAULT_WORKSHOP_DATA } from '../../../../lib/constants';
import axios from 'axios';

export async function POST(request: NextRequest) {
  let workshopPrompt: WorkshopPrompt;
  
  try {
    workshopPrompt = await request.json();
    
    // Validate input data
    validateWorkshopData(workshopPrompt);

    const systemPrompt = `You are an expert workshop creator and marketing specialist. Generate a comprehensive workshop based on the user's description. Return ONLY valid JSON with the following structure:

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

    const userPrompt = `Create a workshop for: ${workshopPrompt.prompt}
    
Tone: ${workshopPrompt.tone}
Price Range: ${workshopPrompt.priceRange}
Target Audience: ${workshopPrompt.targetAudience || 'General audience'}

Generate comprehensive workshop content including title, description, instructor profile, agenda, testimonials, and FAQ.`;

    const response = await axios.post(
      API_CONFIG.openrouter.url,
      {
        model: API_CONFIG.openrouter.model,
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user", 
            content: userPrompt
          }
        ],
        temperature: API_CONFIG.openrouter.temperature,
        max_tokens: API_CONFIG.openrouter.maxTokens,
        top_p: API_CONFIG.openrouter.topP
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
          'X-Title': 'Workshop Starter Kit'
        }
      }
    );

    const aiResponse = response.data.choices[0].message.content;
    
    // Parse the JSON response
    let workshopData;
    try {
      // Clean the response to extract JSON
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        workshopData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Fallback to mock data if parsing fails
      return NextResponse.json(generateMockWorkshop(workshopPrompt));
    }

    // Generate additional workshop properties
    const workshopId = generateWorkshopId();
    const price = generatePrice(workshopPrompt.priceRange || 'premium');
    const theme = generateTheme(workshopData.category, workshopPrompt.tone);
    
    const workshop: Workshop = {
      id: workshopId,
      title: workshopData.title,
      description: workshopData.description,
      instructor: workshopData.instructor,
      date: getNextWorkshopDate(),
      time: '2:00 PM EST',
      duration: '2 hours',
      price,
      currency: 'USD',
      maxAttendees: Math.floor(Math.random() * 30) + 15,
      category: workshopData.category,
      skills: workshopData.skills,
      agenda: workshopData.agenda,
      testimonials: workshopData.testimonials,
      faq: workshopData.faq,
      theme,
      status: 'draft',
      createdAt: new Date().toISOString(),
      attendees: []
    };

    return NextResponse.json(workshop);

  } catch (error) {
    console.error('Error calling OpenRouter API:', error);
    
    // Return error response for validation errors
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        createErrorResponse(error),
        { status: 400 }
      );
    }
    
    // Fallback to mock generation for API errors
    try {
      const mockWorkshop = generateMockWorkshop(workshopPrompt);
      return NextResponse.json(mockWorkshop);
    } catch (fallbackError) {
      return NextResponse.json(
        createErrorResponse(fallbackError as Error),
        { status: 500 }
      );
    }
  }
}


// Fallback mock generation function
function generateMockWorkshop(prompt: WorkshopPrompt): Workshop {
  const workshopId = generateWorkshopId();
  
  // Parse the prompt to extract key information
  const promptText = prompt.prompt.toLowerCase();
  
  // Determine workshop category and skills
  let category: WorkshopCategory = 'Technology';
  let skills: string[] = [];
  let title = 'Professional Workshop';
  let description = prompt.prompt;
  
  if (promptText.includes('design') || promptText.includes('ux') || promptText.includes('ui')) {
    category = 'Design';
    skills = ['Design Thinking', 'User Research', 'Prototyping', 'Visual Design', 'User Experience'];
    title = 'Design Mastery Workshop';
  } else if (promptText.includes('react') || promptText.includes('javascript') || promptText.includes('programming')) {
    category = 'Development';
    skills = ['React', 'JavaScript', 'Frontend Development', 'Component Design', 'State Management'];
    title = 'Advanced Development Workshop';
  } else if (promptText.includes('marketing') || promptText.includes('seo') || promptText.includes('social media')) {
    category = 'Marketing';
    skills = ['Digital Marketing', 'SEO', 'Content Strategy', 'Analytics', 'Social Media'];
    title = 'Marketing Masterclass';
  } else if (promptText.includes('writing') || promptText.includes('content') || promptText.includes('story')) {
    category = 'Writing';
    skills = ['Creative Writing', 'Storytelling', 'Content Creation', 'Editing', 'Publishing'];
    title = 'Writing Excellence Workshop';
  }

  const price = generatePrice(prompt.priceRange || 'premium');
  const theme = generateTheme(category, prompt.tone);

  const workshop: Workshop = {
    id: workshopId,
    title,
    description,
    instructor: DEFAULT_WORKSHOP_DATA.instructor,
    date: getNextWorkshopDate(),
    time: '2:00 PM EST',
    duration: '2 hours',
    price,
    currency: 'USD',
    maxAttendees: Math.floor(Math.random() * 30) + 15,
    category,
    skills,
    agenda: [...DEFAULT_WORKSHOP_DATA.agenda],
    testimonials: [...DEFAULT_WORKSHOP_DATA.testimonials],
    faq: [...DEFAULT_WORKSHOP_DATA.faq],
    theme,
    status: 'draft',
    createdAt: new Date().toISOString(),
    attendees: []
  };

  return workshop;
}
