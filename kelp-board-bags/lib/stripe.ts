import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-02-24.acacia',
  typescript: true,
})

export interface CreateCheckoutSessionParams {
  orderId: string
  orderNumber: string
  email: string
  items: Array<{
    name: string
    price: number
    quantity: number
    image?: string | null
  }>
  total: number
  successUrl: string
  cancelUrl: string
}

/**
 * Create Stripe checkout session
 */
export async function createStripeCheckout({
  orderId,
  orderNumber,
  email,
  items,
  total,
  successUrl,
  cancelUrl,
}: CreateCheckoutSessionParams): Promise<Stripe.Checkout.Session> {
  // Create line items
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(item => ({
    price_data: {
      currency: 'zar',
      product_data: {
        name: item.name,
        images: item.image ? [item.image] : [],
      },
      unit_amount: Math.round(item.price * 100), // Convert to cents
    },
    quantity: item.quantity,
  }))

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    customer_email: email,
    client_reference_id: orderId,
    metadata: {
      orderId,
      orderNumber,
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
    shipping_address_collection: {
      allowed_countries: ['ZA', 'US', 'GB', 'AU', 'NZ', 'CA'],
    },
    billing_address_collection: 'required',
  })

  return session
}

/**
 * Retrieve Stripe checkout session
 */
export async function getStripeSession(sessionId: string): Promise<Stripe.Checkout.Session> {
  return await stripe.checkout.sessions.retrieve(sessionId)
}

/**
 * Create Stripe payment intent
 */
export async function createStripePaymentIntent(
  amount: number,
  orderId: string
): Promise<Stripe.PaymentIntent> {
  return await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency: 'zar',
    metadata: {
      orderId,
    },
    automatic_payment_methods: {
      enabled: true,
    },
  })
}

/**
 * Verify Stripe webhook signature
 */
export function verifyStripeWebhook(
  payload: string | Buffer,
  signature: string
): Stripe.Event {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not defined')
  }

  try {
    return stripe.webhooks.constructEvent(payload, signature, webhookSecret)
  } catch (error) {
    throw new Error(`Webhook signature verification failed: ${error}`)
  }
}

/**
 * Process Stripe webhook event
 */
export async function processStripeWebhook(event: Stripe.Event): Promise<{
  orderId: string
  status: 'succeeded' | 'failed' | 'pending'
  sessionId?: string
}> {
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      return {
        orderId: session.metadata?.orderId || session.client_reference_id || '',
        status: session.payment_status === 'paid' ? 'succeeded' : 'pending',
        sessionId: session.id,
      }
    }

    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      return {
        orderId: paymentIntent.metadata?.orderId || '',
        status: 'succeeded',
      }
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      return {
        orderId: paymentIntent.metadata?.orderId || '',
        status: 'failed',
      }
    }

    default:
      throw new Error(`Unhandled event type: ${event.type}`)
  }
}

/**
 * Create Stripe refund
 */
export async function createStripeRefund(
  paymentIntentId: string,
  amount?: number
): Promise<Stripe.Refund> {
  return await stripe.refunds.create({
    payment_intent: paymentIntentId,
    amount: amount ? Math.round(amount * 100) : undefined,
  })
}
