export const siteConfig = {
  name: 'Kelp Board Bags',
  description:
    'Custom-built surfboard bags created in Cape Town, South Africa. Specializing in Logs, XXL boards, SUPs, Foilboards, Kiteboards, and Waveskies. Premium quality, handcrafted protection for your boards.',
  url: process.env.NEXT_PUBLIC_URL || 'http://localhost:3000',
  ogImage: '/images/og-image.jpg',
  links: {
    instagram: 'https://www.instagram.com/kelp_boardbags_ct_sa',
    facebook: 'https://facebook.com/kelpboardbags',
    whatsapp: 'https://wa.me/27719363070',
  },
  contact: {
    email: 'info@kelpboardbags.co.za',
    phone: '+27 71 936 3070',
    whatsapp: '+27719363070',
    address: 'Unit 2, 39 Gray Rd, Paarden Island, Cape Town, South Africa',
  },
  business: {
    name: 'Kelp Board Bags',
    legalName: 'Kelp Board Bags',
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
