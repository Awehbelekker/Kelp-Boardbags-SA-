# Product Import Guide

This guide explains how to populate your database with product data from your existing website.

## Option 1: Use Sample Data (Recommended for Testing)

We've created realistic sample products that you can use immediately:

```bash
cd kelp-board-bags

# Install dependencies first
npm install

# Generate Prisma client
npx prisma generate

# Push database schema (creates tables)
npx prisma db push

# Run the seed script
npm run db:seed
```

This will create:
- ✅ 15 products across 6 categories
- ✅ Product images (placeholders)
- ✅ Sample reviews
- ✅ Admin user (email: admin@kelpboardbags.co.za, password: admin123)
- ✅ Sample customer
- ✅ Newsletter subscribers

## Option 2: Import from CSV

### Step 1: Extract Your Current Product Data

Since the website has bot protection, you'll need to manually extract the data. Here are two methods:

#### Method A: Manual Browser Extraction
1. Open https://www.kelpboardbags.co.za/Shop/
2. Right-click → Inspect (or press F12)
3. Go to Console tab
4. Paste this JavaScript code:

```javascript
// Extract all products on the page
const products = Array.from(document.querySelectorAll('[data-product], .product-item, .product-card')).map(el => {
  // Adjust selectors based on your actual HTML structure
  const name = el.querySelector('.product-name, h3, h2')?.textContent?.trim()
  const price = el.querySelector('.price, .product-price')?.textContent?.trim()
  const image = el.querySelector('img')?.src
  const link = el.querySelector('a')?.href
  const description = el.querySelector('.description, .product-description')?.textContent?.trim()

  return {
    name,
    price,
    image,
    link,
    description
  }
})

// Copy to clipboard
copy(JSON.stringify(products, null, 2))
console.log('Product data copied to clipboard!')
```

5. The product data will be copied to your clipboard
6. Paste into a text editor and convert to CSV format

#### Method B: Use Browser DevTools Network Tab
1. Open the shop page with DevTools open (F12)
2. Go to Network tab
3. Refresh the page
4. Look for API calls that return product data (usually JSON format)
5. Right-click → Copy → Copy response
6. Save as JSON file

### Step 2: Convert to CSV Format

Use the template provided in `scripts/products-template.csv`.

**CSV Columns:**
- `name` - Product name (required)
- `slug` - URL-friendly version (required, lowercase, hyphens)
- `description` - Full HTML description (required)
- `shortDesc` - Brief description for cards (optional)
- `category` - Category slug (required)
- `price` - Price in ZAR (required)
- `compareAtPrice` - Original price if on sale (optional)
- `inventory` - Stock quantity (required)
- `sku` - Product SKU code (optional)
- `weight` - Weight in kg (optional)
- `dimensions` - Board dimensions (optional)
- `featured` - true/false (optional)
- `bestseller` - true/false (optional)
- `image1`, `image2`, `image3`, `image4` - Image URLs (optional)

**Example CSV:**
```csv
name,slug,description,shortDesc,category,price,compareAtPrice,inventory,sku,weight,dimensions,featured,bestseller,image1,image2
"Classic Shortboard Bag","classic-shortboard-bag","<p>Premium bag for shortboards</p>","Premium shortboard bag",shortboard-bags,1250,1450,25,KBB-001,0.8,"6'3 x 21",true,true,https://example.com/img1.jpg,https://example.com/img2.jpg
```

### Step 3: Import the CSV

```bash
npm run import-csv path/to/your-products.csv
```

The script will:
- ✅ Create categories automatically
- ✅ Skip existing products
- ✅ Import all images
- ✅ Show import summary

## Option 3: Manual Entry via Admin Panel

Once authentication is set up, you can add products through the admin interface:

1. Visit `/admin/products/new`
2. Fill in the product form
3. Upload images
4. Click "Create Product"

## Option 4: API Import

If you have access to your old website's database or API:

```typescript
// Example API import script
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function importFromAPI() {
  const response = await fetch('https://old-site.com/api/products')
  const products = await response.json()

  for (const product of products) {
    await prisma.product.create({
      data: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        // ... map other fields
      }
    })
  }
}
```

## Categories

The seed script includes these categories:
- Shortboard Bags
- Longboard Bags
- Fish Bags
- SUP Bags
- Travel Bags
- Accessories

Add more categories in the CSV or seed script as needed.

## Image Handling

### Temporary Solution
Use placeholder image paths like `/images/products/product-name.jpg`

### Production Solution
1. Download all images from your current website
2. Place them in `public/images/products/`
3. Or use Supabase Storage:
   ```typescript
   import { supabase } from '@/lib/supabase'

   const { data, error } = await supabase.storage
     .from('products')
     .upload('product-name.jpg', file)
   ```

## Troubleshooting

### "Category not found"
- Make sure category slug exists in database
- Create category first or let the import script create it

### "Duplicate slug error"
- Each product slug must be unique
- Add a number suffix: `product-name-2`

### "Invalid price format"
- Prices must be numbers without currency symbols
- Use: `1250` not `R1,250.00`

### Images not showing
- Check image URLs are accessible
- Use full URLs including `https://`
- Or place images in `public/images/products/`

## Verification

After importing, verify the data:

```bash
# Check products were imported
npx prisma studio

# Or query directly
npx prisma db seed
```

Visit http://localhost:3000/shop to see your products!

## Next Steps

1. Import/seed products
2. Download and organize product images
3. Set up image hosting (Supabase or public folder)
4. Update product images in database
5. Test shopping experience
6. Adjust prices/inventory as needed

## Need Help?

If you encounter issues:
1. Check the console for error messages
2. Verify CSV format matches template
3. Ensure database is set up (`npx prisma db push`)
4. Check product data is valid

---

**Pro Tip:** Start with the seed script to test the system, then gradually replace with your real product data!
