/**
 * Yoco Payment Gateway Integration
 * Yoco is a popular South African payment processor
 * Docs: https://developer.yoco.com/online/
 */

export interface YocoCheckoutOptions {
  amount: number // Amount in cents (ZAR)
  currency: string // Should be 'ZAR'
  cancelUrl: string
  successUrl: string
  failureUrl: string
  metadata?: {
    orderNumber: string
    customerEmail: string
    customerName?: string
    [key: string]: any
  }
}

export interface YocoCheckoutResponse {
  id: string
  redirectUrl: string
  status: string
}

/**
 * Create a Yoco checkout session
 * Returns a redirect URL for the customer to complete payment
 */
export async function createYocoCheckout(
  options: YocoCheckoutOptions
): Promise<YocoCheckoutResponse> {
  const yocoSecretKey = process.env.YOCO_SECRET_KEY

  if (!yocoSecretKey) {
    throw new Error('YOCO_SECRET_KEY is not configured')
  }

  try {
    const response = await fetch('https://payments.yoco.com/api/checkouts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${yocoSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: options.amount,
        currency: options.currency,
        cancelUrl: options.cancelUrl,
        successUrl: options.successUrl,
        failureUrl: options.failureUrl,
        metadata: options.metadata,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Yoco API error: ${error.message || 'Unknown error'}`)
    }

    const data = await response.json()

    return {
      id: data.id,
      redirectUrl: data.redirectUrl,
      status: data.status,
    }
  } catch (error) {
    console.error('Yoco checkout creation failed:', error)
    throw error
  }
}

/**
 * Verify Yoco webhook signature
 * Used to validate webhook requests from Yoco
 */
export function verifyYocoWebhook(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const crypto = require('crypto')
  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(payload)
  const expectedSignature = hmac.digest('hex')
  
  return signature === expectedSignature
}

/**
 * Get Yoco payment status
 * Fetch the current status of a payment
 */
export async function getYocoPaymentStatus(
  checkoutId: string
): Promise<{ status: string; amount: number; metadata?: any }> {
  const yocoSecretKey = process.env.YOCO_SECRET_KEY

  if (!yocoSecretKey) {
    throw new Error('YOCO_SECRET_KEY is not configured')
  }

  try {
    const response = await fetch(
      `https://payments.yoco.com/api/checkouts/${checkoutId}`,
      {
        headers: {
          'Authorization': `Bearer ${yocoSecretKey}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch Yoco payment status')
    }

    const data = await response.json()

    return {
      status: data.status,
      amount: data.amount,
      metadata: data.metadata,
    }
  } catch (error) {
    console.error('Failed to get Yoco payment status:', error)
    throw error
  }
}

/**
 * Convert Yoco status to our internal payment status
 */
export function mapYocoStatus(yocoStatus: string): 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' {
  switch (yocoStatus.toLowerCase()) {
    case 'successful':
    case 'completed':
      return 'PAID'
    case 'failed':
    case 'cancelled':
      return 'FAILED'
    case 'refunded':
      return 'REFUNDED'
    default:
      return 'PENDING'
  }
}

