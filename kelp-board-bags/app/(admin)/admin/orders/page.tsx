import { prisma } from "@/lib/prisma"
import { OrdersTable } from "@/components/admin/OrdersTable"

async function getOrders() {
  try {
    const orders = await prisma.order.findMany({
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
        items: {
          select: {
            quantity: true,
          },
        },
      },
    })

    return orders
  } catch (error) {
    console.error('Failed to fetch orders:', error)
    return []
  }
}

export default async function AdminOrdersPage() {
  const orders = await getOrders()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
        <p className="text-muted-foreground">
          Manage and track customer orders
        </p>
      </div>

      <OrdersTable orders={orders} />
    </div>
  )
}
