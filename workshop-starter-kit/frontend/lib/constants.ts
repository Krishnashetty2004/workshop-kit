import { WORKSHOP_CONFIG } from './config';

/**
 * Example prompts for workshop generation
 */
export const EXAMPLE_PROMPTS = [
  "A hands-on UX design workshop for beginners, teaching design thinking and user research methods",
  "Advanced React patterns and performance optimization for experienced developers", 
  "Digital marketing masterclass covering SEO, social media, and conversion optimization",
  "Creative writing workshop focused on storytelling techniques and character development"
] as const;

/**
 * Feature cards data
 */
export const FEATURES = [
  {
    icon: 'Sparkles',
    title: 'AI-Generated Landing Pages',
    description: 'Describe your workshop and watch AI create a beautiful, conversion-optimized landing page instantly.'
  },
  {
    icon: 'CreditCard',
    title: 'Built-in Payments',
    description: 'Secure Stripe integration handles all payments. No setup required - just start selling tickets.'
  },
  {
    icon: 'Users',
    title: 'Automated Management',
    description: 'Attendee tracking, email confirmations, and workshop reminders all happen automatically.'
  }
] as const;

/**
 * Step cards data for the process flow
 */
export const PROCESS_STEPS = [
  {
    number: '1',
    title: 'Describe Your Workshop',
    description: 'Tell us about your workshop in one simple prompt',
    icon: 'Mail'
  },
  {
    number: '2',
    title: 'AI Creates Everything',
    description: 'Landing page, content, and design generated automatically',
    icon: 'Sparkles'
  },
  {
    number: '3',
    title: 'Preview & Launch',
    description: 'Review your workshop page and publish instantly',
    icon: 'Calendar'
  },
  {
    number: '4',
    title: 'Manage Attendees',
    description: 'Track registrations and payments in real-time',
    icon: 'Users'
  }
] as const;

/**
 * Tone options for workshop generation
 */
export const TONE_OPTIONS = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'inspiring', label: 'Inspiring' },
  { value: 'technical', label: 'Technical' }
] as const;

/**
 * Price range options
 */
export const PRICE_RANGE_OPTIONS = [
  { value: 'free', label: 'Free' },
  { value: 'budget', label: '$10-50' },
  { value: 'premium', label: '$50-200' },
  { value: 'enterprise', label: '$200+' }
] as const;

/**
 * Default workshop data for fallback
 */
export const DEFAULT_WORKSHOP_DATA = {
  instructor: {
    name: 'Expert Instructor',
    bio: 'Experienced professional with years of expertise in the field, dedicated to helping others master new skills.'
  },
  agenda: [
    { time: '2:00', title: 'Introduction & Overview', description: 'Welcome and workshop objectives' },
    { time: '2:30', title: 'Core Concepts', description: 'Fundamental principles and techniques' },
    { time: '3:00', title: 'Hands-on Practice', description: 'Interactive exercises and real-world applications' },
    { time: '3:30', title: 'Q&A & Next Steps', description: 'Questions, resources, and action items' }
  ],
  testimonials: [
    {
      name: 'Sarah Johnson',
      role: 'Professional',
      content: 'This workshop provided exactly what I needed to advance my skills. Highly recommended!'
    },
    {
      name: 'Mike Chen',
      role: 'Entrepreneur',
      content: 'Practical, actionable content delivered by an expert. Worth every minute!'
    }
  ],
  faq: [
    {
      question: 'What do I need to prepare for this workshop?',
      answer: 'Just bring yourself and a willingness to learn! All materials will be provided.'
    },
    {
      question: 'Is this suitable for beginners?',
      answer: 'Yes, this workshop is designed to accommodate all skill levels.'
    },
    {
      question: 'Will I receive a certificate?',
      answer: 'All participants receive a certificate of completion and access to workshop materials.'
    }
  ]
} as const;

/**
 * Mock workshop data for development
 */
export const MOCK_WORKSHOPS = [
  {
    id: '1',
    title: 'Design Thinking for Beginners',
    date: '2025-01-15',
    status: 'published',
    attendees: 12,
    maxAttendees: 20,
    revenue: 480,
    price: 40
  },
  {
    id: '2',
    title: 'Advanced React Patterns',
    date: '2025-01-22',
    status: 'draft',
    attendees: 0,
    maxAttendees: 15,
    revenue: 0,
    price: 75
  }
] as const;

/**
 * Analytics mock data
 */
export const MOCK_ANALYTICS = {
  totalRevenue: 960,
  totalAttendees: 24,
  activeWorkshops: 1,
  conversionRate: 78,
  recentActivity: [
    {
      type: 'registration',
      message: 'New registration for Design Thinking workshop',
      timestamp: new Date().toISOString()
    },
    {
      type: 'reminder',
      message: 'Workshop reminder sent to attendees',
      timestamp: new Date().toISOString()
    }
  ]
} as const;
