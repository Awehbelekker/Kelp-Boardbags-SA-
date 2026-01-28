# Admin CMS & Page Builder Implementation Plan

**Date:** 2026-01-28  
**Status:** 📋 Planning Phase

---

## ✅ Completed Quick Fixes

### 1. **Logo Size Increased (Again)** ✅
- **Header**: 400x133 (h-28) - increased from 300x100
- **Footer**: 450x150 (h-32) - increased from 350x120
- Logo is now **very prominent** across the site

### 2. **Custom Order Page Hero** ✅
- Added hero section with background image
- Uses `/images/hero-bag.jpg` with overlay
- Responsive height (400px mobile, 500px desktop)
- Professional gradient overlay

### 3. **Product Images in Seed** ✅
- Updated seed script to add product images
- Uses hero image as placeholder for all products
- Ready to run: `npm run db:seed-real`

---

## 🔥 Advanced Features to Implement

### **Feature 1: Blog Post Management System** 🚀

**What Admin Can Do:**
- ✅ Create new blog posts with rich text editor
- ✅ Edit existing posts
- ✅ Delete posts
- ✅ Upload images directly into posts
- ✅ Set featured image
- ✅ Add categories and tags
- ✅ SEO settings (meta title, description, keywords)
- ✅ Publish/Draft/Schedule status
- ✅ Preview before publishing

**Technical Implementation:**
```typescript
// Database Schema Addition
model BlogPost {
  id            String   @id @default(cuid())
  title         String
  slug          String   @unique
  content       String   @db.Text // Rich HTML content
  excerpt       String?
  featuredImage String?
  
  authorId      String
  author        User     @relation(fields: [authorId], references: [id])
  
  categoryId    String?
  category      BlogCategory? @relation(fields: [categoryId], references: [id])
  
  tags          BlogTag[]
  
  status        PostStatus @default(DRAFT) // DRAFT, PUBLISHED, SCHEDULED
  publishedAt   DateTime?
  scheduledFor  DateTime?
  
  metaTitle     String?
  metaDescription String?
  metaKeywords  String?
  
  views         Int      @default(0)
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model BlogCategory {
  id          String     @id @default(cuid())
  name        String
  slug        String     @unique
  description String?
  posts       BlogPost[]
}

model BlogTag {
  id    String     @id @default(cuid())
  name  String     @unique
  slug  String     @unique
  posts BlogPost[]
}

enum PostStatus {
  DRAFT
  PUBLISHED
  SCHEDULED
}
```

**Admin Pages to Create:**
- `/admin/blog` - List all posts with filters
- `/admin/blog/new` - Create new post
- `/admin/blog/[id]/edit` - Edit existing post
- `/admin/blog/categories` - Manage categories
- `/admin/blog/tags` - Manage tags

**Rich Text Editor:**
- Use **Tiptap** or **Lexical** (modern, extensible)
- Features: Bold, Italic, Headings, Lists, Links, Images, Code blocks
- Image upload integration with Supabase Storage

---

### **Feature 2: Page Builder** 🎨

**What Admin Can Do:**
- ✅ Edit any page content (Homepage, About, Contact, etc.)
- ✅ Drag-and-drop components
- ✅ Add/remove sections
- ✅ Edit text inline
- ✅ Upload and replace images
- ✅ Change colors and styles
- ✅ Live preview
- ✅ Save as draft or publish
- ✅ Revert to previous versions

**Technical Implementation:**
```typescript
// Database Schema
model Page {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  
  // JSON structure of page components
  content     Json     // Array of components with props
  
  metaTitle   String?
  metaDescription String?
  
  status      PageStatus @default(DRAFT)
  publishedAt DateTime?
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  versions    PageVersion[]
}

model PageVersion {
  id        String   @id @default(cuid())
  pageId    String
  page      Page     @relation(fields: [pageId], references: [id])
  
  content   Json
  createdBy String
  createdAt DateTime @default(now())
}

enum PageStatus {
  DRAFT
  PUBLISHED
}
```

**Component Library:**
```typescript
// Available components for page builder
const components = [
  'Hero',
  'TextBlock',
  'ImageGallery',
  'ProductGrid',
  'CallToAction',
  'Testimonials',
  'Features',
  'ContactForm',
  'Newsletter',
  'Spacer',
]
```

**Page Builder Library:**
- Use **GrapesJS** or **Craft.js** (React-based)
- Or build custom with **dnd-kit** for drag-and-drop

**Admin Pages:**
- `/admin/pages` - List all pages
- `/admin/pages/[slug]/edit` - Visual page editor

