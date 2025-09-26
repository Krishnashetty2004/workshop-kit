# WorkshopKit Architecture

## Overview

WorkshopKit is a modern, scalable AI-powered workshop creation platform built with Next.js 14, Express.js, and TypeScript. This document outlines the architecture, design patterns, and development guidelines.

## 🏗️ Architecture Principles

### 1. **Separation of Concerns**
- **Frontend**: Next.js App Router with React components
- **Backend**: Express.js API server for additional endpoints
- **Shared**: Common utilities, types, and configuration

### 2. **Configuration-Driven Development**
- All hardcoded values moved to centralized configuration
- Environment-based configuration management
- Type-safe configuration with TypeScript

### 3. **Component-Based Architecture**
- Reusable UI components with consistent APIs
- Shared layout components
- Business logic separated from presentation

### 4. **Error Handling**
- Comprehensive error handling system
- Custom error classes with proper HTTP status codes
- Graceful fallbacks for API failures

## 📁 Project Structure

```
project/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── workshop/      # Workshop endpoints
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Home page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── layout/           # Layout components
│   └── [feature].tsx     # Feature components
├── lib/                  # Shared utilities
│   ├── config.ts         # Configuration
│   ├── utils.ts          # Utility functions
│   ├── api.ts            # API services
│   ├── errors.ts         # Error handling
│   └── constants.ts      # Application constants
├── types/               # TypeScript definitions
│   └── index.ts         # All type definitions
├── server/              # Express.js backend
│   └── index.js         # Express server
├── __tests__/           # Test files
└── [config files]       # Configuration files
```

## 🔧 Core Systems

### Configuration System (`lib/config.ts`)

Centralized configuration management with type safety:

```typescript
export const APP_CONFIG = {
  name: 'WorkshopKit',
  version: '1.0.0',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
} as const;

export const API_CONFIG = {
  openrouter: {
    url: process.env.OPENROUTER_API_URL,
    model: 'qwen/qwen-2.5-72b-instruct',
    temperature: 0.7,
  },
} as const;
```

### Error Handling System (`lib/errors.ts`)

Comprehensive error handling with custom error classes:

```typescript
export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details?: any;
}

export class ValidationError extends AppError {
  constructor(message: string, field?: string) {
    super(message, 'VALIDATION_ERROR', 400, { field });
  }
}
```

### API Service Layer (`lib/api.ts`)

Centralized API management with proper error handling:

```typescript
class WorkshopService {
  async generateWorkshop(prompt: WorkshopPrompt): Promise<Workshop> {
    try {
      const response = await this.client.post('/workshop/generate', prompt);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}
```

### UI Component System (`components/ui/`)

Reusable, accessible UI components:

```typescript
interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}
```

## 🎨 Design System

### Color Palette
- **Primary**: Purple (#8B5CF6) to Blue (#3B82F6) gradient
- **Secondary**: Complementary colors for different categories
- **Neutral**: Gray scale for text and backgrounds

### Typography
- **Font Family**: Inter (system font)
- **Scale**: Consistent sizing with Tailwind CSS

### Spacing
- **Grid System**: 4px base unit
- **Responsive**: Mobile-first approach
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)

## 🔄 Data Flow

### Workshop Generation Flow
1. User submits workshop prompt
2. Frontend validates input
3. API route calls OpenRouter API
4. AI generates workshop content
5. Backend transforms and enriches data
6. Frontend displays generated workshop

### Error Handling Flow
1. Error occurs in any layer
2. Error is caught and wrapped in AppError
3. Appropriate HTTP status code is returned
4. Frontend displays user-friendly message
5. Fallback data is provided when possible

## 🧪 Testing Strategy

### Unit Tests
- Component testing with React Testing Library
- Utility function testing
- API service testing

### Integration Tests
- API endpoint testing
- Component interaction testing
- Error scenario testing

### Test Utilities
- Mock data generators
- Custom render functions
- API mocking utilities

## 🚀 Performance Optimizations

### Frontend
- Next.js App Router for optimal performance
- Component lazy loading
- Image optimization
- Bundle splitting

### Backend
- Express.js with efficient middleware
- CORS configuration
- Error handling middleware
- Static file serving

### API
- Request/response caching
- Error retry logic
- Fallback mechanisms
- Rate limiting (future)

## 🔒 Security Considerations

### Input Validation
- TypeScript for compile-time safety
- Runtime validation with custom validators
- Sanitization of user inputs

### API Security
- CORS configuration
- Request validation
- Error message sanitization
- Rate limiting (planned)

### Environment Variables
- Sensitive data in environment variables
- Type-safe configuration
- Development vs production configs

## 📈 Scalability Considerations

### Frontend Scalability
- Component-based architecture
- Shared UI library
- Consistent design system
- Performance monitoring

### Backend Scalability
- Stateless API design
- Database abstraction (future)
- Caching strategies
- Load balancing ready

### Development Scalability
- TypeScript for maintainability
- Comprehensive testing
- Documentation
- Code organization

## 🛠️ Development Guidelines

### Code Organization
- Feature-based file structure
- Shared utilities in `lib/`
- Type definitions in `types/`
- Components in `components/`

### Naming Conventions
- PascalCase for components
- camelCase for functions and variables
- kebab-case for files
- UPPER_CASE for constants

### Error Handling
- Always use custom error classes
- Provide meaningful error messages
- Log errors appropriately
- Handle errors gracefully

### Testing
- Write tests for all utilities
- Test component behavior
- Mock external dependencies
- Maintain high test coverage

## 🔮 Future Enhancements

### Planned Features
- Database integration
- User authentication
- Payment processing
- Email notifications
- Analytics dashboard

### Technical Improvements
- Performance monitoring
- Error tracking
- A/B testing framework
- CI/CD pipeline
- Docker containerization

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com/guide/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
