/**
 * Centralized configuration for the WorkshopKit application
 */

export const APP_CONFIG = {
  name: 'WorkshopKit',
  version: '1.0.0',
  description: 'AI-powered workshop creation platform',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
} as const;

export const API_CONFIG = {
  openrouter: {
    url: process.env.OPENROUTER_API_URL || 'https://openrouter.ai/api/v1/chat/completions',
    model: 'qwen/qwen-2.5-72b-instruct',
    temperature: 0.7,
    maxTokens: 2000,
    topP: 0.9,
  },
  server: {
    port: parseInt(process.env.PORT || '3001', 10),
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    },
  },
} as const;

export const WORKSHOP_CONFIG = {
  defaultDuration: '2 hours',
  defaultTime: '2:00 PM EST',
  maxAttendees: {
    min: 5,
    max: 100,
    default: 20,
  },
  priceRanges: {
    free: { min: 0, max: 0 },
    budget: { min: 10, max: 50 },
    premium: { min: 50, max: 200 },
    enterprise: { min: 200, max: 1000 },
  },
  categories: [
    'Design',
    'Development', 
    'Marketing',
    'Writing',
    'Business',
    'Health',
    'Creative',
    'Technology',
  ] as const,
  tones: ['professional', 'casual', 'inspiring', 'technical'] as const,
} as const;

export const UI_CONFIG = {
  theme: {
    primary: {
      purple: '#8B5CF6',
      blue: '#3B82F6',
      green: '#10B981',
      orange: '#F59E0B',
      red: '#EF4444',
      pink: '#EC4899',
    },
    secondary: {
      purple: '#06B6D4',
      blue: '#10B981',
      green: '#F59E0B',
      orange: '#EF4444',
      red: '#DC2626',
      pink: '#8B5CF6',
    },
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
} as const;

export const ROUTES = {
  home: '/',
  generator: '/generator',
  preview: '/preview',
  dashboard: '/dashboard',
  api: {
    workshop: {
      generate: '/api/workshop/generate',
    },
    health: '/api/health',
    workshops: '/api/workshops',
  },
} as const;

export type WorkshopCategory = typeof WORKSHOP_CONFIG.categories[number];
export type WorkshopTone = typeof WORKSHOP_CONFIG.tones[number];
export type PriceRange = keyof typeof WORKSHOP_CONFIG.priceRanges;
