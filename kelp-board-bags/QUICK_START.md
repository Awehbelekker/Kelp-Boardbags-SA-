# Quick Start Guide - Kelp Board Bags

## 🚀 Getting Products to Show on Shop Page

### **Problem:** Shop page is empty, no products showing

### **Solution:** Run the database seed script

### **Steps:**

#### **Option 1: Using npm (Recommended)**
```bash
cd kelp-board-bags
npm run db:seed-real
```

#### **Option 2: Using npx**
```bash
cd kelp-board-bags
npx tsx prisma/seed-real-products.ts
```

#### **Option 3: Direct Node execution**
```bash
cd kelp-board-bags
node --loader tsx prisma/seed-real-products.ts
```

### **What This Does:**
- ✅ Creates admin user (email: `admin@kelpboardbags.co.za`, password: `admin123`)
- ✅ Creates 4 product categories (Surf, SUP/Foil/Waveski, Dive, Extras)
- ✅ Creates 12 real products from your current website
- ✅ Adds product images (using hero image as placeholder)
- ✅ Sets prices, inventory, descriptions
- ✅ Marks featured and bestseller products

### **After Running:**
1. Go to `/shop` - You'll see all 12 products
2. Products are organized by category
3. Each product has an image, price, and description
4. You can click on any product to see details

---

## 🔐 Admin Login

### **Credentials:**
- **Email:** `admin@kelpboardbags.co.za`
- **Password:** `admin123`

### **Admin Access:**
- **Login Page:** `/auth/signin`
- **Admin Dashboard:** `/admin`
- **Product Management:** `/admin/products`
- **Order Management:** `/admin/orders`

### **What Admin Can Currently Do:**
- ✅ View all products
- ✅ Add new products
- ✅ Edit existing products
- ✅ Delete products
- ✅ View all orders
- ✅ Update order status
- ✅ View customer details

---

## 📝 Blog Posts

### **Current Status:** No blog posts yet

### **To Add Blog Posts:**
The blog CMS is planned but not yet implemented. See `ADMIN_CMS_PLAN.md` for the full implementation plan.

### **Temporary Solution:**
You can manually create blog posts by:
1. Creating a `BlogPost` model in Prisma schema
2. Running migrations
3. Adding posts via Prisma Studio or seed script

---

## 🎨 Recent Updates (2026-01-28)

### **1. Logo Size Increased (Again)**
- Header logo: Now **h-28** (400x133px)
- Footer logo: Now **h-32** (450x150px)
- Much more prominent and visible

### **2. Custom Order Page Enhanced**
- ✅ Added hero section with background image
- ✅ Responsive design (400px mobile, 500px desktop)
- ✅ Professional gradient overlay
- ✅ Smart WhatsApp integration with pre-filled messages

### **3. Yoco Payment Integration**
- ✅ Yoco added as recommended payment option
- ✅ Positioned first in checkout
- ✅ Highlighted with green border and "Recommended" badge
- ✅ Supports Card, Instant EFT, SnapScan

### **4. WhatsApp Custom Orders**
- ✅ Dynamic button behavior
- ✅ Pre-filled messages with all specifications
- ✅ Includes board details, customization, contact info, estimated price

---

## 🔧 Environment Variables Needed

### **For Production:**

```bash
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="[generate with: openssl rand -base64 32]"

# Yoco Payment (NEW)
YOCO_SECRET_KEY="sk_live_..." # Get from https://portal.yoco.com/

# PayFast
PAYFAST_MERCHANT_ID="..."
PAYFAST_MERCHANT_KEY="..."
PAYFAST_PASSPHRASE="..."

# Stripe
STRIPE_SECRET_KEY="sk_live_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."

# Email (Resend)
RESEND_API_KEY="re_..."
EMAIL_FROM="orders@kelpboardbags.co.za"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..."
```

---

## 📋 Next Steps

### **Immediate (To Get Site Fully Functional):**
1. ✅ Run seed script to populate products
2. ✅ Add `YOCO_SECRET_KEY` to environment variables
3. ✅ Test checkout flow
4. ✅ Verify admin login works

### **Short Term (Advanced Features):**
1. **Blog CMS** - Full blog post management system
2. **Page Builder** - Visual editor for any page
3. **Seasonal Themes** - Holiday templates and themes
4. **Payment Settings** - Admin can configure API keys

### **Medium Term (Enhancements):**
1. **Product Image Upload** - Supabase Storage integration
2. **Email Notifications** - Automated order confirmations
3. **Analytics Dashboard** - Sales reports and metrics
4. **Customer Management** - View and manage customers

---

## 🆘 Troubleshooting

### **Products Not Showing:**
- Run the seed script: `npm run db:seed-real`
- Check database connection in `.env.local`
- Verify `DATABASE_URL` is correct

### **Admin Login Not Working:**
- Ensure seed script has run (creates admin user)
- Check credentials: `admin@kelpboardbags.co.za` / `admin123`
- Verify `NEXTAUTH_SECRET` is set

### **Payment Not Working:**
- Add `YOCO_SECRET_KEY` to environment variables
- For testing, use `sk_test_...` keys
- Test card: `4242 4242 4242 4242`

### **Images Not Loading:**
- Check `/public/images/hero-bag.jpg` exists
- Verify image paths in seed script
- Run `npm run build` to regenerate

---

## 📞 Support

For implementation questions or issues, refer to:
- `ADMIN_CMS_PLAN.md` - Advanced features roadmap
- `ENHANCEMENTS_IMPLEMENTED.md` - Recent changes
- `CLAUDE.md` - Development guidelines

---

**Ready to build your e-commerce empire! 🌊🏄‍♂️**

