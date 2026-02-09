"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Package } from "lucide-react"
import { cn } from "@/lib/utils"
import type { LowStockProduct } from "@/lib/dashboard"

interface LowStockListProps {
  products: LowStockProduct[]
}

export function LowStockList({ products }: LowStockListProps) {
  if (products.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <AlertTriangle className="h-5 w-5" />
            Low Stock Alert
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            All products are well stocked.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-yellow-200 bg-yellow-50/50 dark:bg-yellow-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base text-yellow-700 dark:text-yellow-500">
          <AlertTriangle className="h-5 w-5" />
          Low Stock Alert ({products.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {products.map((product) => (
            <li key={product.id}>
              <Link
                href={`/admin/products/${product.id}/edit`}
                className="flex items-center gap-3 p-2 rounded-md transition-colors hover:bg-muted"
              >
                <div className="relative w-10 h-10 rounded overflow-hidden bg-muted flex-shrink-0">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{product.name}</p>
                </div>
                <div className="text-right">
                  <span
                    className={cn(
                      "text-sm font-bold px-2 py-0.5 rounded-full",
                      product.inventory === 0
                        ? "bg-red-100 text-red-700"
                        : product.inventory < 5
                        ? "bg-orange-100 text-orange-700"
                        : "bg-yellow-100 text-yellow-700"
                    )}
                  >
                    {product.inventory === 0 ? "Out of stock" : `${product.inventory} left`}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/admin/products?stock=low"
          className="block mt-4 text-sm text-center text-primary hover:underline"
        >
          View all low stock products →
        </Link>
      </CardContent>
    </Card>
  )
}

