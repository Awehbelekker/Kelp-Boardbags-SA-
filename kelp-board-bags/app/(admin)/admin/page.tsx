import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, ShoppingCart, Package, Users } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { formatPrice } from "@/lib/utils"

async function getStats() {
  try {
    // Get total revenue
    const orders = await prisma.order.findMany({
      where: {
        paymentStatus: 'PAID',
      },
      select: {
        total: true,
      },
    })

    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total), 0)

    // Get order count
    const orderCount = await prisma.order.count()

    // Get product count
    const productCount = await prisma.product.count({
      where: {
        status: 'ACTIVE',
      },
    })

    // Get customer count
    const customerCount = await prisma.user.count({
      where: {
        role: 'CUSTOMER',
      },
    })

    return {
      totalRevenue,
      orderCount,
      productCount,
      customerCount,
    }
  } catch (error) {
    console.error('Failed to fetch stats:', error)
    return {
      totalRevenue: 0,
      orderCount: 0,
      productCount: 0,
      customerCount: 0,
    }
  }
}

async function getRecentOrders() {
  try {
    const orders = await prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
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

    return orders
  } catch (error) {
    console.error('Failed to fetch recent orders:', error)
    return []
  }
}

export default async function AdminDashboardPage() {
  const stats = await getStats()
  const recentOrders = await getRecentOrders()

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your store performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(stats.totalRevenue, 'ZAR')}
            </div>
            <p className="text-xs text-muted-foreground">
              From paid orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Orders
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.orderCount}
            </div>
            <p className="text-xs text-muted-foreground">
              Total orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.productCount}
            </div>
            <p className="text-xs text-muted-foreground">
              Active products
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Customers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.customerCount}
            </div>
            <p className="text-xs text-muted-foreground">
              Registered users
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground">No orders yet</p>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {order.orderNumber}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.email}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {formatPrice(Number(order.total), order.currency)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
