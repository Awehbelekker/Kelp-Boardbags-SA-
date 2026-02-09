"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Package } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import type { TopProduct } from "@/lib/dashboard"

interface TopProductsListProps {
  products: TopProduct[]
}

export function TopProductsList({ products }: TopProductsListProps) {
  if (products.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-5 w-5" />
            Top Selling Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No sales data available yet.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <TrendingUp className="h-5 w-5" />
          Top Selling Products
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {products.map((product, index) => (
            <li key={product.id}>
              <Link
                href={`/admin/products/${product.id}`}
                className="flex items-center gap-3 p-2 rounded-md transition-colors hover:bg-muted"
              >
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
                  {index + 1}
                </span>
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
                  <p className="text-xs text-muted-foreground">
                    {product.sales} sold
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">
                    {formatPrice(product.revenue, 'ZAR')}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

