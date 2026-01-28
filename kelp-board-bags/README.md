
# Kelp Board Bags - E-Commerce Platform

> A premium, sustainable surfboard bag e-commerce platform built for Cape Town artisan manufacturers.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.20-2D3748)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC)](https://tailwindcss.com/)

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Database Setup](#-database-setup)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

## 🌊 Overview

Kelp Board Bags is a full-featured e-commerce platform designed for selling premium, handcrafted surfboard bags. Built with modern web technologies, it supports both local (South African) and international customers with multi-currency pricing and dual payment gateways.

### Brand Identity
- **Aesthetic**: Earthy, natural, sustainable
- **Target Market**: Surfers, board enthusiasts, eco-conscious consumers
- **Location**: Cape Town, South Africa

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **PostgreSQL** 14.x or higher ([Download](https://www.postgresql.org/download/))
- **npm** or **yarn** package manager
- **Git** for version control

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/Awehbelekker/Kelp-Boardbags-SA-.git
cd kelp-board-bags
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/kelp_board_bags"

# NextAuth (generate secret with: openssl rand -base64 32)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"

# Stripe (for international payments)
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# PayFast (for South African payments)
PAYFAST_MERCHANT_ID="your_merchant_id"
PAYFAST_MERCHANT_KEY="your_merchant_key"
PAYFAST_PASSPHRASE="your_passphrase"

# Email (Resend)
RESEND_API_KEY="re_..."
EMAIL_FROM="orders@kelpboardbags.co.za"
```

4. **Set up the database**
```bash
# Generate Prisma client
npx prisma generate

# Create database tables
npx prisma db push

# Seed with sample data (optional but recommended)
npm run db:seed
```

5. **Run the development server**
```bash
npm run dev
```

6. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

### Default Admin Credentials

After seeding the database, you can log in to the admin panel at `/admin`:

- **Email**: `admin@kelpboardbags.co.za`
- **Password**: `admin123`

⚠️ **Important**: Change these credentials immediately in production!

## 🗄 Database Setup

### Using Supabase (Recommended)

1. Create a free account at [Supabase](https://supabase.com)
2. Create a new project
3. Copy the connection string from Settings → Database
4. Update `DATABASE_URL` in `.env.local`

### Using Local PostgreSQL

1. Install PostgreSQL on your machine
2. Create a new database:
```bash
createdb kelp_board_bags
```

3. Update `DATABASE_URL` in `.env.local`:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/kelp_board_bags"
```

### Database Migrations

```bash
# Generate Prisma client after schema changes
npx prisma generate

# Push schema changes to database (development)
npx prisma db push

# Create a migration (production)
npx prisma migrate dev --name your_migration_name

# Apply migrations in production
npx prisma migrate deploy

# Open Prisma Studio to view/edit data
npx prisma studio
```

### Seeding the Database

The seed script creates sample data for testing:

```bash
npm run db:seed
```

This creates:
- ✅ 15 sample products across 6 categories
- ✅ Admin user account
- ✅ Sample customer account
- ✅ Product reviews
- ✅ Newsletter subscribers

For importing your own products, see [PRODUCT_IMPORT_GUIDE.md](./PRODUCT_IMPORT_GUIDE.md).

## 📁 Project Structure

```
kelp-board-bags/
├── app/                    # Next.js App Router
│   ├── (storefront)/      # Public-facing pages
│   ├── (admin)/           # Admin panel
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── storefront/        # Customer-facing components
│   ├── admin/             # Admin components
│   ├── ui/                # shadcn/ui components
│   └── shared/            # Shared utilities
├── lib/                   # Utility libraries
├── hooks/                 # Custom React hooks
├── store/                 # Zustand stores
├── types/                 # TypeScript types
├── config/                # Configuration files
└── prisma/                # Prisma schema
```

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Forms**: React Hook Form + Zod
- **State Management**: Zustand
- **Animations**: Framer Motion

### Backend
- **API**: Next.js API Routes
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js v5
- **Email**: Resend

### Payments
- **South Africa**: PayFast
- **International**: Stripe

## 🎨 Brand Guidelines

### Colors
- **Kelp Green**: `#2C5F3A` (Primary)
- **Ocean Teal**: `#4A8B8B` (Secondary)
- **Sand Beige**: `#D4C5B0` (Accent)
- **Driftwood**: `#8B7355` (Text accent)

### Typography
- **Headings**: Syne
- **Body**: Source Sans 3

## 📚 Key Features

- ✅ Multi-currency support (ZAR, USD, EUR, GBP)
- ✅ Dual payment gateway (PayFast + Stripe)
- ✅ Custom order builder
- ✅ Shopping cart with Zustand
- ✅ Product catalog
- ✅ User authentication
- ✅ Admin dashboard
- ✅ WhatsApp integration
- ✅ Loyalty program
- ✅ Referral system
- ✅ Newsletter signup
- ✅ Blog/Journal
- ✅ SEO optimized

## 💻 Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Database
npm run db:seed          # Seed database with sample data
npm run import-csv       # Import products from CSV

# Testing (when configured)
npm test                 # Run unit tests
npm run test:e2e         # Run E2E tests with Playwright
```

### Development Workflow

1. **Create a feature branch**
```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes**
   - Follow TypeScript strict mode
   - Use Tailwind CSS for styling
   - Follow component patterns in existing code

3. **Test your changes**
```bash
npm run lint
npm run build
```

4. **Commit your changes**
```bash
git add .
git commit -m "feat: Add your feature description"
```

5. **Push and create a pull request**
```bash
git push origin feature/your-feature-name
```

### Code Style Guidelines

- **TypeScript**: Strict mode enabled, no `any` types
- **Components**: PascalCase (e.g., `ProductCard.tsx`)
- **Utilities**: camelCase (e.g., `formatPrice.ts`)
- **Hooks**: camelCase with `use` prefix (e.g., `useCart.ts`)
- **CSS**: Tailwind utilities first, custom classes only when necessary

For detailed guidelines, see [CLAUDE.md](../CLAUDE.md).

## 🔌 API Documentation

### Authentication

All admin routes require authentication. Use NextAuth.js for session management.

```typescript
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const session = await getServerSession(authOptions);
```

### API Routes

#### Products

**GET** `/api/products`
- Get all products
- Query params: `category`, `featured`, `bestseller`, `limit`

```bash
curl http://localhost:3000/api/products?category=shortboard-bags&limit=10
```

**GET** `/api/products/[slug]`
- Get single product by slug

```bash
curl http://localhost:3000/api/products/classic-shortboard-bag
```

**POST** `/api/products` (Admin only)
- Create new product
- Body: Product data (JSON)

#### Orders

**POST** `/api/orders/create`
- Create new order
- Body: Order data with items

**GET** `/api/orders/[orderNumber]`
- Get order details

**POST** `/api/orders/[orderNumber]/send-confirmation`
- Send order confirmation email

#### Payments

**POST** `/api/payments/stripe/webhook`
- Stripe webhook handler

**POST** `/api/payments/payfast/webhook`
- PayFast webhook handler

#### Categories

**GET** `/api/categories`
- Get all categories

#### Reviews

**POST** `/api/reviews`
- Create product review
- Body: `{ productId, rating, comment }`

### Response Format

Success response:
```json
{
  "success": true,
  "data": { ... }
}
```

Error response:
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
```

## 🔐 Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` |
| `NEXTAUTH_URL` | Application URL | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | NextAuth secret (32+ chars) | Generate with `openssl rand -base64 32` |

### Payment Gateways

**Stripe (International)**
| Variable | Description |
|----------|-------------|
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret |

**PayFast (South Africa)**
| Variable | Description |
|----------|-------------|
| `PAYFAST_MERCHANT_ID` | PayFast merchant ID |
| `PAYFAST_MERCHANT_KEY` | PayFast merchant key |
| `PAYFAST_PASSPHRASE` | PayFast passphrase |
| `NEXT_PUBLIC_PAYFAST_MODE` | `test` or `live` |

### Email (Resend)

| Variable | Description |
|----------|-------------|
| `RESEND_API_KEY` | Resend API key |
| `EMAIL_FROM` | Sender email address |

### Optional Services

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `WHATSAPP_BUSINESS_NUMBER` | WhatsApp Business number |
| `WHATSAPP_API_KEY` | WhatsApp API key |
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID |

See `.env.example` for the complete list.

## 🚢 Deployment

### Deploying to Vercel (Recommended)

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Link your project**
```bash
vercel link
```

3. **Set environment variables**

Go to your Vercel project dashboard → Settings → Environment Variables and add all variables from `.env.local`.

4. **Deploy**
```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Build Configuration

The build command in `package.json` automatically generates Prisma client:

```json
{
  "scripts": {
    "build": "prisma generate && next build"
  }
}
```

### Database Migrations in Production

```bash
# Run migrations before deploying
npx prisma migrate deploy
```

### Environment-Specific Settings

- **Development**: Use test API keys, local database
- **Preview**: Use staging database, test payment gateways
- **Production**: Use production database, live payment gateways

### Post-Deployment Checklist

- [ ] Verify all environment variables are set
- [ ] Run database migrations
- [ ] Test payment gateways (both Stripe and PayFast)
- [ ] Verify email sending works
- [ ] Test admin authentication
- [ ] Check product images load correctly
- [ ] Test checkout flow end-to-end
- [ ] Verify webhook endpoints are accessible

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Errors

**Problem**: `Can't reach database server`

**Solution**:
```bash
# Check DATABASE_URL is correct
echo $DATABASE_URL

# Test connection
npx prisma db pull

# Regenerate Prisma client
npx prisma generate
```

#### Build Errors

**Problem**: `Module not found` or TypeScript errors

**Solution**:
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install

# Regenerate Prisma client
npx prisma generate

# Rebuild
npm run build
```

#### Payment Gateway Issues

**Problem**: Payments not processing

**Solution**:
- Verify API keys are correct (test vs. live)
- Check webhook URLs are configured in Stripe/PayFast dashboard
- Ensure webhook secrets match
- Check server logs for errors

#### Images Not Loading

**Problem**: Product images showing broken links

**Solution**:
- Verify image URLs are accessible
- Check Supabase storage permissions (if using)
- Ensure images are in `public/images/products/` folder
- Check Next.js Image component configuration

#### Session/Authentication Issues

**Problem**: Can't log in or session expires immediately

**Solution**:
```bash
# Verify NEXTAUTH_SECRET is set
echo $NEXTAUTH_SECRET

# Generate new secret if needed
openssl rand -base64 32

# Check NEXTAUTH_URL matches your domain
echo $NEXTAUTH_URL
```

### Getting Help

1. Check the [CLAUDE.md](../CLAUDE.md) development guide
2. Review [PRODUCT_IMPORT_GUIDE.md](./PRODUCT_IMPORT_GUIDE.md) for data import issues
3. Check the console for error messages
4. Review Vercel deployment logs
5. Open an issue on GitHub

## 🧪 Testing

### Manual Testing Checklist

**Storefront**
- [ ] Browse products by category
- [ ] Search functionality
- [ ] Add to cart
- [ ] Update cart quantities
- [ ] Remove from cart
- [ ] Checkout flow
- [ ] Payment processing (test mode)
- [ ] Order confirmation email
- [ ] User registration
- [ ] User login
- [ ] View order history

**Admin Panel**
- [ ] Admin login
- [ ] View products list
- [ ] Create new product
- [ ] Edit existing product
- [ ] Delete product
- [ ] View orders
- [ ] Update order status
- [ ] View customers

### Test Accounts

After seeding:
- **Admin**: `admin@kelpboardbags.co.za` / `admin123`
- **Customer**: `customer@example.com` / `password123`

### Test Payment Cards

**Stripe Test Cards**
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- 3D Secure: `4000 0027 6000 3184`

**PayFast Test Mode**
- Use sandbox credentials
- Any card details will work in test mode

## 📚 Additional Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)

### Payment Gateways
- [Stripe Documentation](https://stripe.com/docs)
- [PayFast Documentation](https://www.payfast.co.za/documentation/)

### Deployment
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Follow the code style** (see [CLAUDE.md](../CLAUDE.md))
4. **Write meaningful commit messages**
5. **Test your changes thoroughly**
6. **Submit a pull request**

### Commit Message Convention

```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Format code
refactor: Refactor code
test: Add tests
chore: Update dependencies
```

### Code Review Process

1. All PRs require review before merging
2. Ensure all checks pass (linting, build)
3. Update documentation if needed
4. Add tests for new features

## 📄 License

Copyright © 2026 Kelp Board Bags. All rights reserved.

This is proprietary software. Unauthorized copying, modification, distribution, or use of this software, via any medium, is strictly prohibited.

## 📧 Contact & Support

- **Email**: hello@kelpboardbags.co.za
- **Website**: https://www.kelpboardbags.co.za
- **GitHub**: https://github.com/Awehbelekker/Kelp-Boardbags-SA-

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org/) - React framework
- [Prisma](https://www.prisma.io/) - Database ORM
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Vercel](https://vercel.com/) - Hosting platform

---

**Made with 🌊 in Cape Town, South Africa**
