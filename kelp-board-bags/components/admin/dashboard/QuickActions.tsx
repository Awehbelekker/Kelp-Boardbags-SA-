"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Plus, 
  ShoppingCart, 
  Package, 
  Tag, 
  FileText, 
  Settings,
  BarChart3,
  Users
} from "lucide-react"

interface QuickAction {
  label: string
  href: string
  icon: React.ReactNode
  variant?: "default" | "outline" | "secondary"
}

const quickActions: QuickAction[] = [
  {
    label: "Add Product",
    href: "/admin/products/new",
    icon: <Plus className="h-4 w-4" />,
    variant: "default",
  },
  {
    label: "Process Orders",
    href: "/admin/orders?status=PENDING",
    icon: <ShoppingCart className="h-4 w-4" />,
    variant: "outline",
  },
  {
    label: "View Inventory",
    href: "/admin/products",
    icon: <Package className="h-4 w-4" />,
    variant: "outline",
  },
  {
    label: "Manage Coupons",
    href: "/admin/coupons",
    icon: <Tag className="h-4 w-4" />,
    variant: "outline",
  },
  {
    label: "View Analytics",
    href: "/admin/analytics",
    icon: <BarChart3 className="h-4 w-4" />,
    variant: "outline",
  },
  {
    label: "Customers",
    href: "/admin/customers",
    icon: <Users className="h-4 w-4" />,
    variant: "outline",
  },
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || "outline"}
              size="sm"
              className="justify-start"
              asChild
            >
              <Link href={action.href}>
                {action.icon}
                <span className="ml-2">{action.label}</span>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

