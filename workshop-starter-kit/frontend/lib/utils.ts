import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { WORKSHOP_CONFIG, type PriceRange } from './config';

/**
 * Utility function to merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate a random workshop ID
 */
export function generateWorkshopId(): string {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * Generate price based on price range
 */
export function generatePrice(priceRange: PriceRange): number {
  const range = WORKSHOP_CONFIG.priceRanges[priceRange];
  if (range.min === range.max) return range.min;
  return Math.floor(Math.random() * (range.max - range.min)) + range.min;
}

/**
 * Get next workshop date (2 weeks from now)
 */
export function getNextWorkshopDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + 14);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

/**
 * Generate theme colors based on category and tone
 */
export function generateTheme(category: string, tone?: string) {
  const themes = {
    'Design': { primaryColor: '#8B5CF6', secondaryColor: '#06B6D4' },
    'Development': { primaryColor: '#3B82F6', secondaryColor: '#10B981' },
    'Marketing': { primaryColor: '#F59E0B', secondaryColor: '#EF4444' },
    'Writing': { primaryColor: '#EC4899', secondaryColor: '#8B5CF6' },
    'Business': { primaryColor: '#059669', secondaryColor: '#DC2626' },
    'Health': { primaryColor: '#10B981', secondaryColor: '#F59E0B' },
    'Creative': { primaryColor: '#EC4899', secondaryColor: '#8B5CF6' },
    'Technology': { primaryColor: '#6366F1', secondaryColor: '#8B5CF6' }
  };

  const theme = themes[category as keyof typeof themes] || themes.Design;

  return {
    primaryColor: theme.primaryColor,
    secondaryColor: theme.secondaryColor,
    fontFamily: 'Inter',
    style: tone === 'professional' ? 'professional' as const : 
           tone === 'technical' ? 'minimal' as const : 
           tone === 'inspiring' ? 'creative' as const : 'modern' as const
  };
}

/**
 * Format currency
 */
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Format date
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Validate email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Truncate text
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
