#!/usr/bin/env tsx
/**
 * Import products from CSV file
 *
 * Usage: npm run import-csv path/to/products.csv
 *
 * CSV Format:
 * name,slug,description,shortDesc,category,price,compareAtPrice,inventory,sku,weight,featured,bestseller,image1,image2,image3
 */

import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

interface ProductRow {
  name: string
  slug: string
  description: string
  shortDesc?: string
  category: string
  price: string
  compareAtPrice?: string
  inventory: string
  sku?: string
  weight?: string
  dimensions?: string
  featured?: string
  bestseller?: string
  image1?: string
  image2?: string
  image3?: string
  image4?: string
}

function parseCSV(content: string): ProductRow[] {
  const lines = content.split('\n').filter(line => line.trim())
  const headers = lines[0].split(',').map(h => h.trim())

  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''))
    const row: any = {}
    headers.forEach((header, index) => {
      row[header] = values[index] || undefined
    })
    return row as ProductRow
  })
}

async function importProducts(csvPath: string) {
  console.log('📥 Reading CSV file:', csvPath)

  if (!fs.existsSync(csvPath)) {
    console.error('❌ File not found:', csvPath)
    process.exit(1)
  }

  const content = fs.readFileSync(csvPath, 'utf-8')
  const products = parseCSV(content)

  console.log(`📦 Found ${products.length} products to import\n`)

  let imported = 0
  let skipped = 0
  let errors = 0

  for (const product of products) {
    try {
      // Find or create category
      let category = await prisma.category.findUnique({
        where: { slug: product.category },
      })

      if (!category) {
        console.log(`📁 Creating category: ${product.category}`)
        category = await prisma.category.create({
          data: {
            name: product.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            slug: product.category,
            description: '',
          },
        })
      }

      // Check if product already exists
      const existing = await prisma.product.findUnique({
        where: { slug: product.slug },
      })

      if (existing) {
        console.log(`⏭️  Skipping existing product: ${product.name}`)
        skipped++
        continue
      }

      // Create product
      const created = await prisma.product.create({
        data: {
          name: product.name,
          slug: product.slug,
          description: product.description,
          shortDesc: product.shortDesc,
          categoryId: category.id,
          price: parseFloat(product.price),
          compareAtPrice: product.compareAtPrice ? parseFloat(product.compareAtPrice) : undefined,
          inventory: parseInt(product.inventory),
          sku: product.sku,
          weight: product.weight ? parseFloat(product.weight) : undefined,
          dimensions: product.dimensions,
          featured: product.featured === 'true' || product.featured === '1',
          bestseller: product.bestseller === 'true' || product.bestseller === '1',
          status: 'ACTIVE',
        },
      })

      // Add images
      const images = [product.image1, product.image2, product.image3, product.image4]
        .filter(Boolean)
        .map((url, index) => ({
          productId: created.id,
          url: url!,
          alt: `${product.name} - Image ${index + 1}`,
          position: index,
        }))

      if (images.length > 0) {
        await prisma.productImage.createMany({
          data: images,
        })
      }

      console.log(`✅ Imported: ${product.name}`)
      imported++
    } catch (error) {
      console.error(`❌ Error importing ${product.name}:`, error)
      errors++
    }
  }

  console.log('\n📊 Import Summary:')
  console.log(`  ✅ Imported: ${imported}`)
  console.log(`  ⏭️  Skipped: ${skipped}`)
  console.log(`  ❌ Errors: ${errors}`)
}

// Get CSV path from command line
const csvPath = process.argv[2]

if (!csvPath) {
  console.error('Usage: npm run import-csv path/to/products.csv')
  process.exit(1)
}

importProducts(csvPath)
  .catch((e) => {
    console.error('❌ Import failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
