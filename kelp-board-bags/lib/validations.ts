import { z } from 'zod'

// ============================================
// AUTH SCHEMAS
// ============================================

export const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

// ============================================
// PRODUCT SCHEMAS
// ============================================

export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().min(1, 'Description is required'),
  shortDesc: z.string().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  price: z.number().positive('Price must be positive'),
  compareAtPrice: z.number().positive().optional(),
  costPrice: z.number().positive().optional(),
  inventory: z.number().int().nonnegative('Inventory cannot be negative'),
  sku: z.string().optional(),
  trackInventory: z.boolean().default(true),
  weight: z.number().positive().optional(),
  dimensions: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  featured: z.boolean().default(false),
  bestseller: z.boolean().default(false),
  customizable: z.boolean().default(false),
  status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']),
})

export const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  image: z.string().url().optional(),
  parentId: z.string().optional(),
})

// ============================================
// CHECKOUT SCHEMAS
// ============================================

export const checkoutSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  phone: z.string().regex(/^[0-9+\s-]+$/, 'Invalid phone number'),

  // Shipping address
  shippingFirstName: z.string().min(1, 'First name is required'),
  shippingLastName: z.string().min(1, 'Last name is required'),
  shippingCompany: z.string().optional(),
  shippingAddress1: z.string().min(1, 'Address is required'),
  shippingAddress2: z.string().optional(),
  shippingCity: z.string().min(1, 'City is required'),
  shippingProvince: z.string().optional(),
  shippingPostalCode: z.string().min(1, 'Postal code is required'),
  shippingCountry: z.string().min(1, 'Country is required'),
  shippingPhone: z.string().regex(/^[0-9+\s-]+$/, 'Invalid phone number'),

  // Billing address
  sameAsShipping: z.boolean().default(true),
  billingFirstName: z.string().optional(),
  billingLastName: z.string().optional(),
  billingCompany: z.string().optional(),
  billingAddress1: z.string().optional(),
  billingAddress2: z.string().optional(),
  billingCity: z.string().optional(),
  billingProvince: z.string().optional(),
  billingPostalCode: z.string().optional(),
  billingCountry: z.string().optional(),
  billingPhone: z.string().optional(),

  // Order details
  customerNotes: z.string().optional(),

  // Payment
  paymentMethod: z.enum(['PAYFAST', 'STRIPE', 'WHATSAPP']),
})

export const addressSchema = z.object({
  type: z.enum(['shipping', 'billing']),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  company: z.string().optional(),
  address1: z.string().min(1, 'Address is required'),
  address2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  province: z.string().optional(),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
  phone: z.string().regex(/^[0-9+\s-]+$/, 'Invalid phone number'),
  isDefault: z.boolean().default(false),
})

// ============================================
// REVIEW SCHEMA
// ============================================

export const reviewSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  rating: z.number().int().min(1).max(5, 'Rating must be between 1 and 5'),
  title: z.string().optional(),
  comment: z.string().min(10, 'Review must be at least 10 characters'),
})

// ============================================
// COUPON SCHEMA
// ============================================

export const couponSchema = z.object({
  code: z.string().min(1, 'Coupon code is required').toUpperCase(),
  description: z.string().optional(),
  type: z.enum(['PERCENTAGE', 'FIXED']),
  value: z.number().positive('Value must be positive'),
  minPurchase: z.number().positive().optional(),
  maxDiscount: z.number().positive().optional(),
  usageLimit: z.number().int().positive().optional(),
  validFrom: z.date(),
  validUntil: z.date().optional(),
  active: z.boolean().default(true),
})

// ============================================
// NEWSLETTER SCHEMA
// ============================================

export const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
})

// ============================================
// CONTACT SCHEMA
// ============================================

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^[0-9+\s-]+$/, 'Invalid phone number').optional(),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

// ============================================
// BLOG POST SCHEMA
// ============================================

export const blogPostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  excerpt: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  featuredImage: z.string().url().optional(),
  published: z.boolean().default(false),
  publishedAt: z.date().optional(),
  metaTitle: z.string().optional(),
  metaDesc: z.string().optional(),
  tags: z.array(z.string()).default([]),
})

// ============================================
// CUSTOM ORDER SCHEMA
// ============================================

export const customOrderSchema = z.object({
  boardType: z.string().min(1, 'Board type is required'),
  length: z.number().positive('Length must be positive'),
  width: z.number().positive('Width must be positive'),
  thickness: z.number().positive('Thickness must be positive'),
  fabricColor: z.string().min(1, 'Fabric color is required'),
  liningColor: z.string().optional(),
  padding: z.enum(['standard', 'extra', 'pro']),
  additionalPockets: z.boolean().default(false),
  handleType: z.enum(['standard', 'padded', 'reinforced']),
  embroidery: z.string().max(20).optional(),
  specialInstructions: z.string().max(500).optional(),
})

// Type exports
export type SignInInput = z.infer<typeof signInSchema>
export type SignUpInput = z.infer<typeof signUpSchema>
export type ProductInput = z.infer<typeof productSchema>
export type CategoryInput = z.infer<typeof categorySchema>
export type CheckoutInput = z.infer<typeof checkoutSchema>
export type AddressInput = z.infer<typeof addressSchema>
export type ReviewInput = z.infer<typeof reviewSchema>
export type CouponInput = z.infer<typeof couponSchema>
export type NewsletterInput = z.infer<typeof newsletterSchema>
export type ContactInput = z.infer<typeof contactSchema>
export type BlogPostInput = z.infer<typeof blogPostSchema>
export type CustomOrderInput = z.infer<typeof customOrderSchema>
