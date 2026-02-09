"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, ShoppingCart, CreditCard, Package, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { AlertCounts } from "@/lib/dashboard"

interface AlertsPanelProps {
  alerts: AlertCounts
}

interface AlertItem {
  label: string
  count: number
  href: string
  icon: React.ReactNode
  priority: "critical" | "high" | "medium" | "low"
}

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  const alertItems: AlertItem[] = [
    {
      label: "Failed Payments",
      count: alerts.failedPayments,
      href: "/admin/orders?paymentStatus=FAILED",
      icon: <CreditCard className="h-4 w-4" />,
      priority: "critical",
    },
    {
      label: "Pending Orders",
      count: alerts.pendingOrders,
      href: "/admin/orders?status=PENDING",
      icon: <ShoppingCart className="h-4 w-4" />,
      priority: "high",
    },
    {
      label: "Awaiting Shipment",
      count: alerts.processingOrders,
      href: "/admin/orders?status=PROCESSING",
      icon: <Package className="h-4 w-4" />,
      priority: "medium",
    },
    {
      label: "Out of Stock",
      count: alerts.outOfStockProducts,
      href: "/admin/products?stock=out",
      icon: <AlertCircle className="h-4 w-4" />,
      priority: "critical",
    },
    {
      label: "Low Stock",
      count: alerts.lowStockProducts,
      href: "/admin/products?stock=low",
      icon: <Package className="h-4 w-4" />,
      priority: "medium",
    },
  ].filter(item => item.count > 0)

  const totalAlerts = alertItems.reduce((sum, item) => sum + item.count, 0)
  const hasCritical = alertItems.some(item => item.priority === "critical" && item.count > 0)

  if (totalAlerts === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <AlertTriangle className="h-5 w-5" />
            All Clear
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No alerts or actions required at this time.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn(hasCritical && "border-red-200 bg-red-50/50 dark:bg-red-950/20")}>
      <CardHeader>
        <CardTitle className={cn(
          "flex items-center gap-2",
          hasCritical ? "text-red-600" : "text-yellow-600"
        )}>
          <AlertTriangle className="h-5 w-5" />
          Action Required ({totalAlerts})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {alertItems.map((item, index) => (
            <li key={index}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center justify-between p-2 rounded-md transition-colors hover:bg-muted",
                  item.priority === "critical" && "text-red-600",
                  item.priority === "high" && "text-orange-600",
                  item.priority === "medium" && "text-yellow-600"
                )}
              >
                <span className="flex items-center gap-2">
                  {item.icon}
                  <span className="text-sm font-medium">{item.label}</span>
                </span>
                <span className={cn(
                  "text-sm font-bold px-2 py-0.5 rounded-full",
                  item.priority === "critical" && "bg-red-100 text-red-700",
                  item.priority === "high" && "bg-orange-100 text-orange-700",
                  item.priority === "medium" && "bg-yellow-100 text-yellow-700"
                )}>
                  {item.count}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

