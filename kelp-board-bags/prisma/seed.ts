import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

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

  // Create categories
  const categories = [
    {
      name: 'Shortboard Bags',
      slug: 'shortboard-bags',
      description:
        'Lightweight, compact bags perfect for your high-performance shortboards. Available in various sizes from 5\'6" to 6\'6".',
    },
    {
      name: 'Longboard Bags',
      slug: 'longboard-bags',
      description:
        'Spacious, well-padded bags designed for longboards. Extra length and reinforced construction for maximum protection.',
    },
    {
      name: 'Fish Bags',
      slug: 'fish-bags',
      description:
        'Custom-sized bags for fish and alternative board shapes. Wider fit with reinforced tail protection.',
    },
    {
      name: 'SUP Bags',
      slug: 'sup-bags',
      description:
        'Heavy-duty bags for stand-up paddleboards. Extra padding and reinforced handles for larger boards.',
    },
    {
      name: 'Travel Bags',
      slug: 'travel-bags',
      description:
        'Ultimate protection for traveling surfers. Triple-padded with multiple board capacity and lockable zippers.',
    },
    {
      name: 'Accessories',
      slug: 'accessories',
      description:
        'Essential surf accessories including fin cases, wax pouches, and board socks.',
    },
  ]

  const createdCategories: any = {}
  for (const category of categories) {
    createdCategories[category.slug] = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    })
  }
  console.log('✅ Categories created')

  // Create products
  const products = [
    // Shortboard Bags
    {
      name: 'Classic Shortboard Day Bag',
      slug: 'classic-shortboard-day-bag',
      description: `
        <p>Our most popular shortboard bag, handcrafted in Cape Town using premium recycled materials. Perfect for daily surf sessions and local trips.</p>
        <h3>Features:</h3>
        <ul>
          <li>5mm foam padding for impact protection</li>
          <li>Water-resistant recycled polyester exterior</li>
          <li>Reinforced nose and tail protection</li>
          <li>Internal fin slot and wax pocket</li>
          <li>Padded shoulder strap</li>
          <li>Available in multiple colors</li>
        </ul>
        <p><strong>Sustainably made</strong> from ocean-bound plastics and recycled materials.</p>
      `,
      shortDesc: 'Premium daily-use shortboard bag with 5mm padding and reinforced protection.',
      categoryId: createdCategories['shortboard-bags'].id,
      price: 1250,
      compareAtPrice: 1450,
      inventory: 25,
      sku: 'KBB-SB-001',
      weight: 0.8,
      dimensions: '6\'3" x 21" x 3"',
      featured: true,
      bestseller: true,
      status: 'ACTIVE',
      metaTitle: 'Classic Shortboard Day Bag | Kelp Board Bags',
      metaDescription: 'Handcrafted shortboard bag with premium padding. Sustainably made in Cape Town.',
    },
    {
      name: 'Pro Shortboard Travel Bag',
      slug: 'pro-shortboard-travel-bag',
      description: `
        <p>Professional-grade travel bag designed for serious surfers. Triple-layered padding ensures your board arrives safely anywhere in the world.</p>
        <h3>Features:</h3>
        <ul>
          <li>10mm triple-layer foam padding</li>
          <li>Fits 2-3 shortboards</li>
          <li>Heavy-duty YKK zippers</li>
          <li>Multiple carry handles and padded straps</li>
          <li>Internal board separators</li>
          <li>Lockable zipper pulls</li>
          <li>Reinforced rail guards</li>
        </ul>
        <p>Trusted by professional surfers for international competitions.</p>
      `,
      shortDesc: 'Triple-padded travel bag for 2-3 shortboards. Professional-grade protection.',
      categoryId: createdCategories['shortboard-bags'].id,
      price: 2850,
      inventory: 15,
      sku: 'KBB-SB-002',
      weight: 1.8,
      dimensions: '6\'6" x 22" x 5"',
      featured: true,
      status: 'ACTIVE',
    },
    {
      name: 'Eco Shortboard Sock',
      slug: 'eco-shortboard-sock',
      description: `
        <p>Lightweight board sock made from 100% recycled materials. Perfect for beach walks and car transport.</p>
        <h3>Features:</h3>
        <ul>
          <li>Soft terry cloth interior</li>
          <li>Drawstring closure</li>
          <li>100% recycled polyester</li>
          <li>Machine washable</li>
          <li>Multiple size options</li>
        </ul>
      `,
      shortDesc: 'Lightweight board sock made from 100% recycled materials.',
      categoryId: createdCategories['shortboard-bags'].id,
      price: 450,
      inventory: 50,
      sku: 'KBB-SB-003',
      weight: 0.3,
      bestseller: true,
      status: 'ACTIVE',
    },

    // Longboard Bags
    {
      name: 'Classic Longboard Day Bag',
      slug: 'classic-longboard-day-bag',
      description: `
        <p>Spacious and durable bag for your longboard. Extra-long construction with reinforced handles for easy transport.</p>
        <h3>Features:</h3>
        <ul>
          <li>5mm foam padding throughout</li>
          <li>Reinforced nose cone</li>
          <li>Extra-wide design fits most longboards</li>
          <li>Multiple carry options (shoulder strap, carry handles)</li>
          <li>Large internal pocket for wax, fins, and accessories</li>
          <li>Ventilation eyelets</li>
        </ul>
      `,
      shortDesc: 'Durable longboard bag with 5mm padding and extra-wide design.',
      categoryId: createdCategories['longboard-bags'].id,
      price: 1850,
      compareAtPrice: 2100,
      inventory: 18,
      sku: 'KBB-LB-001',
      weight: 1.2,
      dimensions: '9\'6" x 24" x 4"',
      featured: true,
      status: 'ACTIVE',
    },
    {
      name: 'Noserider Longboard Bag',
      slug: 'noserider-longboard-bag',
      description: `
        <p>Specially designed for classic noserider shapes. Extra padding in the nose area and wider tail fit.</p>
        <h3>Features:</h3>
        <ul>
          <li>Enhanced nose padding (8mm)</li>
          <li>Wide tail accommodation</li>
          <li>Premium canvas exterior</li>
          <li>Leather accents</li>
          <li>Vintage-inspired design</li>
        </ul>
      `,
      shortDesc: 'Premium bag designed specifically for classic noserider longboards.',
      categoryId: createdCategories['longboard-bags'].id,
      price: 2200,
      inventory: 12,
      sku: 'KBB-LB-002',
      weight: 1.4,
      featured: true,
      bestseller: true,
      status: 'ACTIVE',
    },

    // Fish Bags
    {
      name: 'Fish & Funboard Day Bag',
      slug: 'fish-funboard-day-bag',
      description: `
        <p>Perfectly shaped for fish, eggs, and funboards. Wider fit accommodates the unique outline of alternative shapes.</p>
        <h3>Features:</h3>
        <ul>
          <li>Extra-wide construction</li>
          <li>Reinforced tail protection</li>
          <li>Twin fin compatibility</li>
          <li>5mm padding</li>
          <li>Available in multiple lengths</li>
        </ul>
      `,
      shortDesc: 'Wide-fit bag perfect for fish and funboard shapes.',
      categoryId: createdCategories['fish-bags'].id,
      price: 1450,
      inventory: 20,
      sku: 'KBB-FB-001',
      weight: 0.9,
      status: 'ACTIVE',
    },
    {
      name: 'Retro Fish Travel Bag',
      slug: 'retro-fish-travel-bag',
      description: `
        <p>Heavy-duty travel protection for your precious fish. Fits the unique dimensions of twin fin and quad fish boards.</p>
        <h3>Features:</h3>
        <ul>
          <li>10mm padding</li>
          <li>Fits 1-2 fish boards</li>
          <li>Wide tail accommodation</li>
          <li>Reinforced rail protection</li>
          <li>YKK zippers</li>
        </ul>
      `,
      shortDesc: 'Heavy-duty travel bag specifically designed for fish boards.',
      categoryId: createdCategories['fish-bags'].id,
      price: 2400,
      inventory: 10,
      sku: 'KBB-FB-002',
      weight: 1.6,
      status: 'ACTIVE',
    },

    // SUP Bags
    {
      name: 'SUP Day Bag',
      slug: 'sup-day-bag',
      description: `
        <p>Heavy-duty bag for stand-up paddleboards. Reinforced construction handles the size and weight of SUPs.</p>
        <h3>Features:</h3>
        <ul>
          <li>8mm foam padding</li>
          <li>Reinforced handles and shoulder straps</li>
          <li>Fits boards up to 12\'</li>
          <li>Extra-wide design (up to 34")</li>
          <li>Heavy-duty zippers</li>
          <li>Paddle storage strap</li>
        </ul>
      `,
      shortDesc: 'Heavy-duty SUP bag with reinforced construction and paddle storage.',
      categoryId: createdCategories['sup-bags'].id,
      price: 2650,
      inventory: 8,
      sku: 'KBB-SUP-001',
      weight: 2.2,
      status: 'ACTIVE',
    },

    // Travel Bags
    {
      name: 'Multi-Board Coffin Travel Bag',
      slug: 'multi-board-coffin-travel-bag',
      description: `
        <p>The ultimate travel solution for surf trips. Fits up to 4 shortboards or 2 longboards with maximum protection.</p>
        <h3>Features:</h3>
        <ul>
          <li>15mm triple-layer padding</li>
          <li>Fits 3-4 shortboards or 2 longboards</li>
          <li>Lockable zippers</li>
          <li>Reinforced corners and rails</li>
          <li>Multiple padded carry handles</li>
          <li>Detachable shoulder straps</li>
          <li>Internal board separators</li>
          <li>Wheels for easy transport</li>
          <li>Name tag holder</li>
        </ul>
        <p>Meets airline oversized baggage requirements.</p>
      `,
      shortDesc: 'Triple-padded coffin bag for 3-4 boards. Ultimate travel protection.',
      categoryId: createdCategories['travel-bags'].id,
      price: 4500,
      inventory: 6,
      sku: 'KBB-TB-001',
      weight: 3.5,
      featured: true,
      status: 'ACTIVE',
    },

    // Accessories
    {
      name: 'Premium Fin Case',
      slug: 'premium-fin-case',
      description: `
        <p>Protective case for your valuable fins. Padded interior holds up to 6 fins securely.</p>
        <h3>Features:</h3>
        <ul>
          <li>Holds 6 fins</li>
          <li>Foam padding</li>
          <li>Water-resistant exterior</li>
          <li>Compact design</li>
          <li>Carabiner attachment loop</li>
        </ul>
      `,
      shortDesc: 'Padded fin case holds up to 6 fins. Water-resistant exterior.',
      categoryId: createdCategories['accessories'].id,
      price: 350,
      inventory: 40,
      sku: 'KBB-ACC-001',
      weight: 0.2,
      bestseller: true,
      status: 'ACTIVE',
    },
    {
      name: 'Wax & Essentials Pouch',
      slug: 'wax-essentials-pouch',
      description: `
        <p>Keep your surf essentials organized. Water-resistant pouch with multiple compartments.</p>
        <h3>Features:</h3>
        <ul>
          <li>Water-resistant material</li>
          <li>Multiple internal pockets</li>
          <li>Holds wax, sunscreen, key, phone</li>
          <li>Carabiner clip</li>
          <li>Compact and lightweight</li>
        </ul>
      `,
      shortDesc: 'Water-resistant pouch for wax, sunscreen, and surf essentials.',
      categoryId: createdCategories['accessories'].id,
      price: 250,
      inventory: 60,
      sku: 'KBB-ACC-002',
      weight: 0.1,
      status: 'ACTIVE',
    },
    {
      name: 'Board Carry Strap',
      slug: 'board-carry-strap',
      description: `
        <p>Comfortable carry strap for easy transport. Adjustable length fits all board sizes.</p>
        <h3>Features:</h3>
        <ul>
          <li>Padded shoulder section</li>
          <li>Adjustable length</li>
          <li>Quick-release buckle</li>
          <li>Recycled nylon webbing</li>
          <li>Fits all board types</li>
        </ul>
      `,
      shortDesc: 'Padded, adjustable carry strap for easy board transport.',
      categoryId: createdCategories['accessories'].id,
      price: 180,
      inventory: 35,
      sku: 'KBB-ACC-003',
      weight: 0.15,
      status: 'ACTIVE',
    },
    {
      name: 'Change Mat & Dry Bag',
      slug: 'change-mat-dry-bag',
      description: `
        <p>Waterproof changing mat that converts into a dry bag. Perfect for post-surf changes.</p>
        <h3>Features:</h3>
        <ul>
          <li>Waterproof base</li>
          <li>Converts to dry bag</li>
          <li>Drawstring closure</li>
          <li>Large 1m diameter</li>
          <li>Compact when folded</li>
        </ul>
      `,
      shortDesc: 'Waterproof changing mat that converts into a dry bag.',
      categoryId: createdCategories['accessories'].id,
      price: 420,
      inventory: 25,
      sku: 'KBB-ACC-004',
      weight: 0.4,
      status: 'ACTIVE',
    },
  ]

  for (const product of products) {
    const created = await prisma.product.create({
      data: product,
    })

    // Add placeholder images
    await prisma.productImage.createMany({
      data: [
        {
          productId: created.id,
          url: `/images/products/${product.slug}-1.jpg`,
          alt: `${product.name} - Front View`,
          position: 0,
        },
        {
          productId: created.id,
          url: `/images/products/${product.slug}-2.jpg`,
          alt: `${product.name} - Detail View`,
          position: 1,
        },
      ],
    })
  }
  console.log('✅ Products created')

  // Create sample reviews
  const sampleCustomer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      name: 'John Surfer',
      role: 'CUSTOMER',
    },
  })

  const allProducts = await prisma.product.findMany({ take: 5 })

  for (const product of allProducts) {
    await prisma.review.create({
      data: {
        productId: product.id,
        userId: sampleCustomer.id,
        rating: 5,
        title: 'Excellent quality!',
        comment: 'This bag exceeded my expectations. The craftsmanship is outstanding and it fits my board perfectly. Highly recommend Kelp Board Bags!',
        verified: true,
        helpful: 12,
      },
    })
  }
  console.log('✅ Sample reviews created')

  // Create newsletter subscribers
  await prisma.newsletter.createMany({
    data: [
      { email: 'subscriber1@example.com', firstName: 'Sarah', lastName: 'Johnson' },
      { email: 'subscriber2@example.com', firstName: 'Mike', lastName: 'Thompson' },
    ],
  })
  console.log('✅ Newsletter subscribers created')

  // Create sample settings
  await prisma.settings.createMany({
    data: [
      { key: 'site_name', value: 'Kelp Board Bags' },
      { key: 'shipping_zones', value: JSON.stringify({ local: ['ZA'], international: [] }) },
      { key: 'free_shipping_threshold', value: '1000' },
      { key: 'tax_rate', value: '0.15' },
    ],
  })
  console.log('✅ Settings created')

  console.log('🎉 Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
