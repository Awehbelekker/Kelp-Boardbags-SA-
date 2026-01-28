# Complete Environment Variables for Kelp Board Bags

## 📋 Copy-Paste Ready Format

Copy this entire block and paste into your Vercel Environment Variables section:

```env
# ============================================
# DATABASE
# ============================================
DATABASE_URL=postgresql://user:password@host:5432/kelp_board_bags

# ============================================
# NEXTAUTH AUTHENTICATION
# ============================================
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=generate_this_with_openssl_rand_base64_32

# ============================================
# STRIPE (INTERNATIONAL PAYMENTS)
# ============================================
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret

# ============================================
# PAYFAST (SOUTH AFRICAN PAYMENTS)
# ============================================
PAYFAST_MERCHANT_ID=your_payfast_merchant_id
PAYFAST_MERCHANT_KEY=your_payfast_merchant_key
PAYFAST_PASSPHRASE=your_payfast_passphrase
NEXT_PUBLIC_PAYFAST_MODE=live

# ============================================
# EMAIL (RESEND)
# ============================================
RESEND_API_KEY=re_your_resend_api_key
EMAIL_FROM=orders@kelpboardbags.co.za

# ============================================
# SUPABASE (OPTIONAL - FOR FILE STORAGE)
# ============================================
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# ============================================
# WHATSAPP BUSINESS API (OPTIONAL)
# ============================================
WHATSAPP_BUSINESS_NUMBER=+27XXXXXXXXX
WHATSAPP_API_KEY=your_whatsapp_api_key

# ============================================
# ANALYTICS (OPTIONAL)
# ============================================
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# ============================================
# SITE CONFIGURATION
# ============================================
NEXT_PUBLIC_URL=https://your-domain.vercel.app
ADMIN_EMAIL=admin@kelpboardbags.co.za
```

## 🔑 How to Get Each Variable

### 1. DATABASE_URL

**Option A: Supabase (Recommended - Free tier available)**
1. Go to https://supabase.com
2. Create account and new project
3. Go to Settings → Database
4. Copy "Connection string" under "Connection pooling"
5. Replace `[YOUR-PASSWORD]` with your database password

Example:
```
DATABASE_URL=postgresql://postgres.xxxxx:password@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

**Option B: Vercel Postgres**
1. In Vercel dashboard → Storage → Create Database
2. Select Postgres
3. Vercel auto-adds DATABASE_URL

**Option C: Railway**
1. Go to https://railway.app
2. Create new project → Add PostgreSQL
3. Copy connection string from Variables tab

### 2. NEXTAUTH_URL

Your production domain:
```
NEXTAUTH_URL=https://kelp-board-bags.vercel.app
```

Or custom domain:
```
NEXTAUTH_URL=https://www.kelpboardbags.co.za
```

### 3. NEXTAUTH_SECRET

Generate a secure random string:

**On Mac/Linux:**
```bash
openssl rand -base64 32
```

**On Windows PowerShell:**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

**Online Generator:**
https://generate-secret.vercel.app/32

Example output:
```
NEXTAUTH_SECRET=Xk7mP9qR2sT5vW8yZ1aC4dF6gH9jK0lN3oQ5rU7wX9zA
```

### 4. STRIPE (International Payments)

1. Go to https://stripe.com
2. Create account
3. Go to Developers → API keys
4. Copy:
   - **Secret key** → `STRIPE_SECRET_KEY`
   - **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

5. For webhook secret:
   - Go to Developers → Webhooks
   - Click "Add endpoint"
   - URL: `https://your-domain.vercel.app/api/payments/stripe/webhook`
   - Events: Select `checkout.session.completed`, `payment_intent.succeeded`
   - Copy "Signing secret" → `STRIPE_WEBHOOK_SECRET`

**Test Mode:**
```
STRIPE_SECRET_KEY=sk_test_51...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Live Mode:**
```
STRIPE_SECRET_KEY=sk_live_51...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 5. PAYFAST (South African Payments)

1. Go to https://www.payfast.co.za
2. Create merchant account
3. Go to Settings → Integration
4. Copy:
   - **Merchant ID** → `PAYFAST_MERCHANT_ID`
   - **Merchant Key** → `PAYFAST_MERCHANT_KEY`
   - **Passphrase** → `PAYFAST_PASSPHRASE` (create one if not set)

5. Add ITN (webhook) URL:
   - URL: `https://your-domain.vercel.app/api/payments/payfast/webhook`

**Test Mode:**
```
PAYFAST_MERCHANT_ID=10000100
PAYFAST_MERCHANT_KEY=46f0cd694581a
PAYFAST_PASSPHRASE=your_test_passphrase
NEXT_PUBLIC_PAYFAST_MODE=test
```

