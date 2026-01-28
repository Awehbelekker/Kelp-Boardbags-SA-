# Vercel Deployment Guide

## 🚨 Current Issue: 404 NOT_FOUND

The Vercel deployment is failing because the Next.js application is in the `kelp-board-bags` subdirectory, not the root.

## ✅ Solution: Configure Vercel for Subdirectory Deployment

### Option 1: Using Vercel Dashboard (Recommended)

1. **Go to your Vercel project dashboard**
   - Visit https://vercel.com/dashboard
   - Select your project

2. **Update Project Settings**
   - Go to **Settings** → **General**
   - Scroll to **Build & Development Settings**

3. **Configure the following:**

   | Setting | Value |
   |---------|-------|
   | **Framework Preset** | Next.js |
   | **Root Directory** | `kelp-board-bags` |
   | **Build Command** | `npm run build` |
   | **Output Directory** | Leave empty (default `.next`) |
   | **Install Command** | `npm install` |

4. **Save changes**

5. **Redeploy**
   - Go to **Deployments** tab
   - Click the three dots on the latest deployment
   - Click **Redeploy**

### Option 2: Using Vercel CLI

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Navigate to the project root
cd "h:\Kelp Store"

# Remove existing Vercel configuration (if any)
rm -rf .vercel

# Link project with correct settings
vercel link

# When prompted, answer:
# - Set up and deploy? Yes
# - Which scope? [Your account]
# - Link to existing project? Yes (if exists) or No (create new)
# - What's your project's name? kelp-board-bags
# - In which directory is your code located? ./kelp-board-bags

# Deploy
vercel --prod
```

### Option 3: Update vercel.json (Already Done)

The `vercel.json` file has been created in the root with the correct configuration:

```json
{
  "buildCommand": "cd kelp-board-bags && npx prisma generate && npm run build",
  "devCommand": "cd kelp-board-bags && npm run dev",
  "installCommand": "cd kelp-board-bags && npm install",
  "outputDirectory": "kelp-board-bags/.next",
  "framework": null
}
```

However, Vercel dashboard settings take precedence, so **Option 1 is recommended**.

## 🔧 Environment Variables

Make sure all environment variables are set in Vercel:

### Required Variables

Go to **Settings** → **Environment Variables** and add:

```env
# Database
DATABASE_URL=postgresql://...

# NextAuth
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=[generate with: openssl rand -base64 32]

# Stripe
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# PayFast
PAYFAST_MERCHANT_ID=...
PAYFAST_MERCHANT_KEY=...
PAYFAST_PASSPHRASE=...
NEXT_PUBLIC_PAYFAST_MODE=live

# Email
RESEND_API_KEY=re_...
EMAIL_FROM=orders@kelpboardbags.co.za

# Site
NEXT_PUBLIC_URL=https://your-domain.vercel.app
```

## 🗄️ Database Setup

### Using Supabase (Recommended)

1. Create a Supabase project at https://supabase.com
2. Get the connection string from **Settings** → **Database**
3. Add to Vercel environment variables as `DATABASE_URL`
4. Run migrations:

```bash
# From your local machine
cd kelp-board-bags
npx prisma migrate deploy
```

### Using Vercel Postgres

1. Go to your Vercel project → **Storage** → **Create Database**
2. Select **Postgres**
3. Vercel will automatically add `DATABASE_URL` to your environment variables
4. Run migrations as above

## 🔄 Post-Deployment Steps

After successful deployment:

1. **Run Database Migrations**
```bash
# Connect to your production database
cd kelp-board-bags
DATABASE_URL="your-production-url" npx prisma migrate deploy
```

2. **Seed Initial Data** (optional)
```bash
DATABASE_URL="your-production-url" npm run db:seed
```

3. **Test the Deployment**
   - Visit your Vercel URL
   - Test homepage loads
   - Test product pages
   - Test checkout flow (in test mode)
   - Test admin login

4. **Configure Webhooks**
   - **Stripe**: Add webhook URL `https://your-domain.vercel.app/api/payments/stripe/webhook`
   - **PayFast**: Add webhook URL `https://your-domain.vercel.app/api/payments/payfast/webhook`

## 🐛 Troubleshooting

### Still Getting 404?

1. **Check Root Directory Setting**
   - Vercel Dashboard → Settings → General → Root Directory
   - Must be set to `kelp-board-bags`

2. **Check Build Logs**
   - Go to Deployments → Click on failed deployment
   - Check logs for errors

3. **Verify File Structure**
   - Ensure `kelp-board-bags/package.json` exists
   - Ensure `kelp-board-bags/next.config.js` exists

### Build Failing?

1. **Check Prisma Generation**
   - Build command must include `npx prisma generate`
   - Or add to `package.json` build script

2. **Check Environment Variables**
   - All required variables must be set
   - `DATABASE_URL` is required for build

### Database Connection Errors?

1. **Whitelist Vercel IPs** (if using external database)
2. **Use connection pooling** for Prisma
3. **Check DATABASE_URL format**

## 📞 Need Help?

If you're still experiencing issues:

1. Check Vercel deployment logs
2. Verify all environment variables are set
3. Ensure database is accessible
4. Check that `kelp-board-bags` directory contains the Next.js app

## ✅ Success Checklist

- [ ] Root Directory set to `kelp-board-bags` in Vercel
- [ ] All environment variables configured
- [ ] Database connected and migrated
- [ ] Deployment successful (no 404)
- [ ] Homepage loads correctly
- [ ] Admin panel accessible
- [ ] Payment webhooks configured
- [ ] Test checkout flow works

---

**After fixing these settings, trigger a new deployment and the 404 error should be resolved!**

