import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect()
    
    // Count records
    const [productCount, categoryCount, userCount] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.user.count(),
    ])
    
    return NextResponse.json({
      success: true,
      status: 'healthy',
      database: {
        connected: true,
        counts: {
          products: productCount,
          categories: categoryCount,
          users: userCount,
        },
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json(
      {
        success: false,
        status: 'unhealthy',
        error: {
          message: error instanceof Error ? error.message : 'Unknown error',
          details: process.env.NODE_ENV === 'development' ? String(error) : undefined,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

