"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import Link from "next/link"

// Product form schema
const productFormSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().min(1, 'Description is required'),
  shortDesc: z.string().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  price: z.string().min(1, 'Price is required'),
  compareAtPrice: z.string().optional(),
  inventory: z.string().min(1, 'Inventory is required'),
  sku: z.string().optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']),
  featured: z.boolean().default(false),
  bestseller: z.boolean().default(false),
})

type ProductFormData = z.infer<typeof productFormSchema>

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [product, setProduct] = useState<any>(null)

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      shortDesc: '',
      categoryId: '',
      price: '',
      compareAtPrice: '',
      inventory: '0',
      sku: '',
      status: 'DRAFT',
      featured: false,
      bestseller: false,
    },
  })

  // Fetch product and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesRes = await fetch('/api/categories')
        const categoriesData = await categoriesRes.json()
        if (categoriesData.success) {
          setCategories(categoriesData.data)
        }

        // Fetch product
        const productRes = await fetch(`/api/products?id=${params.id}`)
        const productData = await productRes.json()
        
        if (productData.success && productData.data.length > 0) {
          const prod = productData.data[0]
          setProduct(prod)
          
          // Populate form
          form.reset({
            name: prod.name,
            slug: prod.slug,
            description: prod.description,
            shortDesc: prod.shortDesc || '',
            categoryId: prod.categoryId,
            price: prod.price.toString(),
            compareAtPrice: prod.compareAtPrice?.toString() || '',
            inventory: prod.inventory.toString(),
            sku: prod.sku || '',
            status: prod.status,
            featured: prod.featured,
            bestseller: prod.bestseller,
          })
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        alert('Failed to load product')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id, form])

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true)

    try {
      // Convert string prices to numbers
      const payload = {
        ...data,
        price: parseFloat(data.price),
        compareAtPrice: data.compareAtPrice ? parseFloat(data.compareAtPrice) : undefined,
        inventory: parseInt(data.inventory),
        trackInventory: true,
        customizable: false,
      }

      const response = await fetch(`/api/products/${product.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update product')
      }

      // Redirect to products list
      router.push('/admin/products')
      router.refresh()
    } catch (error) {
      console.error('Error updating product:', error)
      alert(error instanceof Error ? error.message : 'Failed to update product')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-kelp-green" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
        <p className="text-muted-foreground mb-4">The product you're looking for doesn't exist.</p>
        <Button asChild>
          <Link href="/admin/products">Back to Products</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/products">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Edit Product</h2>
            <p className="text-muted-foreground">
              Update product information
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    {...form.register('name')}
                    placeholder="e.g., 6ft Surfboard Bag"
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="slug">URL Slug *</Label>
                  <Input
                    id="slug"
                    {...form.register('slug')}
                    placeholder="6ft-surfboard-bag"
                  />
                  {form.formState.errors.slug && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.slug.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="shortDesc">Short Description</Label>
                  <Input
                    id="shortDesc"
                    {...form.register('shortDesc')}
                    placeholder="Brief product description"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Full Description *</Label>
                  <Textarea
                    id="description"
                    {...form.register('description')}
                    rows={6}
                    placeholder="Detailed product description..."
                  />
                  {form.formState.errors.description && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.description.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Pricing & Inventory */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing & Inventory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price (ZAR) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      {...form.register('price')}
                      placeholder="1299.00"
                    />
                    {form.formState.errors.price && (
                      <p className="text-sm text-red-600 mt-1">
                        {form.formState.errors.price.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="compareAtPrice">Compare at Price (ZAR)</Label>
                    <Input
                      id="compareAtPrice"
                      type="number"
                      step="0.01"
                      {...form.register('compareAtPrice')}
                      placeholder="1499.00"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="inventory">Inventory *</Label>
                    <Input
                      id="inventory"
                      type="number"
                      {...form.register('inventory')}
                      placeholder="10"
                    />
                    {form.formState.errors.inventory && (
                      <p className="text-sm text-red-600 mt-1">
                        {form.formState.errors.inventory.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      {...form.register('sku')}
                      placeholder="SB-6FT-001"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status & Visibility */}
            <Card>
              <CardHeader>
                <CardTitle>Status & Visibility</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={form.watch('status')}
                    onValueChange={(value) => form.setValue('status', value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="ARCHIVED">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="categoryId">Category *</Label>
                  <Select
                    value={form.watch('categoryId')}
                    onValueChange={(value) => form.setValue('categoryId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.categoryId && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.categoryId.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      {...form.register('featured')}
                      className="rounded border-gray-300 text-kelp-green focus:ring-kelp-green"
                    />
                    <span className="text-sm font-medium">Featured Product</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      {...form.register('bestseller')}
                      className="rounded border-gray-300 text-kelp-green focus:ring-kelp-green"
                    />
                    <span className="text-sm font-medium">Bestseller</span>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="pt-6 space-y-2">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push('/admin/products')}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}

