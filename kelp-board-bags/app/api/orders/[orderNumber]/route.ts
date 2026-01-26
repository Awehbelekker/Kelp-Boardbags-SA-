import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { orderNumber: string } }
) {
  try {
    const order = await prisma.order.findUnique({
      where: {
        orderNumber: params.orderNumber,
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                slug: true,
                images: {
                  take: 1,
                  orderBy: {
                    position: 'asc',
                  },
                },
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

    return NextResponse.json({
      success: true,
      data: {
        ...order,
        items: order.items.map(item => ({
          ...item,
          name: item.productName,
          price: Number(item.price),
          total: Number(item.total),
        })),
        subtotal: Number(order.subtotal),
        discount: Number(order.discount),
        shippingCost: Number(order.shippingCost),
        tax: Number(order.tax),
        total: Number(order.total),
      },
    })
  } catch (error) {
    console.error('Failed to fetch order:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Failed to fetch order',
          code: 'FETCH_ERROR',
        },
      },
      { status: 500 }
    )
  }
}
