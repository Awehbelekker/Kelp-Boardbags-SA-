import crypto from 'crypto'

export interface PayFastPaymentData {
  merchant_id: string
  merchant_key: string
  return_url: string
  cancel_url: string
  notify_url: string
  name_first: string
  name_last: string
  email_address: string
  m_payment_id: string
  amount: string
  item_name: string
  item_description?: string
}

/**
 * Generate PayFast signature for payment verification
 * https://developers.payfast.co.za/docs#signature_generation
 */
export function generatePayFastSignature(data: Record<string, string>): string {
  // Create parameter string
  const paramString = Object.keys(data)
    .filter(key => key !== 'signature') // Exclude signature if present
    .sort()
    .map(key => `${key}=${encodeURIComponent(data[key].trim()).replace(/%20/g, '+')}`)
    .join('&')

  // Add passphrase if in production
  const passphrase = process.env.PAYFAST_PASSPHRASE
  const stringToHash = passphrase ? `${paramString}&passphrase=${passphrase}` : paramString

  // Generate MD5 hash
  return crypto.createHash('md5').update(stringToHash).digest('hex')
}

/**
 * Verify PayFast webhook signature
 */
export function verifyPayFastSignature(
  data: Record<string, string>,
  receivedSignature: string
): boolean {
  const calculatedSignature = generatePayFastSignature(data)
  return calculatedSignature === receivedSignature
}

/**
 * Verify PayFast webhook host
 */
export async function verifyPayFastHost(host: string): Promise<boolean> {
  const validHosts = [
    'www.payfast.co.za',
    'sandbox.payfast.co.za',
    'w1w.payfast.co.za',
    'w2w.payfast.co.za',
  ]

  return validHosts.includes(host)
}

/**
 * Create PayFast payment form data
 */
export function createPayFastPayment(data: PayFastPaymentData): {
  url: string
  formData: Record<string, string>
} {
  // Convert PayFastPaymentData to Record<string, string> by filtering out undefined values
  const dataRecord: Record<string, string> = Object.entries(data).reduce((acc, [key, value]) => {
    if (value !== undefined) {
      acc[key] = value
    }
    return acc
  }, {} as Record<string, string>)

  const signature = generatePayFastSignature(dataRecord)

  const payfastUrl =
    process.env.NEXT_PUBLIC_PAYFAST_MODE === 'live'
      ? 'https://www.payfast.co.za/eng/process'
      : 'https://sandbox.payfast.co.za/eng/process'

  return {
    url: payfastUrl,
    formData: {
      ...dataRecord,
      signature,
    },
  }
}

/**
 * PayFast payment status codes
 */
export const PayFastStatus = {
  COMPLETE: 'COMPLETE',
  FAILED: 'FAILED',
  PENDING: 'PENDING',
  CANCELLED: 'CANCELLED',
} as const

/**
 * Parse PayFast webhook data
 */
export interface PayFastWebhookData {
  m_payment_id: string // Our order ID
  pf_payment_id: string // PayFast payment ID
  payment_status: string
  item_name: string
  item_description?: string
  amount_gross: string
  amount_fee: string
  amount_net: string
  custom_str1?: string
  custom_str2?: string
  custom_str3?: string
  custom_str4?: string
  custom_str5?: string
  custom_int1?: string
  custom_int2?: string
  custom_int3?: string
  custom_int4?: string
  custom_int5?: string
  name_first?: string
  name_last?: string
  email_address?: string
  merchant_id: string
  signature: string
}

/**
 * Process PayFast webhook notification
 */
export async function processPayFastWebhook(
  data: PayFastWebhookData
): Promise<{
  success: boolean
  orderId: string
  status: string
  transactionId: string
}> {
  // Verify signature
  const { signature, ...dataWithoutSignature } = data
  const isValid = verifyPayFastSignature(dataWithoutSignature as any, signature)

  if (!isValid) {
    throw new Error('Invalid PayFast signature')
  }

  return {
    success: data.payment_status === PayFastStatus.COMPLETE,
    orderId: data.m_payment_id,
    status: data.payment_status,
    transactionId: data.pf_payment_id,
  }
}

/**
 * PayFast test card details for sandbox mode
 */
export const PayFastTestCards = {
  success: {
    number: '4000000000000002',
    cvv: '123',
    expiry: '12/25',
  },
  declined: {
    number: '4000000000000010',
    cvv: '123',
    expiry: '12/25',
  },
}