---

### **Feature 3: Seasonal Templates & Themes** 🎄

**What Admin Can Do:**
- ✅ Create seasonal themes (Christmas, Easter, Black Friday, etc.)
- ✅ One-click theme activation
- ✅ Schedule theme activation/deactivation
- ✅ Customize colors, banners, promotions
- ✅ Preview theme before activation

**Technical Implementation:**
```typescript
// Database Schema
model Theme {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String?
  
  // Theme configuration
  config      Json     // Colors, fonts, banners, etc.
  
  // Scheduling
  activeFrom  DateTime?
  activeTo    DateTime?
  
  isActive    Boolean  @default(false)
  isDefault   Boolean  @default(false)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// Example config structure
{
  "colors": {
    "primary": "#2C5F3A",
    "secondary": "#4A8B8B",
    "accent": "#D4C5B0"
  },
  "banner": {
    "enabled": true,
    "text": "🎄 Christmas Sale - 20% Off All Bags!",
    "backgroundColor": "#C41E3A",
    "link": "/shop?sale=christmas"
  },
  "homepage": {
    "heroImage": "/images/christmas-hero.jpg",
    "heroTitle": "Holiday Gift Guide"
  }
}
```

**Pre-built Templates:**
- Default (current design)
- Christmas
- Easter
- Black Friday
- Summer Sale
- Winter Collection

**Admin Pages:**
- `/admin/themes` - Manage themes
- `/admin/themes/new` - Create new theme
- `/admin/themes/[id]/edit` - Edit theme

---

### **Feature 4: Payment Gateway Settings** 💳

**What Admin Can Do:**
- ✅ Add/edit API keys for Yoco, PayFast, Stripe
- ✅ Toggle payment methods on/off
- ✅ Test payment connections
- ✅ View transaction logs
- ✅ Set default payment method
- ✅ Configure payment method order

**Technical Implementation:**
```typescript
// Database Schema
model PaymentGateway {
  id          String   @id @default(cuid())
  name        String   // YOCO, PAYFAST, STRIPE
  displayName String   // "Yoco", "PayFast", "Stripe"
  
  enabled     Boolean  @default(false)
  isDefault   Boolean  @default(false)
  position    Int      @default(0) // Display order
  
  // Encrypted API credentials
  credentials Json     // Encrypted storage
  
  // Settings
  testMode    Boolean  @default(true)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

**Security:**
- API keys stored encrypted in database
- Never exposed to frontend
- Admin can only see masked keys (e.g., "sk_live_****1234")
- Test connection button to verify keys work

**Admin Pages:**
- `/admin/settings/payments` - Payment gateway management

---

## 📋 Implementation Priority

### **Phase 1: Blog CMS** (Highest Priority)
1. Create database schema
2. Build admin blog list page
3. Build blog post editor with rich text
4. Build category/tag management
5. Create public blog pages
6. Add SEO optimization

### **Phase 2: Payment Settings** (High Priority)
1. Create payment gateway schema
2. Build settings page
3. Implement encryption for API keys
4. Add test connection feature
5. Update checkout to use database settings

### **Phase 3: Page Builder** (Medium Priority)
1. Choose page builder library
2. Create page schema
3. Build visual editor
4. Implement component library
5. Add version control

### **Phase 4: Seasonal Themes** (Medium Priority)
1. Create theme schema
2. Build theme management UI
3. Create pre-built templates
4. Implement scheduling
5. Add preview functionality

---

## 🛠 Required Dependencies

```json
{
  "dependencies": {
    // Rich Text Editor
    "@tiptap/react": "^2.1.0",
    "@tiptap/starter-kit": "^2.1.0",
    "@tiptap/extension-image": "^2.1.0",
    
    // Page Builder (choose one)
    "@craftjs/core": "^0.2.0",
    // OR
    "grapesjs": "^0.20.0",
    "grapesjs-react": "^4.0.0",
    
    // Drag and Drop
    "@dnd-kit/core": "^6.0.0",
    "@dnd-kit/sortable": "^7.0.0",
    
    // Encryption
    "crypto-js": "^4.2.0"
  }
}
```

---

## 🚀 Next Steps

**To get products showing on shop page:**
1. Run the seed script: `npm run db:seed-real`
2. This will create 12 products with images
3. Products will immediately appear on `/shop`

**To start building admin CMS:**
1. Choose which feature to build first (recommend Blog CMS)
2. I'll implement the database schema
3. Build the admin pages
4. Add the rich text editor
5. Create public-facing blog pages

---

**Would you like me to start with the Blog CMS implementation?**

