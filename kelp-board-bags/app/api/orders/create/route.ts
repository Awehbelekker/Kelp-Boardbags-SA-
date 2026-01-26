import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateOrderNumber } from '@/lib/utils'
import { generatePayFastSignature, createPayFastPayment } from '@/lib/payfast'
import { createStripeCheckout } from '@/lib/stripe'
import { siteConfig } from '@/config/site'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      email,
      phone,
      shippingFirstName,
      shippingLastName,
      shippingAddress1,
      shippingAddress2,
      shippingCity,
      shippingProvince,
      shippingPostalCode,
      shippingCountry,
      shippingPhone,
      sameAsShipping,
      customerNotes,
      paymentMethod,
      items,
      cart,
    } = body

    // Generate order number
    const orderNumber = generateOrderNumber()

    // Create shipping address object
    const shippingAddress = {
      firstName: shippingFirstName,
      lastName: shippingLastName,
      address1: shippingAddress1,
      address2: shippingAddress2,
      city: shippingCity,
      province: shippingProvince,
      postalCode: shippingPostalCode,
      country: shippingCountry,
      phone: shippingPhone,
    }

    // Billing address (use shipping if same)
    const billingAddress = sameAsShipping ? shippingAddress : body.billingAddress

    // Create order in database
    const order = await prisma.order.create({
      data: {
        orderNumber,
        email,
        phone,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        paymentMethod,
        subtotal: cart.subtotal,
        discount: cart.discount,
        shippingCost: cart.shipping,
        tax: cart.tax,
        total: cart.total,
        currency: 'ZAR',
        shippingAddress,
        billingAddress,
        customerNotes,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            total: item.price * item.quantity,
            productName: item.name || 'Product',
            productSlug: item.slug || '',
            productImage: item.image,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
          },
        },
      },
    })

    // Generate payment URL based on method
    let paymentUrl = ''
    let whatsappUrl = ''

    if (paymentMethod === 'PAYFAST') {
      // Create PayFast payment
      const payfastData = {
        merchant_id: process.env.PAYFAST_MERCHANT_ID!,
        merchant_key: process.env.PAYFAST_MERCHANT_KEY!,
        return_url: `${siteConfig.url}/checkout/success?order=${orderNumber}`,
        cancel_url: `${siteConfig.url}/checkout/cancelled?order=${orderNumber}`,
        notify_url: `${siteConfig.url}/api/payments/payfast/webhook`,
        name_first: shippingFirstName,
        name_last: shippingLastName,
        email_address: email,
        m_payment_id: order.id,
        amount: cart.total.toFixed(2),
        item_name: `Order ${orderNumber}`,
        item_description: `${items.length} item(s) from Kelp Board Bags`,
      }

      const signature = generatePayFastSignature(payfastData)
      const payfastUrl =
        process.env.NEXT_PUBLIC_PAYFAST_MODE === 'live'
          ? 'https://www.payfast.co.za/eng/process'
          : 'https://sandbox.payfast.co.za/eng/process'

      // Create form data URL
      const params = new URLSearchParams({ ...payfastData, signature })
      paymentUrl = `${payfastUrl}?${params.toString()}`
    } else if (paymentMethod === 'STRIPE') {
      // Create Stripe checkout session
      const session = await createStripeCheckout({
        orderId: order.id,
        orderNumber,
        email,
        items: items.map((item: any) => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        total: cart.total,
        successUrl: `${siteConfig.url}/checkout/success?order=${orderNumber}&session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${siteConfig.url}/checkout/cancelled?order=${orderNumber}`,
      })

      paymentUrl = session.url || ''
    } else if (paymentMethod === 'WHATSAPP') {
      // Generate WhatsApp message
      const message = `
🛍️ *New Order from Kelp Board Bags*

*Order Number:* ${orderNumber}

*Customer Details:*
Name: ${shippingFirstName} ${shippingLastName}
Email: ${email}
Phone: ${phone}

*Shipping Address:*
${shippingAddress1}${shippingAddress2 ? ', ' + shippingAddress2 : ''}
${shippingCity}, ${shippingProvince} ${shippingPostalCode}
${shippingCountry}

*Order Items:*
${items.map((item: any) => `- ${item.name} x${item.quantity} - R${(item.price * item.quantity).toFixed(2)}`).join('\n')}

*Order Summary:*
Subtotal: R${cart.subtotal.toFixed(2)}
Shipping: R${cart.shipping.toFixed(2)}
VAT (15%): R${cart.tax.toFixed(2)}
*Total: R${cart.total.toFixed(2)}*

${customerNotes ? `\n*Notes:* ${customerNotes}` : ''}

Please confirm this order and provide payment details.
      `.trim()

      const whatsappNumber = siteConfig.contact.whatsapp.replace(/\D/g, '')
      whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    }

    // TODO: Send order confirmation email with invoice

    return NextResponse.json({
      success: true,
      data: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        paymentUrl,
        whatsappUrl,
      },
    })
  } catch (error) {
    console.error('Failed to create order:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Failed to create order',
          code: 'ORDER_CREATE_ERROR',
        },
      },
      { status: 500 }
    )
  }
}
