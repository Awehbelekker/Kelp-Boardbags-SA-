import { redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatPrice, formatDate } from "@/lib/utils"
import { Package, Eye } from "lucide-react"

async function getUserOrders(userId: string) {
  try {
    const orders = await prisma.order.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
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
      },
    })

    return orders
  } catch (error) {
    console.error('Failed to fetch user orders:', error)
    return []
  }
}

export default async function AccountOrdersPage() {
  const session = await auth()

  if (!session || !session.user) {
    redirect('/auth/login?callbackUrl=/account/orders')
  }

  const orders = await getUserOrders(session.user.id)

  const getStatusColor = (status: string) => {
    const colors = {
      PENDING: "text-yellow-600 bg-yellow-50",
      PROCESSING: "text-blue-600 bg-blue-50",
      SHIPPED: "text-purple-600 bg-purple-50",
      DELIVERED: "text-green-600 bg-green-50",
      CANCELLED: "text-red-600 bg-red-50",
    }
    return colors[status as keyof typeof colors] || colors.PENDING
  }

  return (
    <div className="container-custom section-padding">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="heading-lg mb-2">My Orders</h1>
          <p className="text-muted-foreground">
            View and track your order history
          </p>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
              <p className="text-muted-foreground mb-6">
                Start shopping to see your orders here
              </p>
              <Button asChild>
                <Link href="/shop">Browse Products</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        Order {order.orderNumber}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Order Items */}
                  <div className="space-y-3 mb-4">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-muted-foreground">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <p className="font-medium">
                          {formatPrice(Number(item.total), order.currency)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Order Total */}
                  <div className="border-t pt-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">Total</p>
                      <p className="text-2xl font-bold text-kelp-green">
                        {formatPrice(Number(order.total), order.currency)}
                      </p>
                    </div>
                    <Button variant="outline" asChild>
                      <Link href={`/account/orders/${order.orderNumber}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Link>
                    </Button>
                  </div>

                  {/* Payment Status */}
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Payment:</span>
                      <span
                        className={`font-medium ${
                          order.paymentStatus === 'PAID'
                            ? 'text-green-600'
                            : 'text-yellow-600'
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
