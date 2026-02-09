import { prisma } from "@/lib/prisma"

// Helper to get date ranges
function getDateRanges() {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const thisWeekStart = new Date(today)
  thisWeekStart.setDate(today.getDate() - today.getDay())
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)
  const thirtyDaysAgo = new Date(today)
  thirtyDaysAgo.setDate(today.getDate() - 30)

  return { today, thisWeekStart, thisMonthStart, lastMonthStart, lastMonthEnd, thirtyDaysAgo }
}

export interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  activeProducts: number
  averageOrderValue: number
  // Period comparisons
  revenueChange: number
  ordersChange: number
  customersChange: number
  aovChange: number
  // Today's stats
  todayRevenue: number
  todayOrders: number
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const { thisMonthStart, lastMonthStart, lastMonthEnd, today } = getDateRanges()

  try {
    // Current period stats
    const [
      paidOrders,
      thisMonthOrders,
      lastMonthOrders,
      todayOrders,
      totalCustomers,
      thisMonthCustomers,
      lastMonthCustomers,
      activeProducts,
    ] = await Promise.all([
      // All paid orders
      prisma.order.findMany({
        where: { paymentStatus: 'PAID' },
        select: { total: true, createdAt: true },
      }),
      // This month orders
      prisma.order.findMany({
        where: {
          paymentStatus: 'PAID',
          createdAt: { gte: thisMonthStart },
        },
        select: { total: true },
      }),
      // Last month orders
      prisma.order.findMany({
        where: {
          paymentStatus: 'PAID',
          createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
        },
        select: { total: true },
      }),
      // Today's orders
      prisma.order.findMany({
        where: {
          paymentStatus: 'PAID',
          createdAt: { gte: today },
        },
        select: { total: true },
      }),
      // Total customers
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      // This month customers
      prisma.user.count({
        where: { role: 'CUSTOMER', createdAt: { gte: thisMonthStart } },
      }),
      // Last month customers
      prisma.user.count({
        where: { role: 'CUSTOMER', createdAt: { gte: lastMonthStart, lte: lastMonthEnd } },
      }),
      // Active products
      prisma.product.count({ where: { status: 'ACTIVE' } }),
    ])

    const totalRevenue = paidOrders.reduce((sum, o) => sum + Number(o.total), 0)
    const totalOrders = paidOrders.length
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    const thisMonthRevenue = thisMonthOrders.reduce((sum, o) => sum + Number(o.total), 0)
    const lastMonthRevenue = lastMonthOrders.reduce((sum, o) => sum + Number(o.total), 0)

    const thisMonthAOV = thisMonthOrders.length > 0 ? thisMonthRevenue / thisMonthOrders.length : 0
    const lastMonthAOV = lastMonthOrders.length > 0 ? lastMonthRevenue / lastMonthOrders.length : 0

    // Calculate percentage changes
    const revenueChange = lastMonthRevenue > 0 
      ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
      : 0
    const ordersChange = lastMonthOrders.length > 0 
      ? ((thisMonthOrders.length - lastMonthOrders.length) / lastMonthOrders.length) * 100 
      : 0
    const customersChange = lastMonthCustomers > 0 
      ? ((thisMonthCustomers - lastMonthCustomers) / lastMonthCustomers) * 100 
      : 0
    const aovChange = lastMonthAOV > 0 
      ? ((thisMonthAOV - lastMonthAOV) / lastMonthAOV) * 100 
      : 0

    return {
      totalRevenue,
      totalOrders,
      totalCustomers,
      activeProducts,
      averageOrderValue,
      revenueChange,
      ordersChange,
      customersChange,
      aovChange,
      todayRevenue: todayOrders.reduce((sum, o) => sum + Number(o.total), 0),
      todayOrders: todayOrders.length,
    }
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error)
    return {
      totalRevenue: 0, totalOrders: 0, totalCustomers: 0, activeProducts: 0,
      averageOrderValue: 0, revenueChange: 0, ordersChange: 0, customersChange: 0,
      aovChange: 0, todayRevenue: 0, todayOrders: 0,
    }
  }
}

export interface AlertCounts {
  pendingOrders: number
  failedPayments: number
  processingOrders: number
  lowStockProducts: number
  outOfStockProducts: number
  pendingReviews: number
}

export async function getAlertCounts(): Promise<AlertCounts> {
  try {
    const [pendingOrders, failedPayments, processingOrders, lowStockProducts, outOfStockProducts] = 
      await Promise.all([
        prisma.order.count({ where: { status: 'PENDING' } }),
        prisma.order.count({ where: { paymentStatus: 'FAILED' } }),
        prisma.order.count({ where: { status: 'PROCESSING' } }),
        prisma.product.count({ where: { status: 'ACTIVE', inventory: { gt: 0, lt: 10 } } }),
        prisma.product.count({ where: { status: 'ACTIVE', inventory: 0 } }),
      ])

    return {
      pendingOrders,
      failedPayments,
      processingOrders,
      lowStockProducts,
      outOfStockProducts,
      pendingReviews: 0, // Reviews don't have moderation status in current schema
    }
  } catch (error) {
    console.error('Failed to fetch alert counts:', error)
    return { pendingOrders: 0, failedPayments: 0, processingOrders: 0, lowStockProducts: 0, outOfStockProducts: 0, pendingReviews: 0 }
  }
}

