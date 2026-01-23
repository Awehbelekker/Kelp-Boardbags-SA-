"use client"

import Link from "next/link"
import Image from "next/image"
import { Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { formatPrice } from "@/lib/utils"
import { ProductWithRelations } from "@/types"
import { useCart } from "@/hooks/use-cart"
import { useState } from "react"
import { motion } from "framer-motion"

interface ProductCardProps {
  product: ProductWithRelations
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setIsAdding(true)

    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: Number(product.price),
      image: product.images[0]?.url || null,
      maxQuantity: product.inventory,
    })

    setTimeout(() => setIsAdding(false), 1000)
  }

  const hasDiscount = product.compareAtPrice && Number(product.compareAtPrice) > Number(product.price)
  const discountPercent = hasDiscount
    ? Math.round(((Number(product.compareAtPrice) - Number(product.price)) / Number(product.compareAtPrice)) * 100)
    : 0

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden h-full flex flex-col group">
        <Link href={`/shop/products/${product.slug}`} className="block relative">
          {/* Product Image */}
          <div className="relative aspect-square bg-sand-beige overflow-hidden">
            {product.images[0]?.url ? (
              <Image
                src={product.images[0].url}
                alt={product.images[0].alt || product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                No Image
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-2">
              {product.bestseller && (
                <span className="bg-kelp-green text-white px-2 py-1 rounded text-xs font-semibold">
                  Bestseller
                </span>
              )}
              {product.featured && (
                <span className="bg-ocean-teal text-white px-2 py-1 rounded text-xs font-semibold">
                  Featured
                </span>
              )}
              {hasDiscount && (
                <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                  -{discountPercent}%
                </span>
              )}
              {product.inventory === 0 && (
                <span className="bg-gray-500 text-white px-2 py-1 rounded text-xs font-semibold">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              className="absolute top-2 right-2 p-2 bg-white rounded-full hover:bg-sand-beige transition-colors opacity-0 group-hover:opacity-100"
              aria-label="Add to wishlist"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                // TODO: Implement wishlist functionality
              }}
            >
              <Heart className="w-4 h-4" />
            </button>
          </div>
        </Link>

        <CardContent className="flex-1 p-4">
          <Link href={`/shop/products/${product.slug}`}>
            {/* Category */}
            <p className="text-xs text-muted-foreground mb-1">
              {product.category.name}
            </p>

            {/* Product Name */}
            <h3 className="font-heading font-semibold text-base mb-2 line-clamp-2 hover:text-kelp-green transition-colors">
              {product.name}
            </h3>

            {/* Short Description */}
            {product.shortDesc && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {product.shortDesc}
              </p>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-kelp-green">
                {formatPrice(Number(product.price), 'ZAR')}
              </span>
              {hasDiscount && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(Number(product.compareAtPrice), 'ZAR')}
                </span>
              )}
            </div>
          </Link>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button
            onClick={handleAddToCart}
            disabled={product.inventory === 0 || isAdding}
            className="w-full"
          >
            {isAdding ? (
              <>Adding...</>
            ) : product.inventory === 0 ? (
              <>Out of Stock</>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
