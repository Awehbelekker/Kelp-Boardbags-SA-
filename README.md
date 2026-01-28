# Kelp Board Bags - E-Commerce Platform

> A premium, sustainable surfboard bag e-commerce platform built for Cape Town artisan manufacturers.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.20-2D3748)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC)](https://tailwindcss.com/)

## 🌊 Overview

Kelp Board Bags is a full-featured e-commerce platform designed for selling premium, handcrafted surfboard bags. Built with modern web technologies, it supports both local (South African) and international customers with multi-currency pricing and dual payment gateways.

### Brand Identity
- **Aesthetic**: Earthy, natural, sustainable
- **Target Market**: Surfers, board enthusiasts, eco-conscious consumers
- **Location**: Cape Town, South Africa

## 📁 Project Structure

The Next.js application is located in the `kelp-board-bags` directory.

```
kelp-board-bags/          # Main Next.js application
├── app/                  # Next.js App Router
├── components/           # React components
├── lib/                  # Utility libraries
├── prisma/              # Database schema
└── README.md            # Full documentation
CLAUDE.md                # Development guidelines
```

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/Awehbelekker/Kelp-Boardbags-SA-.git
cd Kelp-Boardbags-SA-

# Navigate to the application directory
cd kelp-board-bags

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Set up database
npx prisma generate
npx prisma db push
npm run db:seed

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📚 Full Documentation

For complete documentation, setup instructions, API reference, and troubleshooting, see:

**[📖 Full Documentation →](./kelp-board-bags/README.md)**

## 🛠 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Prisma, PostgreSQL
- **Authentication**: NextAuth.js v5
- **Payments**: Stripe (International) + PayFast (South Africa)
- **Email**: Resend
- **Hosting**: Vercel

## 📋 Key Features

- ✅ Multi-currency support (ZAR, USD, EUR, GBP)
- ✅ Dual payment gateway (PayFast + Stripe)
- ✅ Shopping cart with Zustand
- ✅ Product catalog with filtering
- ✅ User authentication
- ✅ Admin dashboard
- ✅ Order management
- ✅ Email notifications
- ✅ Invoice PDF generation
- ✅ Product reviews
- ✅ SEO optimized

## 🚢 Deployment

### Vercel Configuration

When deploying to Vercel, configure the following:

1. **Root Directory**: Set to `kelp-board-bags`
2. **Build Command**: `npm run build`
3. **Output Directory**: `.next`
4. **Install Command**: `npm install`

Or use the `vercel.json` configuration file included in the repository.

### Environment Variables

Make sure to set all required environment variables in your Vercel project settings. See [kelp-board-bags/.env.example](./kelp-board-bags/.env.example) for the complete list.

## 📝 Development Guidelines

Please refer to [CLAUDE.md](./CLAUDE.md) for detailed development guidelines, conventions, and AI assistant instructions.

## 📧 Contact

- **Email**: hello@kelpboardbags.co.za
- **Website**: https://www.kelpboardbags.co.za
- **GitHub**: https://github.com/Awehbelekker/Kelp-Boardbags-SA-

## 📄 License

Copyright © 2026 Kelp Board Bags. All rights reserved.

---

**Made with 🌊 in Cape Town, South Africa**

