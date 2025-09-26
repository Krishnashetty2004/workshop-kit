import { WorkshopCategory, WorkshopTone, PriceRange } from '../lib/config';

/**
 * Core workshop types
 */
export interface Workshop {
  id: string;
  title: string;
  description: string;
  instructor: Instructor;
  date: string;
  time: string;
  duration: string;
  price: number;
  currency: string;
  maxAttendees: number;
  category: WorkshopCategory;
  skills: string[];
  agenda: AgendaItem[];
  testimonials?: Testimonial[];
  faq?: FAQ[];
  theme: WorkshopTheme;
  zoomLink?: string;
  status: WorkshopStatus;
  createdAt: string;
  attendees?: Attendee[];
}

export interface Instructor {
  name: string;
  bio: string;
  avatar?: string;
}

export interface AgendaItem {
  time: string;
  title: string;
  description: string;
}

export interface Testimonial {
  name: string;
  role: string;
  content: string;
  avatar?: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface WorkshopTheme {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  style: 'modern' | 'minimal' | 'creative' | 'professional';
}

export interface Attendee {
  id: string;
  name: string;
  email: string;
  registeredAt: string;
  paymentStatus: PaymentStatus;
  paymentId?: string;
}

export interface WorkshopPrompt {
  prompt: string;
  tone?: WorkshopTone;
  targetAudience?: string;
  priceRange?: PriceRange;
}

/**
 * Application state types
 */
export type ViewState = 'home' | 'generator' | 'preview' | 'dashboard';
export type WorkshopStatus = 'draft' | 'published' | 'completed';
export type PaymentStatus = 'pending' | 'completed' | 'failed';

/**
 * API response types
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface WorkshopListResponse {
  workshops: Workshop[];
  total: number;
  page: number;
  limit: number;
}

export interface AnalyticsResponse {
  totalRevenue: number;
  totalAttendees: number;
  activeWorkshops: number;
  conversionRate: number;
  recentActivity: Activity[];
}

export interface Activity {
  type: string;
  message: string;
  timestamp: string;
}

/**
 * Component prop types
 */
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface WorkshopComponentProps extends BaseComponentProps {
  workshop: Workshop;
}

export interface NavigationProps {
  onBack: () => void;
  onNext?: () => void;
  onPublish?: () => void;
}

/**
 * Form types
 */
export interface WorkshopFormData {
  prompt: string;
  tone: WorkshopTone;
  priceRange: PriceRange;
  targetAudience: string;
}

export interface RegistrationFormData {
  name: string;
  email: string;
  workshopId: string;
}

/**
 * Error types
 */
export interface AppError {
  code: string;
  message: string;
  details?: any;
}

export interface ValidationError {
  field: string;
  message: string;
}

// Re-export types from config
export type { WorkshopCategory, WorkshopTone, PriceRange } from '../lib/config';
