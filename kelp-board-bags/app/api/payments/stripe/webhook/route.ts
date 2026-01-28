import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyStripeWebhook, processStripeWebhook } from '@/lib/stripe'
import { sendOrderConfirmationEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    // Get the raw body
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    // Verify and construct event
    const event = verifyStripeWebhook(body, signature)

    console.log('Stripe webhook received:', event.type)

    // Process the webhook
    const result = await processStripeWebhook(event)

    // Update order in database
    const order = await prisma.order.update({
      where: { id: result.orderId },
      data: {
        paymentStatus: result.status === 'succeeded' ? 'PAID' : result.status === 'failed' ? 'FAILED' : 'PENDING',
        status: result.status === 'succeeded' ? 'PROCESSING' : 'PENDING',
        paymentId: result.sessionId,
        paymentData: {
          stripeEvent: event.type,
          status: result.status,
        },
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
          },
        },
      },
    })

    console.log('Order updated:', order.orderNumber, 'Status:', order.paymentStatus)

    // Send order confirmation email with invoice
    if (result.status === 'succeeded') {
      const emailResult = await sendOrderConfirmationEmail(order as any)
      if (!emailResult.success) {
        console.error('Failed to send confirmation email:', emailResult.error)
      } else {
        console.log('Confirmation email sent successfully')
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Stripe webhook error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Webhook processing failed' },
      { status: 400 }
    )
  }
}
