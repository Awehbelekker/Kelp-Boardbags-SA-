import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendOrderConfirmationEmail } from '@/lib/email'

/**
 * POST /api/orders/[orderNumber]/send-confirmation
 * Manually send or resend order confirmation email
 * Useful for testing or if customer didn't receive email
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { orderNumber: string } }
) {
  try {
    // Fetch order with all relations
    const order = await prisma.order.findUnique({
      where: {
        orderNumber: params.orderNumber,
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
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Order not found',
            code: 'ORDER_NOT_FOUND',
          },
        },
        { status: 404 }
      )
    }

    // Send email
    const result = await sendOrderConfirmationEmail(order as any)

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: result.error || 'Failed to send email',
            code: 'EMAIL_SEND_ERROR',
          },
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Confirmation email sent to ${order.email}`,
    })
  } catch (error) {
    console.error('Failed to send confirmation email:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Failed to send confirmation email',
          code: 'EMAIL_SEND_ERROR',
        },
      },
      { status: 500 }
    )
  }
}
