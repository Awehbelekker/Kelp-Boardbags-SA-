import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/products/[slug] - Get single product by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: {
        slug: params.slug,
        status: 'ACTIVE',
        deletedAt: null,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        images: {
          orderBy: {
            position: 'asc',
          },
        },
        variants: true,
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
      },
    })

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Product not found',
            code: 'PRODUCT_NOT_FOUND',
          },
        },
        { status: 404 }
      )
    }

    // Calculate average rating
    const avgRating =
      product.reviews.length > 0
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
          product.reviews.length
        : 0

    return NextResponse.json({
      success: true,
      data: {
        ...product,
        avgRating: Math.round(avgRating * 10) / 10,
        reviewCount: product.reviews.length,
      },
    })
  } catch (error) {
    console.error('Failed to fetch product:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Failed to fetch product',
          code: 'FETCH_ERROR',
        },
      },
      { status: 500 }
    )
  }
}

// PUT /api/products/[slug] - Update product (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // TODO: Add authentication check
    // const session = await getServerSession()
    // if (!session || session.user.role !== 'ADMIN') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const body = await request.json()

    const product = await prisma.product.update({
      where: {
        slug: params.slug,
      },
      data: body,
      include: {
        category: true,
        images: true,
        variants: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: product,
    })
  } catch (error) {
    console.error('Failed to update product:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Failed to update product',
          code: 'UPDATE_ERROR',
        },
      },
      { status: 500 }
    )
  }
}

// DELETE /api/products/[slug] - Soft delete product (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // TODO: Add authentication check
    // const session = await getServerSession()
    // if (!session || session.user.role !== 'ADMIN') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const product = await prisma.product.update({
      where: {
        slug: params.slug,
      },
      data: {
        deletedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      data: product,
    })
  } catch (error) {
    console.error('Failed to delete product:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Failed to delete product',
          code: 'DELETE_ERROR',
        },
      },
      { status: 500 }
    )
  }
}
