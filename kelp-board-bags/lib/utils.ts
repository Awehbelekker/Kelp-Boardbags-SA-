import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format price with currency symbol
 */
export function formatPrice(
  price: number | string,
  currency: string = 'ZAR'
): string {
  const amount = typeof price === 'string' ? parseFloat(price) : price

  const currencySymbols: Record<string, string> = {
    ZAR: 'R',
    USD: '$',
    EUR: '€',
    GBP: '£',
  }

  const symbol = currencySymbols[currency] || currency

  return `${symbol}${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

/**
 * Calculate discount amount
 */
export function calculateDiscount(
  price: number,
  discountValue: number,
  discountType: 'percentage' | 'fixed'
): number {
  if (discountType === 'percentage') {
    return price - (price * discountValue) / 100
  }
  return price - discountValue
}

/**
 * Generate order number
 */
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 7).toUpperCase()
  return `KBB-${timestamp}-${random}`
}

/**
 * Format date
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Truncate text
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

/**
 * Create slug from text
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Calculate shipping cost based on weight and destination
 */
export function calculateShipping(
  weight: number,
  country: string = 'ZA'
): number {
  // South Africa: R80 base + R15 per kg
  // International: R250 base + R50 per kg

  if (country === 'ZA' || country === 'South Africa') {
    return 80 + (weight * 15)
  }

  return 250 + (weight * 50)
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

/**
 * Check if email is valid
 */
export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}
