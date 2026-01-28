export const siteConfig = {
  name: 'Kelp Board Bags',
  description:
    'Premium, handcrafted surfboard bags from Cape Town. Sustainable, custom-made board bags for surfers who care about quality and the environment.',
  url: process.env.NEXT_PUBLIC_URL || 'http://localhost:3000',
  ogImage: '/images/og-image.jpg',
  links: {
    instagram: 'https://instagram.com/kelpboardbags',
    facebook: 'https://facebook.com/kelpboardbags',
    whatsapp: 'https://wa.me/27XXXXXXXXX',
  },
  contact: {
    email: 'hello@kelpboardbags.co.za',
    phone: '+27 XX XXX XXXX',
    whatsapp: '+27XXXXXXXXX',
    address: 'Cape Town, South Africa',
  },
  business: {
    name: 'Kelp Board Bags',
    legalName: 'Kelp Board Bags (Pty) Ltd',
    vatNumber: 'XXXXXXXXXX',
    registrationNumber: 'XXXX/XXXXXX/XX',
  },
  currencies: [
    { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
  ],
  defaultCurrency: 'ZAR',
  // Shipping zones
  shippingZones: {
    local: ['ZA', 'South Africa'],
    international: [], // All other countries
  },
  // Free shipping threshold (in ZAR)
  freeShippingThreshold: 1000,
  // Tax rate (15% VAT for South Africa)
  taxRate: 0.15,
}

export type SiteConfig = typeof siteConfig
