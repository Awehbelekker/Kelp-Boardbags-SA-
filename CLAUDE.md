# CLAUDE.md - Kelp Board Bags Development Guide

**Last Updated:** 2026-01-23
**Project:** Kelp Board Bags E-Commerce Platform
**Status:** Active Development

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Development Workflow](#development-workflow)
5. [Key Conventions](#key-conventions)
6. [Database Schema](#database-schema)
7. [API Patterns](#api-patterns)
8. [Component Guidelines](#component-guidelines)
9. [Testing Strategy](#testing-strategy)
10. [Deployment](#deployment)
11. [AI Assistant Guidelines](#ai-assistant-guidelines)

---

## 🎯 Project Overview

### Purpose
Kelp Board Bags is a premium e-commerce platform for a Cape Town-based artisan manufacturer of high-end, custom surfboard bags. The platform supports both local (South African) and international customers.

### Brand Identity
- **Aesthetic**: Earthy, natural, sustainable
- **Color Palette**: Kelp green (#2C5F3A), Ocean teal (#4A8B8B), Sand beige (#D4C5B0)
- **Typography**: Syne (headings), Source Sans 3 (body)
- **Design Principles**: Mobile-first, generous whitespace, natural imagery, subtle animations

### Key Features
- Multi-currency e-commerce (ZAR, USD, EUR, GBP)
- Dual payment gateway (PayFast for SA, Stripe for international)
- Custom order builder
- WhatsApp integration for ordering and support
- Admin self-service tools (page builder, theme customizer)
- Loyalty and referral programs
- Progressive Web App (PWA)

---

## 🛠 Technology Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v3+ with custom design system
- **UI Components**: shadcn/ui (customized)
- **Forms**: React Hook Form + Zod validation
- **State Management**:
  - Zustand (cart, UI state)
  - React Query (server state)
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Backend
- **API**: Next.js API Routes (App Router)
- **Database**: PostgreSQL via Supabase
- **ORM**: Prisma
- **Authentication**: NextAuth.js v5 (Auth.js)
- **File Storage**: Supabase Storage
- **Email**: Resend

### Payments
- **South Africa**: PayFast
- **International**: Stripe
- **Multi-currency**: Real-time conversion

### DevOps
- **Hosting**: Vercel
- **Database**: Supabase
- **CDN**: Vercel Edge Network
- **Monitoring**: Vercel Analytics + Sentry
- **CI/CD**: GitHub Actions

---

## 📁 Project Structure

```
kelp-board-bags/
├── app/                          # Next.js App Router
│   ├── (storefront)/            # Public-facing pages
│   │   ├── page.tsx             # Homepage
│   │   ├── shop/                # Product catalog
│   │   ├── cart/                # Shopping cart
│   │   ├── checkout/            # Checkout flow
│   │   ├── custom-order/        # Custom bag builder
│   │   ├── account/             # Customer portal
│   │   └── journal/             # Blog
│   ├── (admin)/                 # Admin panel
│   │   └── admin/
│   │       ├── products/        # Product management
│   │       ├── orders/          # Order management
│   │       ├── customers/       # Customer management
│   │       ├── content/         # CMS
│   │       ├── analytics/       # Analytics dashboard
│   │       └── settings/        # Site settings
│   ├── api/                     # API routes
│   │   ├── auth/                # Authentication
│   │   ├── products/            # Product CRUD
│   │   ├── orders/              # Order operations
│   │   ├── payments/            # Payment processing
│   │   └── newsletter/          # Newsletter signup
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
│
├── components/
│   ├── storefront/              # Customer-facing components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── ProductCard.tsx
│   │   └── CartDrawer.tsx
│   ├── admin/                   # Admin components
│   │   ├── AdminSidebar.tsx
│   │   ├── DataTable.tsx
│   │   └── ProductForm.tsx
│   ├── ui/                      # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   └── card.tsx
│   └── shared/                  # Shared utilities
│       ├── ImageUpload.tsx
│       └── LoadingSpinner.tsx
│
├── lib/                         # Utility libraries
│   ├── prisma.ts                # Prisma client
│   ├── auth.ts                  # Auth config
│   ├── utils.ts                 # Helper functions
│   ├── validations.ts           # Zod schemas
│   └── email.ts                 # Email sending
│
├── hooks/                       # Custom React hooks
│   ├── use-cart.ts              # Cart management
│   ├── use-wishlist.ts          # Wishlist management
│   └── use-products.ts          # Product queries
│
├── store/                       # Zustand stores
│   ├── cart-store.ts            # Shopping cart
│   └── ui-store.ts              # UI state
│
├── types/                       # TypeScript types
│   ├── index.ts
│   ├── product.ts
│   └── order.ts
│
├── config/                      # Configuration
│   ├── site.ts                  # Site config
│   └── navigation.ts            # Nav items
│
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── seed.ts                  # Seed data
│
└── public/                      # Static assets
    ├── images/
    ├── icons/
    └── fonts/
```

---

## 🔄 Development Workflow

### Getting Started

```bash
# Clone repository
git clone [repository-url]
cd kelp-board-bags

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run database migrations
npx prisma migrate dev

# Seed database (optional)
npx prisma db seed

# Start development server
npm run dev
```

### Environment Variables Required

```bash
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="[generate with: openssl rand -base64 32]"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# PayFast
PAYFAST_MERCHANT_ID="..."
PAYFAST_MERCHANT_KEY="..."
PAYFAST_PASSPHRASE="..."

# Email (Resend)
RESEND_API_KEY="re_..."
EMAIL_FROM="orders@kelpboardbags.co.za"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..."

# WhatsApp (optional)
WHATSAPP_BUSINESS_NUMBER="+27..."
WHATSAPP_API_KEY="..."

# Analytics
NEXT_PUBLIC_GA_ID="G-..."

# Site
NEXT_PUBLIC_URL="http://localhost:3000"
```

### Branch Strategy

- `main` - Production branch (protected)
- `develop` - Development branch
- `feature/*` - Feature branches
- `fix/*` - Bug fix branches
- `claude/*` - AI-generated branches (auto-created)

### Commit Conventions

```
feat: Add WhatsApp ordering integration
fix: Resolve payment gateway timeout issue
refactor: Optimize product query performance
docs: Update API documentation
style: Apply brand color palette
test: Add checkout flow tests
chore: Update dependencies
```

---

## 📏 Key Conventions

### Code Style

1. **TypeScript Strict Mode**: Always enabled
2. **Naming Conventions**:
   - Components: PascalCase (`ProductCard.tsx`)
   - Hooks: camelCase with `use` prefix (`useCart.ts`)
   - Utilities: camelCase (`formatPrice.ts`)
   - Constants: UPPER_SNAKE_CASE (`MAX_CART_ITEMS`)
   - API routes: kebab-case folders

3. **Component Structure**:
```typescript
// 1. Imports (external, then internal)
import { useState } from 'react';
import { Button } from '@/components/ui/button';

// 2. Types/Interfaces
interface ProductCardProps {
  product: Product;
  onAddToCart: (id: string) => void;
}

// 3. Component
export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  // Hooks
  const [isLoading, setIsLoading] = useState(false);

  // Handlers
  const handleAddToCart = () => {
    setIsLoading(true);
    onAddToCart(product.id);
  };

  // Render
  return (
    <div className="product-card">
      {/* JSX */}
    </div>
  );
}

// 4. Exports (if needed)
```

4. **File Organization**:
   - One component per file
   - Co-locate related files (component + styles + tests)
   - Use barrel exports (index.ts) for cleaner imports

### Styling Conventions

1. **Tailwind First**: Always use Tailwind utilities
2. **Custom Classes**: Only when necessary, prefix with component name
3. **Responsive**: Mobile-first breakpoints
4. **Dark Mode**: Not currently implemented (future consideration)

```typescript
// Good
<button className="bg-kelp-green hover:bg-kelp-green-light text-white px-4 py-2 rounded-lg">

// Avoid
<button style={{ backgroundColor: '#2C5F3A' }}>
```

### API Route Conventions

```typescript
// app/api/products/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

// GET /api/products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const products = await prisma.product.findMany({
      where: category ? { categoryId: category } : {},
      include: { images: true, category: true },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/products (protected)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();

    // Validate with Zod
    const validated = productSchema.parse(data);

    const product = await prisma.product.create({
      data: validated,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Failed to create product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
```

### Form Validation Pattern

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const checkoutSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  phone: z.string().regex(/^[0-9+\s-]+$/, 'Invalid phone number'),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export function CheckoutForm() {
  const form = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: '',
      firstName: '',
      // ...
    },
  });

  const onSubmit = async (data: CheckoutForm) => {
    // Handle submission
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
}
```

---

## 🗄 Database Schema

### Key Models

#### Product
```prisma
model Product {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String   @db.Text

  categoryId  String
  category    Category @relation(fields: [categoryId], references: [id])

  price       Decimal  @db.Decimal(10, 2)
  compareAtPrice Decimal? @db.Decimal(10, 2)

  inventory   Int      @default(0)

  images      ProductImage[]
  variants    ProductVariant[]

  featured    Boolean  @default(false)
  bestseller  Boolean  @default(false)
  status      ProductStatus @default(DRAFT)

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

#### Order
```prisma
model Order {
  id              String      @id @default(cuid())
  orderNumber     String      @unique

  userId          String?
  user            User?       @relation(fields: [userId], references: [id])

  email           String
  status          OrderStatus @default(PENDING)

  items           OrderItem[]

  subtotal        Decimal     @db.Decimal(10, 2)
  shippingCost    Decimal     @db.Decimal(10, 2)
  total           Decimal     @db.Decimal(10, 2)

  currency        String      @default("ZAR")

  paymentStatus   PaymentStatus @default(PENDING)
  paymentMethod   String?

  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt
}
```

### Prisma Best Practices

1. **Always use transactions for multi-model operations**:
```typescript
await prisma.$transaction(async (tx) => {
  const order = await tx.order.create({ /* ... */ });
  await tx.orderItem.createMany({ /* ... */ });
  await tx.product.updateMany({ /* decrement inventory */ });
});
```

2. **Use includes sparingly** (avoid N+1 queries):
```typescript
// Good
const products = await prisma.product.findMany({
  include: {
    images: true,
    category: { select: { name: true, slug: true } },
  },
});

// Avoid (over-fetching)
const products = await prisma.product.findMany({
  include: {
    images: true,
    category: true,
    variants: true,
    reviews: { include: { user: true } },
  },
});
```

3. **Soft deletes where appropriate**:
```prisma
model Product {
  deletedAt DateTime?
}
```

---

## 🔌 API Patterns

### Error Handling

```typescript
// lib/api-errors.ts
export class APIError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string
  ) {
    super(message);
  }
}

// Usage
if (!product) {
  throw new APIError(404, 'Product not found', 'PRODUCT_NOT_FOUND');
}
```

### Response Formatting

```typescript
// Success
return NextResponse.json({
  success: true,
  data: products,
  pagination: {
    page: 1,
    limit: 20,
    total: 100,
  },
});

// Error
return NextResponse.json({
  success: false,
  error: {
    message: 'Validation failed',
    code: 'VALIDATION_ERROR',
    details: validationErrors,
  },
}, { status: 400 });
```

### Rate Limiting

```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
});

export async function checkRateLimit(identifier: string) {
  const { success, limit, reset, remaining } = await ratelimit.limit(identifier);

  if (!success) {
    throw new APIError(429, 'Too many requests', 'RATE_LIMIT_EXCEEDED');
  }

  return { limit, reset, remaining };
}
```

---

## 🎨 Component Guidelines

### UI Component Library (shadcn/ui)

```bash
# Add new component
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add dialog
```

### Custom Components

```typescript
// components/storefront/ProductCard.tsx
import { Product } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string) => void;
  onToggleWishlist?: (productId: string) => void;
}

export function ProductCard({
  product,
  onAddToCart,
  onToggleWishlist,
}: ProductCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden">
        <div className="relative aspect-square">
          <Image
            src={product.images[0]?.url || '/placeholder.png'}
            alt={product.name}
            fill
            className="object-cover"
          />

          {product.bestseller && (
            <div className="absolute top-2 left-2 bg-kelp-green text-white px-2 py-1 rounded text-xs font-semibold">
              Bestseller
            </div>
          )}

          <button
            onClick={() => onToggleWishlist?.(product.id)}
            className="absolute top-2 right-2 p-2 bg-white rounded-full hover:bg-gray-100"
            aria-label="Add to wishlist"
          >
            <Heart className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          <h3 className="font-heading font-semibold text-lg mb-1">
            {product.name}
          </h3>
          <p className="text-driftwood text-sm mb-2">
            {product.category.name}
          </p>
          <p className="font-semibold text-xl mb-4">
            R{product.price.toFixed(2)}
          </p>

          <Button
            onClick={() => onAddToCart?.(product.id)}
            className="w-full"
          >
            Add to Cart
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
```

### Animation Patterns

```typescript
// lib/animations.ts
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 },
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Usage
<motion.div variants={staggerContainer} initial="hidden" animate="visible">
  {products.map((product) => (
    <motion.div key={product.id} variants={staggerItem}>
      <ProductCard product={product} />
    </motion.div>
  ))}
</motion.div>
```

---

## 🧪 Testing Strategy

### Unit Tests (Jest)

```typescript
// lib/__tests__/utils.test.ts
import { formatPrice, calculateDiscount } from '../utils';

describe('formatPrice', () => {
  it('formats price correctly', () => {
    expect(formatPrice(1850, 'ZAR')).toBe('R1,850.00');
    expect(formatPrice(99.99, 'USD')).toBe('$99.99');
  });
});

describe('calculateDiscount', () => {
  it('calculates percentage discount', () => {
    expect(calculateDiscount(100, 10, 'percentage')).toBe(90);
  });

  it('calculates fixed discount', () => {
    expect(calculateDiscount(100, 15, 'fixed')).toBe(85);
  });
});
```

### Integration Tests

```typescript
// app/api/products/__tests__/route.test.ts
import { GET, POST } from '../route';
import { prisma } from '@/lib/prisma';

jest.mock('@/lib/prisma', () => ({
  prisma: {
    product: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}));

describe('/api/products', () => {
  describe('GET', () => {
    it('returns products', async () => {
      const mockProducts = [{ id: '1', name: 'Test Product' }];
      (prisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts);

      const request = new Request('http://localhost:3000/api/products');
      const response = await GET(request);
      const data = await response.json();

      expect(data).toEqual(mockProducts);
    });
  });
});
```

### E2E Tests (Playwright)

```typescript
// tests/checkout.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
  test('complete checkout successfully', async ({ page }) => {
    // Navigate to shop
    await page.goto('/shop');

    // Add product to cart
    await page.click('[data-testid="product-card"]:first-child button');
    await expect(page.locator('[data-testid="cart-count"]')).toHaveText('1');

    // Go to cart
    await page.click('[data-testid="cart-button"]');
    await expect(page).toHaveURL(/\/cart/);

    // Proceed to checkout
    await page.click('[data-testid="checkout-button"]');

    // Fill shipping details
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="firstName"]', 'John');
    await page.fill('[name="lastName"]', 'Doe');
    // ... fill more fields

    // Submit order
    await page.click('[data-testid="place-order-button"]');

    // Verify success
    await expect(page).toHaveURL(/\/checkout\/success/);
    await expect(page.locator('h1')).toContainText('Thank you');
  });
});
```

---

## 🚀 Deployment

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Link project
vercel link

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Environment Variables (Vercel)

Set all environment variables in Vercel dashboard:
- Project Settings → Environment Variables
- Separate values for Development, Preview, Production

### Database Migrations

```bash
# Generate migration
npx prisma migrate dev --name add_whatsapp_fields

# Deploy to production
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate
```

### Build Command
```json
{
  "scripts": {
    "build": "prisma generate && next build",
    "postbuild": "next-sitemap"
  }
}
```

---

## 🤖 AI Assistant Guidelines

### When Working on This Project

1. **Always Read Files First**: Never propose changes to code you haven't read
2. **Mobile-First**: Every feature must work perfectly on mobile
3. **Type Safety**: Use TypeScript strictly, no `any` types
4. **Avoid Over-Engineering**:
   - Don't add features not explicitly requested
   - Don't refactor unrelated code
   - Keep solutions simple and focused
4. **Security First**:
   - Validate all inputs (Zod schemas)
   - Protect API routes (authentication checks)
   - Never commit secrets
   - Prevent SQL injection (use Prisma)
5. **Performance**:
   - Optimize images (Next.js Image component)
   - Lazy load components
   - Use React Query for caching
   - Implement pagination
6. **Accessibility**:
   - Semantic HTML
   - ARIA labels
   - Keyboard navigation
   - Screen reader support

### Common Tasks

#### Adding a New Product Feature
1. Update Prisma schema if needed
2. Run migration: `npx prisma migrate dev`
3. Update TypeScript types
4. Create/update API routes
5. Add validation schemas (Zod)
6. Update components
7. Add tests
8. Update documentation

#### Creating a New Page
1. Create route in `app/(storefront)/` or `app/(admin)/`
2. Add page metadata for SEO
3. Create necessary components
4. Add to navigation (if needed)
5. Test responsive design
6. Add to sitemap

#### Integrating Third-Party Service
1. Add environment variables
2. Create lib file (e.g., `lib/whatsapp.ts`)
3. Add API routes if needed
4. Create React hooks for client-side
5. Add error handling
6. Document in CLAUDE.md
7. Test thoroughly

### Code Review Checklist

Before submitting code, ensure:
- [ ] TypeScript compiles without errors
- [ ] ESLint passes (`npm run lint`)
- [ ] Tests pass (`npm test`)
- [ ] Mobile responsive
- [ ] Accessibility tested
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Empty states handled
- [ ] Environment variables documented
- [ ] Comments added for complex logic

### Performance Targets

- **Lighthouse Scores**: 90+ across all metrics
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Image optimization**: WebP format, lazy loading
- **Code splitting**: Dynamic imports for heavy components

### Brand Consistency

Always maintain:
- Color palette (use CSS variables)
- Typography (Syne for headings, Source Sans 3 for body)
- Spacing system (Tailwind's default)
- Component patterns (shadcn/ui)
- Animation style (subtle, purposeful)

### Don'ts

❌ Don't add emojis to code (unless explicitly requested)
❌ Don't create documentation files proactively
❌ Don't add backwards-compatibility hacks
❌ Don't use `any` types
❌ Don't skip validation
❌ Don't ignore mobile
❌ Don't commit secrets
❌ Don't over-engineer

### Do's

✅ Read existing code first
✅ Use TypeScript strictly
✅ Validate all inputs
✅ Handle errors gracefully
✅ Test on mobile
✅ Keep it simple
✅ Document complex logic
✅ Follow established patterns

---

## 📚 Additional Resources

### Documentation Links
- [Next.js 14 Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [React Hook Form](https://react-hook-form.com)
- [Zod](https://zod.dev)
- [Framer Motion](https://www.framer.com/motion)

### Design System
- Figma: [Link to design files]
- Brand Guidelines: [Link to brand docs]
- Component Library: [Storybook URL]

### Team Contacts
- **Product Owner**: [Contact]
- **Tech Lead**: [Contact]
- **Designer**: [Contact]

---

## 🔄 Changelog

### 2026-01-23
- Initial CLAUDE.md creation
- Project structure defined
- Development guidelines established

---

**Last reviewed**: 2026-01-23
**Next review**: 2026-02-23

For questions or clarifications, refer to the full project specification or reach out to the development team.
