import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'

// Review validation schema
const reviewSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  rating: z.number().min(1).max(5, 'Rating must be between 1 and 5'),
  title: z.string().optional(),
  comment: z.string().min(10, 'Review must be at least 10 characters'),
})

/**
 * POST /api/reviews
 * Create a new review (requires authentication)
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth()

    if (!session || !session.user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'You must be logged in to submit a review',
            code: 'UNAUTHORIZED',
          },
        },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Validate input
    const validatedFields = reviewSchema.safeParse(body)

    if (!validatedFields.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Validation failed',
            code: 'VALIDATION_ERROR',
            details: validatedFields.error.errors,
          },
        },
        { status: 400 }
      )
    }

    const { productId, rating, title, comment } = validatedFields.data

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
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

    // Check if user already reviewed this product
    const existingReview = await prisma.review.findFirst({
      where: {
        productId,
        userId: session.user.id,
      },
    })

    if (existingReview) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'You have already reviewed this product',
            code: 'DUPLICATE_REVIEW',
          },
        },
        { status: 409 }
      )
    }

    // Check if user has purchased this product
    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          userId: session.user.id,
          paymentStatus: 'PAID',
        },
      },
    })

    // Create review
    const review = await prisma.review.create({
      data: {
        productId,
        userId: session.user.id,
        rating,
        title,
        comment,
        verified: !!hasPurchased,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    console.log('Review created:', review.id)

    return NextResponse.json(
      {
        success: true,
        data: review,
        message: 'Review submitted successfully',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Failed to create review:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Failed to create review',
          code: 'CREATE_ERROR',
        },
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/reviews?productId=xxx
 * Get reviews for a product
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Product ID is required',
            code: 'MISSING_PRODUCT_ID',
          },
        },
        { status: 400 }
      )
    }

    // Get reviews with user info
    const reviews = await prisma.review.findMany({
      where: {
        productId,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Calculate average rating
    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        : 0

    return NextResponse.json({
      success: true,
      data: {
        reviews,
        stats: {
          total: reviews.length,
          averageRating: Math.round(averageRating * 10) / 10,
          distribution: {
            1: reviews.filter((r) => r.rating === 1).length,
            2: reviews.filter((r) => r.rating === 2).length,
            3: reviews.filter((r) => r.rating === 3).length,
            4: reviews.filter((r) => r.rating === 4).length,
            5: reviews.filter((r) => r.rating === 5).length,
          },
        },
      },
    })
  } catch (error) {
    console.error('Failed to fetch reviews:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Failed to fetch reviews',
          code: 'FETCH_ERROR',
        },
      },
      { status: 500 }
    )
  }
}
