"use client"

import { useState } from "react"
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

// Product form schema (client-side version)
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

export default function NewProductPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState<any[]>([])

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

  // Fetch categories on mount
  useState(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCategories(data.data)
        }
      })
      .catch(console.error)
  })

  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    form.setValue('name', name)
    
    // Auto-generate slug if it's empty or matches the previous name's slug
    const currentSlug = form.getValues('slug')
    if (!currentSlug || currentSlug === generateSlug(form.getValues('name'))) {
      form.setValue('slug', generateSlug(name))
    }
  }

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

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

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create product')
      }

      const result = await response.json()
      
      // Redirect to products list
      router.push('/admin/products')
      router.refresh()
    } catch (error) {
      console.error('Error creating product:', error)
      alert(error instanceof Error ? error.message : 'Failed to create product')
    } finally {
      setIsSubmitting(false)
    }
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
            <h2 className="text-3xl font-bold tracking-tight">Add New Product</h2>
            <p className="text-muted-foreground">
              Create a new product for your store
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
                    onChange={handleNameChange}
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
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Create Product
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

