export interface NavItem {
  title: string
  href: string
  disabled?: boolean
  external?: boolean
  icon?: string
  label?: string
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[]
}

export interface MainNavItem extends NavItem {}

export interface SidebarNavItem extends NavItemWithChildren {}

// Main navigation for storefront
export const mainNav: MainNavItem[] = [
  {
    title: 'Shop',
    href: '/shop',
  },
  {
    title: 'Custom Orders',
    href: '/custom-order',
  },
  {
    title: 'Size Guide',
    href: '/size-guide',
  },
  {
    title: 'About',
    href: '/about',
  },
  {
    title: 'Contact',
    href: '/contact',
  },
]

// Shop categories navigation
export const shopNav: NavItemWithChildren[] = [
  {
    title: 'All Products',
    href: '/shop',
    items: [],
  },
  {
    title: 'Board Bags',
    href: '/shop/board-bags',
    items: [
      {
        title: 'Shortboard Bags',
        href: '/shop?category=shortboard-bags',
        items: [],
      },
      {
        title: 'Longboard Bags',
        href: '/shop?category=longboard-bags',
        items: [],
      },
      {
        title: 'Fish Bags',
        href: '/shop?category=fish-bags',
        items: [],
      },
      {
        title: 'SUP Bags',
        href: '/shop?category=sup-bags',
        items: [],
      },
    ],
  },
  {
    title: 'Specialty Bags',
    href: '/shop/specialty',
    items: [
      {
        title: 'XXL Board Bags',
        href: '/shop?category=xxl-board-bags',
        items: [],
      },
      {
        title: 'Foilboard Bags',
        href: '/shop?category=foilboard-bags',
        items: [],
      },
      {
        title: 'Kiteboard Bags',
        href: '/shop?category=kiteboard-bags',
        items: [],
      },
      {
        title: 'Waveski Bags',
        href: '/shop?category=waveski-bags',
        items: [],
      },
    ],
  },
  {
    title: 'Accessories',
    href: '/shop/accessories',
    items: [
      {
        title: 'Fin Cases',
        href: '/shop/accessories/fin-cases',
        items: [],
      },
      {
        title: 'Wax Pouches',
        href: '/shop/accessories/wax-pouches',
        items: [],
      },
      {
        title: 'Travel Accessories',
        href: '/shop/accessories/travel',
        items: [],
      },
    ],
  },
  {
    title: 'Collections',
    href: '/shop/collections',
    items: [
      {
        title: 'Bestsellers',
        href: '/shop/collections/bestsellers',
        items: [],
      },
      {
        title: 'New Arrivals',
        href: '/shop/collections/new',
        items: [],
      },
      {
        title: 'Sale',
        href: '/shop/collections/sale',
        items: [],
      },
    ],
  },
]

// Admin sidebar navigation
export const adminNav: SidebarNavItem[] = [
  {
    title: 'Dashboard',
    href: '/admin',
    items: [],
  },
  {
    title: 'Products',
    href: '/admin/products',
    items: [
      {
        title: 'All Products',
        href: '/admin/products',
        items: [],
      },
      {
        title: 'Add Product',
        href: '/admin/products/new',
        items: [],
      },
      {
        title: 'Categories',
        href: '/admin/products/categories',
        items: [],
      },
      {
        title: 'Inventory',
        href: '/admin/products/inventory',
        items: [],
      },
    ],
  },
  {
    title: 'Orders',
    href: '/admin/orders',
    items: [
      {
        title: 'All Orders',
        href: '/admin/orders',
        items: [],
      },
      {
        title: 'Pending',
        href: '/admin/orders?status=pending',
        items: [],
      },
      {
        title: 'Processing',
        href: '/admin/orders?status=processing',
        items: [],
      },
      {
        title: 'Shipped',
        href: '/admin/orders?status=shipped',
        items: [],
      },
    ],
  },
  {
    title: 'Customers',
    href: '/admin/customers',
    items: [
      {
        title: 'All Customers',
        href: '/admin/customers',
        items: [],
      },
      {
        title: 'Loyalty Program',
        href: '/admin/customers/loyalty',
        items: [],
      },
      {
        title: 'Reviews',
        href: '/admin/customers/reviews',
        items: [],
      },
    ],
  },
  {
    title: 'Content',
    href: '/admin/content',
    items: [
      {
        title: 'Pages',
        href: '/admin/content/pages',
        items: [],
      },
      {
        title: 'Blog Posts',
        href: '/admin/content/blog',
        items: [],
      },
      {
        title: 'Newsletter',
        href: '/admin/content/newsletter',
        items: [],
      },
    ],
  },
  {
    title: 'Marketing',
    href: '/admin/marketing',
    items: [
      {
        title: 'Coupons',
        href: '/admin/marketing/coupons',
        items: [],
      },
      {
        title: 'Referrals',
        href: '/admin/marketing/referrals',
        items: [],
      },
      {
        title: 'Email Campaigns',
        href: '/admin/marketing/emails',
        items: [],
      },
    ],
  },
  {
    title: 'Analytics',
    href: '/admin/analytics',
    items: [],
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    items: [
      {
        title: 'General',
        href: '/admin/settings/general',
        items: [],
      },
      {
        title: 'Payments',
        href: '/admin/settings/payments',
        items: [],
      },
      {
        title: 'Shipping',
        href: '/admin/settings/shipping',
        items: [],
      },
      {
        title: 'Theme',
        href: '/admin/settings/theme',
        items: [],
      },
    ],
  },
]

// Account navigation
export const accountNav: NavItem[] = [
  {
    title: 'Profile',
    href: '/account',
  },
  {
    title: 'Orders',
    href: '/account/orders',
  },
  {
    title: 'Addresses',
    href: '/account/addresses',
  },
  {
    title: 'Wishlist',
    href: '/account/wishlist',
  },
  {
    title: 'Loyalty Points',
    href: '/account/loyalty',
  },
  {
    title: 'Settings',
    href: '/account/settings',
  },
]

// Footer navigation
export const footerNav = {
  shop: [
    { title: 'All Products', href: '/shop' },
    { title: 'Longboard Bags', href: '/shop?category=longboard-bags' },
    { title: 'SUP Bags', href: '/shop?category=sup-bags' },
    { title: 'Specialty Bags', href: '/shop?category=xxl-board-bags' },
    { title: 'Custom Orders', href: '/custom-order' },
  ],
  company: [
    { title: 'About Us', href: '/about' },
    { title: 'Our Story', href: '/about/story' },
    { title: 'Sustainability', href: '/about/sustainability' },
    { title: 'Contact', href: '/contact' },
  ],
  support: [
    { title: 'Shipping & Returns', href: '/support/shipping' },
    { title: 'Size Guide', href: '/size-guide' },
    { title: 'Care Instructions', href: '/support/care' },
    { title: 'FAQ', href: '/support/faq' },
  ],
  legal: [
    { title: 'Privacy Policy', href: '/legal/privacy' },
    { title: 'Terms of Service', href: '/legal/terms' },
    { title: 'Refund Policy', href: '/legal/refunds' },
  ],
}
