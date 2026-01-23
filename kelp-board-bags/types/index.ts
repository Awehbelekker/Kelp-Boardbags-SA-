import { Prisma } from '@prisma/client'

// ============================================
// DATABASE TYPES
// ============================================

// Product with relations
export type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    category: true
    images: true
    variants: true
    reviews: {
      include: {
        user: {
          select: {
            name: true
            image: true
          }
        }
      }
    }
  }
}>

// Order with relations
export type OrderWithRelations = Prisma.OrderGetPayload<{
  include: {
    items: {
      include: {
        product: {
          include: {
            images: true
          }
        }
      }
    }
    user: {
      select: {
        name: true
        email: true
        phone: true
      }
    }
    coupon: true
  }
}>

// User with relations
export type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    addresses: true
    orders: true
    loyaltyPoints: true
  }
}>

// Review with relations
export type ReviewWithUser = Prisma.ReviewGetPayload<{
  include: {
    user: {
      select: {
        name: true
        image: true
      }
    }
  }
}>

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    message: string
    code?: string
    details?: any
  }
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// ============================================
// CART TYPES
// ============================================

export interface CartItem {
  id: string
  productId: string
  name: string
  slug: string
  price: number
  image: string | null
  quantity: number
  variantId?: string
  variantName?: string
  maxQuantity: number
}

export interface Cart {
  items: CartItem[]
  subtotal: number
  discount: number
  shipping: number
  tax: number
  total: number
}

// ============================================
// CHECKOUT TYPES
// ============================================

export interface ShippingAddress {
  firstName: string
  lastName: string
  company?: string
  address1: string
  address2?: string
  city: string
  province?: string
  postalCode: string
  country: string
  phone: string
}

export interface BillingAddress extends ShippingAddress {}

export interface CheckoutSession {
  cart: Cart
  shippingAddress: ShippingAddress | null
  billingAddress: BillingAddress | null
  sameAsShipping: boolean
  email: string
  phone: string
  paymentMethod: 'PAYFAST' | 'STRIPE' | 'WHATSAPP' | null
  couponCode?: string
  customerNotes?: string
}

// ============================================
// FILTER & SORT TYPES
// ============================================

export interface ProductFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  featured?: boolean
  bestseller?: boolean
  search?: string
}

export type ProductSortOption =
  | 'newest'
  | 'price-asc'
  | 'price-desc'
  | 'name-asc'
  | 'name-desc'
  | 'popular'

export interface PaginationParams {
  page?: number
  limit?: number
}

// ============================================
// PAYMENT TYPES
// ============================================

export interface PaymentIntent {
  id: string
  amount: number
  currency: string
  status: string
  clientSecret?: string
}

export interface PayFastPaymentData {
  merchant_id: string
  merchant_key: string
  return_url: string
  cancel_url: string
  notify_url: string
  name_first: string
  name_last: string
  email_address: string
  m_payment_id: string
  amount: string
  item_name: string
  item_description?: string
  signature: string
}

// ============================================
// ANALYTICS TYPES
// ============================================

export interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  averageOrderValue: number
  revenueChange: number
  ordersChange: number
  customersChange: number
  aovChange: number
}

export interface SalesData {
  date: string
  revenue: number
  orders: number
}

export interface TopProduct {
  id: string
  name: string
  slug: string
  image: string | null
  sales: number
  revenue: number
}

// ============================================
// NOTIFICATION TYPES
// ============================================

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: Date
  read: boolean
}

// ============================================
// CUSTOM ORDER TYPES
// ============================================

export interface CustomOrderConfig {
  boardType: string
  dimensions: {
    length: number
    width: number
    thickness: number
  }
  fabricColor: string
  liningColor?: string
  padding: 'standard' | 'extra' | 'pro'
  additionalPockets: boolean
  handleType: 'standard' | 'padded' | 'reinforced'
  embroidery?: string
  specialInstructions?: string
  estimatedPrice: number
}

// ============================================
// EMAIL TEMPLATE TYPES
// ============================================

export interface OrderConfirmationEmail {
  orderNumber: string
  customerName: string
  orderDate: string
  items: Array<{
    name: string
    quantity: number
    price: number
    total: number
  }>
  subtotal: number
  shipping: number
  tax: number
  total: number
  shippingAddress: ShippingAddress
}

export interface ShippingNotificationEmail {
  orderNumber: string
  customerName: string
  trackingNumber: string
  carrier: string
  estimatedDelivery?: string
}

// ============================================
// LOYALTY & REFERRAL TYPES
// ============================================

export interface LoyaltyTier {
  name: string
  minPoints: number
  discount: number
  perks: string[]
}

export interface ReferralReward {
  type: 'discount' | 'points'
  value: number
  referrerReward: number
  referredReward: number
}

// ============================================
// SEARCH TYPES
// ============================================

export interface SearchResult {
  products: ProductWithRelations[]
  totalResults: number
  suggestions: string[]
  filters: {
    categories: Array<{ id: string; name: string; count: number }>
    priceRange: { min: number; max: number }
  }
}

// ============================================
// UTILITY TYPES
// ============================================

export type Nullable<T> = T | null
export type Optional<T> = T | undefined
export type Maybe<T> = T | null | undefined
