"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { ProductCard } from "@/components/storefront/ProductCard"
import { ProductFilters, FilterState } from "@/components/storefront/ProductFilters"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Loader2 } from "lucide-react"
import { ProductWithRelations } from "@/types"

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc'

export default function ShopPage() {
  const searchParams = useSearchParams()
  const categoryFromUrl = searchParams.get('category')

  const [products, setProducts] = useState<ProductWithRelations[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FilterState>({
    category: categoryFromUrl || undefined
  })
  const [sort, setSort] = useState<SortOption>('newest')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Update filters when URL category changes
  useEffect(() => {
    if (categoryFromUrl) {
      setFilters(prev => ({ ...prev, category: categoryFromUrl }))
    }
  }, [categoryFromUrl])

  // Fetch categories
  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCategories(data.data)
        }
      })
      .catch((error) => console.error('Failed to fetch categories:', error))
  }, [])

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)

      const params = new URLSearchParams()
      params.set('page', page.toString())
      params.set('sort', sort)

      if (filters.category) params.set('category', filters.category)
      if (filters.minPrice) params.set('minPrice', filters.minPrice.toString())
      if (filters.maxPrice) params.set('maxPrice', filters.maxPrice.toString())
      if (filters.featured) params.set('featured', 'true')
      if (filters.bestseller) params.set('bestseller', 'true')
      if (search) params.set('search', search)

      try {
        const res = await fetch(`/api/products?${params.toString()}`)
        const data = await res.json()

        if (data.success) {
          setProducts(data.data)
          setTotalPages(data.pagination.totalPages)
        }
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [filters, sort, search, page])

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
    setPage(1) // Reset to first page when filters change
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
  }

  return (
    <div className="container-custom section-padding">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="heading-lg mb-4">Shop All Products</h1>
        <p className="text-muted-foreground max-w-2xl">
          Browse our collection of handcrafted, sustainable surfboard bags.
          Each bag is made with care in Cape Town, South Africa.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit">Search</Button>
        </div>
      </form>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1">
          <ProductFilters
            categories={categories}
            onFilterChange={handleFilterChange}
            initialFilters={filters}
          />
        </aside>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {/* Sort and Results Info */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <p className="text-sm text-muted-foreground">
              {loading ? (
                'Loading...'
              ) : (
                `Showing ${products.length} product${products.length !== 1 ? 's' : ''}`
              )}
            </p>

            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm text-muted-foreground whitespace-nowrap">
                Sort by:
              </label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value as SortOption)
                  setPage(1)
                }}
                className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kelp-green"
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-kelp-green" />
            </div>
          )}

          {/* Products Grid */}
          {!loading && products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && products.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground mb-4">
                No products found
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Try adjusting your filters or search term
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setFilters({})
                  setSearch('')
                  setPage(1)
                }}
              >
                Clear All Filters
              </Button>
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              <Button
                variant="outline"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Previous
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <Button
                  key={pageNum}
                  variant={pageNum === page ? 'default' : 'outline'}
                  onClick={() => setPage(pageNum)}
                  className="w-10"
                >
                  {pageNum}
                </Button>
              ))}

              <Button
                variant="outline"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
