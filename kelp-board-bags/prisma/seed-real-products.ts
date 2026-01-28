import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database with real products...')

  // Create admin user
  const adminPassword = await hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@kelpboardbags.co.za' },
    update: {},
    create: {
      email: 'admin@kelpboardbags.co.za',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  })
  console.log('✅ Admin user created')

  // Delete existing data
  await prisma.productImage.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  console.log('✅ Cleared existing products and categories')

  // Create real categories from current website
  const categories = [
    {
      name: 'Surf',
      slug: 'surf',
      description: 'Premium surfboard bags for all board sizes. Handcrafted in Cape Town with sustainable materials.',
    },
    {
      name: 'SUP/Foil/Waveski',
      slug: 'sup-foil-waveski',
      description: 'Specialized bags and covers for SUP boards, foil equipment, and waveskis.',
    },
    {
      name: 'Dive',
      slug: 'dive',
      description: 'Durable bags for diving equipment and gear.',
    },
    {
      name: 'Extras and Addons',
      slug: 'extras-addons',
      description: 'Additional accessories and add-ons for your board bags.',
    },
  ]

  const createdCategories: Record<string, any> = {}
  for (const category of categories) {
    const created = await prisma.category.create({
      data: category,
    })
    createdCategories[category.slug] = created
    console.log(`✅ Created category: ${category.name}`)
  }

  // Real products from kelpboardbags.co.za
  const products = [
    // SURF BAGS
    {
      name: 'Under 5ft11 Boardbag',
      slug: 'under-5ft11-boardbag',
      description: `Premium surfboard bag for boards under 5'11". 
      
Features:
- 10mm padding for maximum protection
- Heavy-duty YKK zippers
- Reinforced nose and tail protection
- Shoulder carry strap
- Made from sustainable materials
- Handcrafted in Cape Town

Perfect for shortboards and smaller performance boards.`,
      shortDesc: 'Premium bag for boards under 5\'11" with 10mm padding',
      categoryId: createdCategories['surf'].id,
      price: 1199,
      inventory: 15,
      sku: 'KBB-SURF-001',
      weight: 0.8,
      dimensions: '5\'11" x 22"',
      featured: true,
      bestseller: true,
      status: 'ACTIVE',
      metaTitle: 'Under 5ft11 Surfboard Bag | Kelp Board Bags',
      metaDescription: 'Premium handcrafted surfboard bag for boards under 5\'11". Made in Cape Town with sustainable materials.',
    },
    {
      name: '6ft Boardbag',
      slug: '6ft-boardbag',
      description: `Premium 6ft surfboard bag with superior protection.
      
Features:
- 10mm padding throughout
- Heavy-duty YKK zippers
- Reinforced nose and tail
- Comfortable shoulder strap
- Water-resistant outer layer
- Handcrafted in Cape Town

Ideal for 6ft shortboards and performance boards.`,
      shortDesc: 'Premium 6ft surfboard bag with 10mm padding',
      categoryId: createdCategories['surf'].id,
      price: 1299,
      inventory: 20,
      sku: 'KBB-SURF-002',
      weight: 0.9,
      dimensions: '6\'0" x 22"',
      featured: true,
      bestseller: true,
      status: 'ACTIVE',
      metaTitle: '6ft Surfboard Bag | Kelp Board Bags',
      metaDescription: 'Premium 6ft surfboard bag handcrafted in Cape Town. Superior protection with 10mm padding.',
    },
    {
      name: '7ft Boardbag',
      slug: '7ft-boardbag',
      description: `Premium 7ft surfboard bag for funboards and mini-mals.
      
Features:
- 10mm padding for maximum protection
- Heavy-duty YKK zippers
- Reinforced construction
- Padded shoulder strap
- Water-resistant material
- Made in Cape Town

Perfect for 7ft funboards and transitional shapes.`,
      shortDesc: 'Premium 7ft bag for funboards and mini-mals',
      categoryId: createdCategories['surf'].id,
      price: 1399,
      inventory: 18,
      sku: 'KBB-SURF-003',
      weight: 1.0,
      dimensions: '7\'0" x 23"',
      featured: false,
      bestseller: true,
      status: 'ACTIVE',
      metaTitle: '7ft Surfboard Bag | Kelp Board Bags',
      metaDescription: 'Premium 7ft surfboard bag for funboards. Handcrafted in Cape Town with sustainable materials.',
    },
    {
      name: '8ft Boardbag',
      slug: '8ft-boardbag',
      description: `Premium 8ft surfboard bag for longboards and mini-mals.

Features:
- 10mm padding throughout
- Heavy-duty YKK zippers
- Extra reinforcement for longer boards
- Comfortable padded shoulder strap
- Water-resistant outer layer
- Handcrafted in Cape Town

Ideal for 8ft longboards and performance longboards.`,
      shortDesc: 'Premium 8ft bag for longboards',
      categoryId: createdCategories['surf'].id,
      price: 1599,
      inventory: 15,
      sku: 'KBB-SURF-004',
      weight: 1.2,
      dimensions: '8\'0" x 24"',
      featured: false,
      bestseller: false,
      status: 'ACTIVE',
      metaTitle: '8ft Surfboard Bag | Kelp Board Bags',
      metaDescription: 'Premium 8ft surfboard bag for longboards. Handcrafted in Cape Town.',
    },
    {
      name: '9ft Boardbag',
      slug: '9ft-boardbag',
      description: `Premium 9ft surfboard bag for classic longboards.

Features:
- 10mm padding for maximum protection
- Heavy-duty YKK zippers
- Reinforced construction for longer boards
- Padded shoulder strap
- Water-resistant material
- Made in Cape Town

Perfect for 9ft longboards and noseriders.`,
      shortDesc: 'Premium 9ft bag for classic longboards',
      categoryId: createdCategories['surf'].id,
      price: 1799,
      inventory: 12,
      sku: 'KBB-SURF-005',
      weight: 1.4,
      dimensions: '9\'0" x 24"',
      featured: false,
      bestseller: false,
      status: 'ACTIVE',
      metaTitle: '9ft Surfboard Bag | Kelp Board Bags',
      metaDescription: 'Premium 9ft surfboard bag for classic longboards. Handcrafted in Cape Town.',
    },
    {
      name: '10ft Boardbag',
      slug: '10ft-boardbag',
      description: `Premium 10ft surfboard bag for longboards and SUPs.

Features:
- 10mm padding throughout
- Heavy-duty YKK zippers
- Extra reinforcement
- Comfortable padded shoulder strap
- Water-resistant outer layer
- Handcrafted in Cape Town

Ideal for 10ft longboards and smaller SUPs.`,
      shortDesc: 'Premium 10ft bag for longboards and SUPs',
      categoryId: createdCategories['surf'].id,
      price: 1999,
      inventory: 10,
      sku: 'KBB-SURF-006',
      weight: 1.6,
      dimensions: '10\'0" x 26"',
      featured: false,
      bestseller: false,
      status: 'ACTIVE',
      metaTitle: '10ft Surfboard Bag | Kelp Board Bags',
      metaDescription: 'Premium 10ft surfboard bag for longboards. Handcrafted in Cape Town.',
    },
    {
      name: '11ft Boardbag',
      slug: '11ft-boardbag',
      description: `Premium 11ft surfboard bag for extra-long boards.

Features:
- 10mm padding for maximum protection
- Heavy-duty YKK zippers
- Reinforced construction
- Padded shoulder strap
- Water-resistant material
- Made in Cape Town

Perfect for 11ft longboards and large SUPs.`,
      shortDesc: 'Premium 11ft bag for extra-long boards',
      categoryId: createdCategories['surf'].id,
      price: 2199,
      inventory: 8,
      sku: 'KBB-SURF-007',
      weight: 1.8,
      dimensions: '11\'0" x 26"',
      featured: false,
      bestseller: false,
      status: 'ACTIVE',
      metaTitle: '11ft Surfboard Bag | Kelp Board Bags',
      metaDescription: 'Premium 11ft surfboard bag for extra-long boards. Handcrafted in Cape Town.',
    },

    // SUP/FOIL/WAVESKI PRODUCTS
    {
      name: 'Foil Gear Bag',
      slug: 'foil-gear-bag',
      description: `Complete foil gear bag for all your foiling equipment.

Features:
- Large capacity for complete foil setup
- Multiple compartments for organization
- Heavy-duty padding and protection
- Reinforced handles and straps
- Water-resistant material
- Handcrafted in Cape Town

Fits complete foil setup including board, mast, wings, and accessories.`,
      shortDesc: 'Complete foil gear bag with multiple compartments',
      categoryId: createdCategories['sup-foil-waveski'].id,
      price: 2500,
      inventory: 8,
      sku: 'KBB-FOIL-001',
      weight: 2.0,
      dimensions: '180cm x 60cm x 30cm',
      featured: true,
      bestseller: false,
      status: 'ACTIVE',
      metaTitle: 'Foil Gear Bag | Kelp Board Bags',
      metaDescription: 'Complete foil gear bag for all your foiling equipment. Handcrafted in Cape Town.',
    },
    {
      name: 'Foil Cover Full Set',
      slug: 'foil-cover-full-set',
      description: `Complete foil cover set for maximum protection.

Features:
- Covers for mast, fuselage, and wings
- Heavy-duty padding
- Individual compartments
- Water-resistant material
- Easy to pack and transport
- Made in Cape Town

Protects your entire foil setup during transport and storage.`,
      shortDesc: 'Complete foil cover set for mast, fuselage, and wings',
      categoryId: createdCategories['sup-foil-waveski'].id,
      price: 1450,
      inventory: 12,
      sku: 'KBB-FOIL-002',
      weight: 1.0,
      dimensions: 'Various sizes',
      featured: false,
      bestseller: true,
      status: 'ACTIVE',
      metaTitle: 'Foil Cover Full Set | Kelp Board Bags',
      metaDescription: 'Complete foil cover set for maximum protection. Handcrafted in Cape Town.',
    },
    {
      name: 'Foil Cover Tip Set',
      slug: 'foil-cover-tip-set',
      description: `Protective covers for foil tips and sharp edges.

Features:
- Padded protection for wing tips
- Prevents damage during transport
- Durable construction
- Easy to install and remove
- Water-resistant material
- Handcrafted in Cape Town

Essential protection for your expensive foil wings.`,
      shortDesc: 'Protective covers for foil wing tips',
      categoryId: createdCategories['sup-foil-waveski'].id,
      price: 599,
      inventory: 20,
      sku: 'KBB-FOIL-003',
      weight: 0.3,
      dimensions: 'Universal fit',
      featured: false,
      bestseller: false,
      status: 'ACTIVE',
      metaTitle: 'Foil Cover Tip Set | Kelp Board Bags',
      metaDescription: 'Protective covers for foil wing tips. Handcrafted in Cape Town.',
    },

    // EXTRAS AND ADDONS
    {
      name: 'Changing Mat',
      slug: 'changing-mat',
      description: `Waterproof changing mat that converts into a dry bag.

Features:
- Waterproof base keeps your feet clean
- Converts into a dry bag for wet gear
- Drawstring closure
- Compact and portable
- Easy to clean
- Made from durable materials

Perfect for beach days and surf sessions.`,
      shortDesc: 'Waterproof changing mat that converts into a dry bag',
      categoryId: createdCategories['extras-addons'].id,
      price: 570,
      inventory: 25,
      sku: 'KBB-ACC-001',
      weight: 0.4,
      dimensions: '120cm diameter',
      featured: false,
      bestseller: true,
      status: 'ACTIVE',
      metaTitle: 'Changing Mat | Kelp Board Bags',
      metaDescription: 'Waterproof changing mat that converts into a dry bag. Perfect for beach days.',
    },
    {
      name: 'Postage National',
      slug: 'postage-national',
      description: `National shipping service for South Africa.

Delivery Details:
- Nationwide delivery across South Africa
- 3-5 business days delivery time
- Tracking number provided
- Insurance included
- Door-to-door service

Add this to your cart for national shipping.`,
      shortDesc: 'National shipping across South Africa',
      categoryId: createdCategories['extras-addons'].id,
      price: 350,
      inventory: 999,
      sku: 'KBB-SHIP-001',
      weight: 0,
      dimensions: 'N/A',
      featured: false,
      bestseller: false,
      status: 'ACTIVE',
      metaTitle: 'National Shipping | Kelp Board Bags',
      metaDescription: 'National shipping service across South Africa. 3-5 business days delivery.',
    },
  ]

  console.log('✅ Starting product creation...')
  
  for (const product of products) {
    const created = await prisma.product.create({
      data: product as any,
    })
    console.log(`✅ Created product: ${product.name}`)
  }

  console.log('🎉 Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