**Live Mode:**
```
PAYFAST_MERCHANT_ID=your_live_merchant_id
PAYFAST_MERCHANT_KEY=your_live_merchant_key
PAYFAST_PASSPHRASE=your_live_passphrase
NEXT_PUBLIC_PAYFAST_MODE=live
```

### 6. RESEND (Email Service)

1. Go to https://resend.com
2. Create account (free tier: 100 emails/day)
3. Go to API Keys
4. Create new API key
5. Copy key → `RESEND_API_KEY`

6. Verify your domain:
   - Go to Domains
   - Add `kelpboardbags.co.za`
   - Add DNS records to your domain provider

```
RESEND_API_KEY=re_123456789_abcdefghijklmnop
EMAIL_FROM=orders@kelpboardbags.co.za
```

**For testing (before domain verification):**
```
EMAIL_FROM=onboarding@resend.dev
```

### 7. SUPABASE (Optional - For Image Storage)

1. Go to https://supabase.com
2. Use same project as database OR create new one
3. Go to Settings → API
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

```
NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 8. WHATSAPP (Optional)

**Option A: WhatsApp Business API**
1. Go to https://business.whatsapp.com
2. Set up Business API account
3. Get API credentials from provider (e.g., Twilio, MessageBird)

**Option B: Simple WhatsApp Link (No API needed)**
Just use your WhatsApp Business number:
```
WHATSAPP_BUSINESS_NUMBER=+27123456789
```

### 9. GOOGLE ANALYTICS (Optional)

1. Go to https://analytics.google.com
2. Create account and property
3. Get Measurement ID (starts with G-)
4. Copy → `NEXT_PUBLIC_GA_ID`

```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 10. SITE CONFIGURATION

```
NEXT_PUBLIC_URL=https://your-actual-domain.vercel.app
ADMIN_EMAIL=admin@kelpboardbags.co.za
```

## 🚀 Quick Setup for Development

For local development, create `.env.local` in `kelp-board-bags/` directory:

```env
# Minimal setup for local development
DATABASE_URL="postgresql://postgres:password@localhost:5432/kelp_board_bags"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="local-dev-secret-change-in-production"
NEXT_PUBLIC_URL="http://localhost:3000"

# Use test mode for payments
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
PAYFAST_MERCHANT_ID="10000100"
PAYFAST_MERCHANT_KEY="46f0cd694581a"
NEXT_PUBLIC_PAYFAST_MODE="test"

# Email (use Resend test)
RESEND_API_KEY="re_..."
EMAIL_FROM="onboarding@resend.dev"
```

## 📝 Setting Variables in Vercel

### Method 1: Vercel Dashboard (Recommended)

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. For each variable:
   - Click **Add New**
   - Enter **Key** (e.g., `DATABASE_URL`)
   - Enter **Value**
   - Select environments: **Production**, **Preview**, **Development**
   - Click **Save**

### Method 2: Vercel CLI

```bash
# Set a single variable
vercel env add DATABASE_URL production

# Import from .env file
vercel env pull .env.local
```

### Method 3: Bulk Import

1. Create a file `vercel-env.txt` with format:
```
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://...
NEXTAUTH_SECRET=...
```

2. In Vercel dashboard, you can paste multiple at once

## ✅ Verification Checklist

After setting all variables:

- [ ] DATABASE_URL - Test connection with `npx prisma db pull`
- [ ] NEXTAUTH_SECRET - Generated with secure random string
- [ ] NEXTAUTH_URL - Matches your actual domain
- [ ] STRIPE keys - Test mode for staging, live for production
- [ ] PAYFAST credentials - Verified in PayFast dashboard
- [ ] RESEND_API_KEY - Domain verified (or using test email)
- [ ] All NEXT_PUBLIC_* variables - Accessible in browser
- [ ] Webhook URLs configured in Stripe and PayFast dashboards

## 🔒 Security Best Practices

1. **Never commit `.env.local` to Git** (already in `.gitignore`)
2. **Use different values for development/production**
3. **Rotate secrets regularly** (especially NEXTAUTH_SECRET)
4. **Use test mode for payments** until ready to go live
5. **Keep service role keys secret** (never expose in client code)

## 🆘 Troubleshooting

### "Invalid DATABASE_URL"
- Check format: `postgresql://user:password@host:port/database`
- Ensure no spaces or special characters in password
- Try connection pooling URL from Supabase

### "NEXTAUTH_SECRET is not set"
- Must be at least 32 characters
- Generate new one with `openssl rand -base64 32`

### "Stripe webhook signature verification failed"
- Ensure STRIPE_WEBHOOK_SECRET matches webhook in Stripe dashboard
- Check webhook URL is correct
- Verify webhook is enabled

### "PayFast payment not processing"
- Check PAYFAST_MERCHANT_ID and KEY are correct
- Verify ITN URL is set in PayFast dashboard
- Ensure NEXT_PUBLIC_PAYFAST_MODE matches your intent (test/live)

---

**Need help?** Check the [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) guide for more details.

