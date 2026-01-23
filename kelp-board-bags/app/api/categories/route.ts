import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/categories - Get all categories
export async function GET(request: NextRequest) {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            products: {
              where: {
                status: 'ACTIVE',
                deletedAt: null,
              },
            },
          },
        },
        children: true,
      },
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json({
      success: true,
      data: categories,
    })
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Failed to fetch categories',
          code: 'FETCH_ERROR',
        },
      },
      { status: 500 }
    )
  }
}

// POST /api/categories - Create new category (admin only)
export async function POST(request: NextRequest) {
  try {
    // TODO: Add authentication check
    const body = await request.json()

    const category = await prisma.category.create({
      data: body,
    })

    return NextResponse.json(
      {
        success: true,
        data: category,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Failed to create category:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Failed to create category',
          code: 'CREATE_ERROR',
        },
      },
      { status: 500 }
    )
  }
}
