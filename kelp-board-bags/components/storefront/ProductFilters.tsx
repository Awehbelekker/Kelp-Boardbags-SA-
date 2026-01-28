"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { SlidersHorizontal, X } from "lucide-react"

interface Category {
  id: string
  name: string
  slug: string
  _count: {
    products: number
  }
}

interface ProductFiltersProps {
  categories: Category[]
  onFilterChange: (filters: FilterState) => void
  initialFilters?: FilterState
}

export interface FilterState {
  category?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  featured?: boolean
  bestseller?: boolean
  search?: string
}

export function ProductFilters({
  categories,
  onFilterChange,
  initialFilters = {},
}: ProductFiltersProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters)
  const [priceRange, setPriceRange] = useState<[number, number]>([
    initialFilters.minPrice || 0,
    initialFilters.maxPrice || 5000,
  ])
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    setFilters({})
    setPriceRange([0, 5000])
    onFilterChange({})
  }

  const hasActiveFilters = Object.keys(filters).some(
    (key) => filters[key as keyof FilterState] !== undefined
  )

  const filterContent = (
    <>
      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <button
            onClick={() => updateFilter('category', undefined)}
            className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
              !filters.category
                ? 'bg-kelp-green text-white'
                : 'hover:bg-sand-beige'
            }`}
          >
            All Products
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => updateFilter('category', category.slug)}
              className={`w-full text-left px-3 py-2 rounded-md transition-colors flex justify-between items-center ${
                filters.category === category.slug
                  ? 'bg-kelp-green text-white'
                  : 'hover:bg-sand-beige'
              }`}
            >
              <span>{category.name}</span>
              <span className="text-xs opacity-70">
                ({category._count.products})
              </span>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Price Range</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Slider
              value={priceRange}
              onValueChange={(value) => setPriceRange(value as [number, number])}
              onValueCommit={(value) => {
                updateFilter('minPrice', value[0])
                updateFilter('maxPrice', value[1])
              }}
              min={0}
              max={5000}
              step={50}
              className="mb-4"
            />
            <div className="flex items-center gap-4">
              <div>
                <label className="text-xs text-muted-foreground">Min</label>
                <Input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0
                    setPriceRange([value, priceRange[1]])
                    updateFilter('minPrice', value)
                  }}
                  className="h-8"
                />
              </div>
              <span className="text-muted-foreground mt-5">-</span>
              <div>
                <label className="text-xs text-muted-foreground">Max</label>
                <Input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 5000
                    setPriceRange([priceRange[0], value])
                    updateFilter('maxPrice', value)
                  }}
                  className="h-8"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Attributes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.featured || false}
              onChange={(e) => updateFilter('featured', e.target.checked || undefined)}
              className="rounded border-gray-300 text-kelp-green focus:ring-kelp-green"
            />
            <span className="text-sm">Featured Products</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.bestseller || false}
              onChange={(e) => updateFilter('bestseller', e.target.checked || undefined)}
              className="rounded border-gray-300 text-kelp-green focus:ring-kelp-green"
            />
            <span className="text-sm">Bestsellers</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.inStock || false}
              onChange={(e) => updateFilter('inStock', e.target.checked || undefined)}
              className="rounded border-gray-300 text-kelp-green focus:ring-kelp-green"
            />
            <span className="text-sm">In Stock Only</span>
          </label>
        </CardContent>
      </Card>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          onClick={clearFilters}
          className="w-full"
        >
          <X className="w-4 h-4 mr-2" />
          Clear All Filters
        </Button>
      )}
    </>
  )

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="w-full"
        >
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Filters
          {hasActiveFilters && (
            <span className="ml-2 bg-kelp-green text-white px-2 py-0.5 rounded-full text-xs">
              Active
            </span>
          )}
        </Button>
      </div>

      {/* Mobile Filters (Drawer) */}
      {showMobileFilters && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setShowMobileFilters(false)}>
          <div
            className="absolute right-0 top-0 h-full w-80 bg-background p-6 shadow-lg overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-heading text-xl font-semibold">Filters</h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 hover:bg-sand-beige rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-6">{filterContent}</div>
          </div>
        </div>
      )}

      {/* Desktop Filters */}
      <div className="hidden lg:block space-y-6">{filterContent}</div>
    </>
  )
}