export interface OrderStatusBreakdown {
  pending: number
  processing: number
  shipped: number
  delivered: number
  cancelled: number
  refunded: number
}

export async function getOrderStatusBreakdown(): Promise<OrderStatusBreakdown> {
  try {
    const [pending, processing, shipped, delivered, cancelled, refunded] = await Promise.all([
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.order.count({ where: { status: 'PROCESSING' } }),
      prisma.order.count({ where: { status: 'SHIPPED' } }),
      prisma.order.count({ where: { status: 'DELIVERED' } }),
      prisma.order.count({ where: { status: 'CANCELLED' } }),
      prisma.order.count({ where: { status: 'REFUNDED' } }),
    ])
    return { pending, processing, shipped, delivered, cancelled, refunded }
  } catch (error) {
    console.error('Failed to fetch order status breakdown:', error)
    return { pending: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0, refunded: 0 }
  }
}

export interface TopProduct {
  id: string
  name: string
  slug: string
  image: string | null
  sales: number
  revenue: number
}

export async function getTopProducts(limit: number = 5): Promise<TopProduct[]> {
  try {
    const orderItems = await prisma.orderItem.groupBy({
      by: ['productId'],
      where: { order: { paymentStatus: 'PAID' } },
      _sum: { quantity: true, total: true },
      orderBy: { _sum: { total: 'desc' } },
      take: limit,
    })

    const productIds = orderItems.map(item => item.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { images: { take: 1, orderBy: { position: 'asc' } } },
    })

    const productMap = new Map(products.map(p => [p.id, p]))

    return orderItems.map(item => {
      const product = productMap.get(item.productId)
      return {
        id: item.productId,
        name: product?.name || 'Unknown Product',
        slug: product?.slug || '',
        image: product?.images[0]?.url || null,
        sales: item._sum.quantity || 0,
        revenue: Number(item._sum.total) || 0,
      }
    })
  } catch (error) {
    console.error('Failed to fetch top products:', error)
    return []
  }
}

export interface LowStockProduct {
  id: string
  name: string
  slug: string
  inventory: number
  image: string | null
}

export async function getLowStockProducts(limit: number = 5): Promise<LowStockProduct[]> {
  try {
    const products = await prisma.product.findMany({
      where: { status: 'ACTIVE', inventory: { lt: 10 } },
      orderBy: { inventory: 'asc' },
      take: limit,
      include: { images: { take: 1, orderBy: { position: 'asc' } } },
    })

    return products.map(p => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      inventory: p.inventory,
      image: p.images[0]?.url || null,
    }))
  } catch (error) {
    console.error('Failed to fetch low stock products:', error)
    return []
  }
}

export interface RevenueDataPoint {
  date: string
  revenue: number
  orders: number
}

export async function getRevenueChart(days: number = 30): Promise<RevenueDataPoint[]> {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)
  startDate.setHours(0, 0, 0, 0)

  try {
    const orders = await prisma.order.findMany({
      where: { paymentStatus: 'PAID', createdAt: { gte: startDate } },
      select: { total: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    })

    // Group by date
    const dataMap = new Map<string, { revenue: number; orders: number }>()

    // Initialize all dates
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      const dateStr = date.toISOString().split('T')[0]
      dataMap.set(dateStr, { revenue: 0, orders: 0 })
    }

    // Aggregate orders
    orders.forEach(order => {
      const dateStr = order.createdAt.toISOString().split('T')[0]
      const existing = dataMap.get(dateStr) || { revenue: 0, orders: 0 }
      dataMap.set(dateStr, {
        revenue: existing.revenue + Number(order.total),
        orders: existing.orders + 1,
      })
    })

    return Array.from(dataMap.entries()).map(([date, data]) => ({
      date,
      revenue: data.revenue,
      orders: data.orders,
    }))
  } catch (error) {
    console.error('Failed to fetch revenue chart data:', error)
    return []
  }
}

export interface RecentOrder {
  id: string
  orderNumber: string
  email: string
  total: number
  currency: string
  status: string
  paymentStatus: string
  createdAt: Date
  customerName: string | null
}

export async function getRecentOrders(limit: number = 5): Promise<RecentOrder[]> {
  try {
    const orders = await prisma.order.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true } } },
    })

    return orders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      email: order.email,
      total: Number(order.total),
      currency: order.currency,
      status: order.status,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
      customerName: order.user?.name || null,
    }))
  } catch (error) {
    console.error('Failed to fetch recent orders:', error)
    return []
  }
}

