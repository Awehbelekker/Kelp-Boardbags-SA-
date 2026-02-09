"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, ExternalLink } from "lucide-react"
import { formatPrice, formatDate } from "@/lib/utils"
import { cn } from "@/lib/utils"
import type { RecentOrder } from "@/lib/dashboard"

interface RecentOrdersListProps {
  orders: RecentOrder[]
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  REFUNDED: "bg-gray-100 text-gray-700",
}

const PAYMENT_STYLES: Record<string, string> = {
  PENDING: "text-yellow-600",
  PAID: "text-green-600",
  FAILED: "text-red-600",
  REFUNDED: "text-gray-600",
}

export function RecentOrdersList({ orders }: RecentOrdersListProps) {
  if (orders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No orders yet.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Orders
        </CardTitle>
        <Link
          href="/admin/orders"
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          View all <ExternalLink className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/admin/orders/${order.id}`}
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{order.orderNumber}</span>
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      STATUS_STYLES[order.status] || "bg-gray-100 text-gray-700"
                    )}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {order.customerName || order.email}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(order.createdAt)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  {formatPrice(order.total, order.currency)}
                </p>
                <p
                  className={cn(
                    "text-xs font-medium",
                    PAYMENT_STYLES[order.paymentStatus] || "text-gray-600"
                  )}
                >
                  {order.paymentStatus}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

