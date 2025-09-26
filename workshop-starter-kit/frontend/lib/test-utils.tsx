import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Workshop } from '../types';

/**
 * Test utilities for React components
 */

// Mock workshop data for testing
export const mockWorkshop: Workshop = {
  id: 'test-workshop-1',
  title: 'Test Workshop',
  description: 'A test workshop for unit testing',
  instructor: {
    name: 'Test Instructor',
    bio: 'A test instructor for testing purposes'
  },
  date: '2025-01-15',
  time: '2:00 PM EST',
  duration: '2 hours',
  price: 50,
  currency: 'USD',
  maxAttendees: 20,
  category: 'Development',
  skills: ['Testing', 'Quality Assurance'],
  agenda: [
    {
      time: '2:00',
      title: 'Introduction',
      description: 'Welcome and overview'
    },
    {
      time: '2:30',
      title: 'Main Content',
      description: 'Core workshop content'
    }
  ],
  testimonials: [
    {
      name: 'Test User',
      role: 'Developer',
      content: 'Great test workshop!'
    }
  ],
  faq: [
    {
      question: 'What is this?',
      answer: 'A test workshop'
    }
  ],
  theme: {
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    fontFamily: 'Inter',
    style: 'modern'
  },
  status: 'draft',
  createdAt: new Date().toISOString(),
  attendees: []
};

// Custom render function with providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Mock fetch for API testing
export const mockFetch = (data: any, status = 200) => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: status >= 200 && status < 300,
      status,
      json: () => Promise.resolve(data),
    })
  ) as jest.Mock;
};

// Mock localStorage
export const mockLocalStorage = () => {
  const store: Record<string, string> = {};
  
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
    }),
  };
};

// Test data generators
export const generateMockWorkshop = (overrides: Partial<Workshop> = {}): Workshop => ({
  ...mockWorkshop,
  id: `test-workshop-${Math.random().toString(36).substr(2, 9)}`,
  ...overrides,
});

export const generateMockAttendee = (overrides: any = {}) => ({
  id: `attendee-${Math.random().toString(36).substr(2, 9)}`,
  name: 'Test Attendee',
  email: 'test@example.com',
  registeredAt: new Date().toISOString(),
  paymentStatus: 'completed',
  paymentId: 'pay_test_123',
  ...overrides,
});

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };
