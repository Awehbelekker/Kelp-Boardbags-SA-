# Vercel Build Fix Guide

## 🚨 Critical Issues Found

### Issue 1: Root Directory Typo ❌
**Current:** `kelp-board-bag` (missing 's')
**Correct:** `kelp-board-bags` (with 's')

### Issue 2: Missing Environment Variables
The build is likely failing because required environment variables are not set.

---

## ✅ Step-by-Step Fix

### Step 1: Fix Root Directory & Build Settings

1. Go to **Vercel Dashboard**
2. Select your **Kelp Board Bags** project
3. Go to **Settings** → **General**
4. Scroll to **Build & Development Settings**

**Configure these settings:**

**Root Directory:**
- Change from: `kelp-board-bag`
- Change to: `kelp-board-bags` ⬅️ **Add the 's'**

**Framework Preset:**
- Select: `Next.js`

**Build Command:**
- Leave empty (uses package.json script)

**Output Directory:**
- Leave empty (uses .next default)

**Install Command:**
- Leave empty (uses npm install)

**Include source files outside of the Root Directory in the Build Step:**
- ✅ **Check this box** (IMPORTANT!)

5. Click **Save**

### Step 2: Add Required Environment Variables

Go to **Settings** → **Environment Variables** and add these **MINIMUM REQUIRED** variables:

#### Database (CRITICAL)
```
DATABASE_URL=postgresql://user:password@host:5432/database
```
**Get from:** Supabase or Vercel Postgres

#### Authentication (CRITICAL)
```
NEXTAUTH_URL=https://your-vercel-domain.vercel.app
NEXTAUTH_SECRET=your_generated_secret
```
**Generate secret:**
```bash
openssl rand -base64 32
```

#### Payments (CRITICAL)
```
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

#### Email (CRITICAL)
```
RESEND_API_KEY=re_...
EMAIL_FROM=info@kelpboardbags.co.za
```

#### Site (CRITICAL)
```
NEXT_PUBLIC_URL=https://your-vercel-domain.vercel.app
```

### Step 3: Optional but Recommended

```
# PayFast (for South African payments)
PAYFAST_MERCHANT_ID=your_merchant_id
PAYFAST_MERCHANT_KEY=your_merchant_key
PAYFAST_PASSPHRASE=your_passphrase
NEXT_PUBLIC_PAYFAST_MODE=live

# Supabase (if using for storage)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Step 4: Redeploy

1. Go to **Deployments** tab
2. Click **...** (three dots) on latest deployment
3. Click **Redeploy**
4. Select **Use existing Build Cache** (optional)
5. Click **Redeploy**

---

## 🔍 Common Build Errors & Solutions

### Error: "DATABASE_URL is not defined"
**Solution:** Add DATABASE_URL to environment variables

### Error: "NEXTAUTH_SECRET is not defined"
**Solution:** Generate and add NEXTAUTH_SECRET
```bash
openssl rand -base64 32
```

### Error: "Prisma Client not generated"
**Solution:** This should be handled by the build command, but ensure DATABASE_URL is set

### Error: "Module not found"
**Solution:** 
- Check that Root Directory is `kelp-board-bags` (with 's')
- Ensure all dependencies are in package.json

### Error: "Build exceeded maximum duration"
**Solution:**
- Upgrade Vercel plan if needed
- Optimize build (remove unused dependencies)

---

## 📋 Vercel Settings Checklist

### General Settings (Settings → General → Build & Development Settings)
- [ ] **Framework Preset:** Next.js ⬅️ **MUST SELECT**
- [ ] **Root Directory:** `kelp-board-bags` ⬅️ **CRITICAL - Add the 's'**
- [ ] **Build Command:** (leave empty)
- [ ] **Output Directory:** (leave empty)
- [ ] **Install Command:** (leave empty)
- [ ] **Include source files outside Root Directory:** ✅ **MUST CHECK THIS BOX**

### Environment Variables (Settings → Environment Variables)
**Minimum Required:**
- [ ] DATABASE_URL
- [ ] NEXTAUTH_URL
- [ ] NEXTAUTH_SECRET
- [ ] STRIPE_SECRET_KEY
- [ ] NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- [ ] RESEND_API_KEY
- [ ] EMAIL_FROM
- [ ] NEXT_PUBLIC_URL

**Apply to:**
- [x] Production
- [x] Preview
- [x] Development

### Deployment Settings (Settings → Git)
- [ ] **Production Branch:** main
- [ ] **Automatically deploy:** Yes

---

## 🎯 Quick Setup Services

### 1. Database (Supabase - Recommended)

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Go to **Settings** → **Database**
4. Copy **Connection String** (URI)
5. Add to Vercel as `DATABASE_URL`

**OR use Vercel Postgres:**
1. In Vercel Dashboard → **Storage**
2. Create **Postgres** database
3. Connect to your project
4. Environment variable added automatically

### 2. Authentication Secret

Run locally:
```bash
openssl rand -base64 32
```
Copy output and add to Vercel as `NEXTAUTH_SECRET`

### 3. Stripe

1. Go to [stripe.com](https://stripe.com)
2. Create account
3. Go to **Developers** → **API Keys**
4. Copy **Secret key** and **Publishable key**
5. Add to Vercel

**Webhook:**
1. Go to **Developers** → **Webhooks**
2. Add endpoint: `https://your-domain.vercel.app/api/payments/stripe/webhook`
3. Select events: `checkout.session.completed`, `payment_intent.succeeded`
4. Copy **Signing secret**
5. Add to Vercel as `STRIPE_WEBHOOK_SECRET`

### 4. Email (Resend)

1. Go to [resend.com](https://resend.com)
2. Create account
3. Go to **API Keys**
4. Create new key
5. Add to Vercel as `RESEND_API_KEY`

**Verify domain:**
1. Go to **Domains**
2. Add `kelpboardbags.co.za`
3. Add DNS records to your domain provider
4. Wait for verification

---

## 🧪 Test Deployment

After fixing and redeploying:

1. **Check deployment logs:**
   - Go to **Deployments**
   - Click on latest deployment
   - Check **Build Logs** for errors

2. **Test the site:**
   - Visit your Vercel URL
   - Check homepage loads
   - Check logo appears
   - Test navigation

3. **Test functionality:**
   - Try adding product to cart
   - Test checkout flow (test mode)
   - Check email sending (order confirmation)

---

## 📞 Still Having Issues?

### Check Build Logs
1. Go to **Deployments**
2. Click failed deployment
3. Read **Build Logs** carefully
4. Look for specific error messages

### Common Log Messages

**"Error: Cannot find module"**
- Root Directory is wrong
- Check it's `kelp-board-bags` not `kelp-board-bag`

**"Error: Environment variable not found"**
- Add missing environment variable
- Check spelling matches exactly

**"Prisma error"**
- DATABASE_URL not set or incorrect format
- Should be: `postgresql://user:pass@host:5432/db`

---

## 🎉 Success Checklist

After successful deployment:

- [ ] Site loads at Vercel URL
- [ ] Logo appears in header
- [ ] Navigation works
- [ ] Products page loads
- [ ] Can add to cart
- [ ] Checkout page loads
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Images load correctly

---

**Need Help?** Check the full environment variables guide in `ENVIRONMENT_VARIABLES.md`

