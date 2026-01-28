# Kelp Board Bags - E-Commerce Platform

A premium, sustainable surfboard bag e-commerce platform built with Next.js 14, TypeScript, Prisma, and Tailwind CSS.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone [repository-url]
cd kelp-board-bags
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

Edit `.env.local` with your database credentials and API keys.

4. Set up the database
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

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

## 🔐 Environment Variables

See `.env.example` for required environment variables:

- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_URL` - Application URL
- `NEXTAUTH_SECRET` - NextAuth secret key
- `STRIPE_SECRET_KEY` - Stripe API key
- `PAYFAST_MERCHANT_ID` - PayFast merchant ID
- `RESEND_API_KEY` - Resend email API key
- And more...

## 📝 Development Guidelines

Please refer to [CLAUDE.md](./CLAUDE.md) for detailed development guidelines, conventions, and AI assistant instructions.

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run E2E tests
npm run test:e2e

# Run linting
npm run lint
```

## 🚢 Deployment

This application is designed to be deployed on Vercel:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## 📄 License

Copyright © 2026 Kelp Board Bags. All rights reserved.

## 🤝 Contributing

Please read [CLAUDE.md](./CLAUDE.md) for development guidelines before contributing.

## 📧 Contact

- Email: hello@kelpboardbags.co.za
- Website: [Coming Soon]
