import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { processPayFastWebhook, verifyPayFastHost, PayFastWebhookData } from '@/lib/payfast'
import { sendOrderConfirmationEmail } from '@/lib/email'

// Route segment config for App Router
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    // Get the host from the request
    const host = request.headers.get('host') || ''

    // Verify the request is from PayFast (commented out for localhost testing)
    // const isValidHost = await verifyPayFastHost(host)
    // if (!isValidHost) {
    //   console.error('Invalid PayFast host:', host)
    //   return NextResponse.json({ error: 'Invalid host' }, { status: 403 })
    // }

    // Parse the form data
    const formData = await request.formData()
    const data: Record<string, string> = {}

    formData.forEach((value, key) => {
      data[key] = value.toString()
    })

    console.log('PayFast webhook received:', data)

    // Process the webhook
    const result = await processPayFastWebhook(data as unknown as PayFastWebhookData)

    if (!result.success) {
      console.error('PayFast payment failed:', result)
    }

    // Update order in database
    const order = await prisma.order.update({
      where: { id: result.orderId },
      data: {
        paymentStatus: result.success ? 'PAID' : 'FAILED',
        status: result.success ? 'PROCESSING' : 'PENDING',
        paymentId: result.transactionId,
        paymentData: data,
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
    if (result.success) {
      const emailResult = await sendOrderConfirmationEmail(order as any)
      if (!emailResult.success) {
        console.error('Failed to send confirmation email:', emailResult.error)
      } else {
        console.log('Confirmation email sent successfully')
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('PayFast webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
