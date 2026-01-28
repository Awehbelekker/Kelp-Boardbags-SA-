"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ProductCard } from "@/components/storefront/ProductCard"
import { useCart } from "@/hooks/use-cart"
import { formatPrice } from "@/lib/utils"
import {
  ShoppingCart,
  Heart,
  Truck,
  Shield,
  ArrowLeft,
  Star,
  Minus,
  Plus,
  Loader2,
} from "lucide-react"
import { ProductWithRelations } from "@/types"

export default function ProductDetailPage() {
  const params = useParams()
  const slug = params.slug as string

  const [product, setProduct] = useState<ProductWithRelations | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<ProductWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  const { addItem } = useCart()

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${slug}`)
        const data = await res.json()

        if (data.success) {
          setProduct(data.data)

          // Fetch related products
          const relatedRes = await fetch(
            `/api/products?category=${data.data.category.slug}&limit=4`
          )
          const relatedData = await relatedRes.json()

          if (relatedData.success) {
            // Filter out current product
            setRelatedProducts(
              relatedData.data.filter((p: ProductWithRelations) => p.id !== data.data.id)
            )
          }
        }
      } catch (error) {
        console.error('Failed to fetch product:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [slug])

  const handleAddToCart = () => {
    if (!product) return

    setIsAdding(true)

    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: Number(product.price),
      image: product.images[0]?.url || null,
      quantity,
      maxQuantity: product.inventory,
    })

    setTimeout(() => setIsAdding(false), 1000)
  }

  if (loading) {
    return (
      <div className="container-custom section-padding flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-kelp-green" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container-custom section-padding text-center">
        <h1 className="heading-lg mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link href="/shop">Back to Shop</Link>
        </Button>
      </div>
    )
  }

  const hasDiscount =
    product.compareAtPrice && Number(product.compareAtPrice) > Number(product.price)
  const discountPercent = hasDiscount
    ? Math.round(
        ((Number(product.compareAtPrice) - Number(product.price)) /
          Number(product.compareAtPrice)) *
          100
      )
    : 0

  return (
    <div className="container-custom section-padding">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-kelp-green">
          Home
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-kelp-green">
          Shop
        </Link>
        <span>/</span>
        <Link
          href={`/shop?category=${product.category.slug}`}
          className="hover:text-kelp-green"
        >
          {product.category.name}
        </Link>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </div>

      {/* Back Button */}
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/shop">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Shop
        </Link>
      </Button>

      {/* Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Image Gallery */}
        <div>
          {/* Main Image */}
          <div className="relative aspect-square bg-sand-beige rounded-lg overflow-hidden mb-4">
            {product.images.length > 0 ? (
              <Image
                src={product.images[selectedImage]?.url}
                alt={product.images[selectedImage]?.alt || product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                No Image Available
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.bestseller && (
                <span className="bg-kelp-green text-white px-3 py-1 rounded text-sm font-semibold">
                  Bestseller
                </span>
              )}
              {hasDiscount && (
                <span className="bg-red-500 text-white px-3 py-1 rounded text-sm font-semibold">
                  -{discountPercent}% OFF
                </span>
              )}
            </div>
          </div>

          {/* Thumbnail Gallery */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square bg-sand-beige rounded-lg overflow-hidden ${
                    selectedImage === index
                      ? 'ring-2 ring-kelp-green'
                      : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={image.alt || `${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className="mb-4">
            <Link
              href={`/shop?category=${product.category.slug}`}
              className="text-sm text-muted-foreground hover:text-kelp-green"
            >
              {product.category.name}
            </Link>
          </div>

          <h1 className="heading-lg mb-4">{product.name}</h1>

          {/* Rating */}
          {product.reviews && product.reviews.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.round((product as any).avgRating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {(product as any).avgRating?.toFixed(1)} ({(product as any).reviewCount} reviews)
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-kelp-green">
              {formatPrice(Number(product.price), 'ZAR')}
            </span>
            {hasDiscount && (
              <span className="text-xl text-muted-foreground line-through">
                {formatPrice(Number(product.compareAtPrice), 'ZAR')}
              </span>
            )}
          </div>

          {/* Short Description */}
          {product.shortDesc && (
            <p className="text-lg text-muted-foreground mb-6">{product.shortDesc}</p>
          )}

          {/* Stock Status */}
          <div className="mb-6">
            {product.inventory > 0 ? (
              <span className="text-kelp-green font-medium">
                In Stock ({product.inventory} available)
              </span>
            ) : (
              <span className="text-red-500 font-medium">Out of Stock</span>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Quantity</label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="text-xl font-medium w-12 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.min(product.inventory, quantity + 1))}
                disabled={quantity >= product.inventory}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-8">
            <Button
              onClick={handleAddToCart}
              disabled={product.inventory === 0 || isAdding}
              className="flex-1"
              size="lg"
            >
              {isAdding ? (
                <>Adding...</>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </>
              )}
            </Button>
            <Button variant="outline" size="lg">
              <Heart className="w-5 h-5" />
            </Button>
          </div>

          {/* Features */}
          <div className="space-y-4 border-t pt-6">
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-kelp-green" />
              <div>
                <p className="font-medium">Free Shipping</p>
                <p className="text-sm text-muted-foreground">
                  On orders over R1,000 in South Africa
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-kelp-green" />
              <div>
                <p className="font-medium">Quality Guarantee</p>
                <p className="text-sm text-muted-foreground">
                  30-day return policy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Description & Details */}
      <div className="mb-16">
        <Card>
          <CardContent className="p-8">
            <h2 className="heading-md mb-4">Product Description</h2>
            <div
              className="prose max-w-none text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />

            {/* Specifications */}
            <div className="mt-8 pt-8 border-t">
              <h3 className="font-heading text-xl font-semibold mb-4">Specifications</h3>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.sku && (
                  <>
                    <dt className="text-sm font-medium">SKU</dt>
                    <dd className="text-sm text-muted-foreground">{product.sku}</dd>
                  </>
                )}
                {product.weight && (
                  <>
                    <dt className="text-sm font-medium">Weight</dt>
                    <dd className="text-sm text-muted-foreground">{product.weight.toString()} kg</dd>
                  </>
                )}
                {product.dimensions && (
                  <>
                    <dt className="text-sm font-medium">Dimensions</dt>
                    <dd className="text-sm text-muted-foreground">{product.dimensions}</dd>
                  </>
                )}
              </dl>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="heading-md mb-8">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
