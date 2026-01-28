import { Resend } from 'resend'
import { OrderWithRelations } from '@/types'
import { generateInvoicePDF, getInvoiceFilename } from './generate-invoice'
import { formatPrice, formatDate } from './utils'
import { siteConfig } from '@/config/site'

if (!process.env.RESEND_API_KEY) {
  console.warn('RESEND_API_KEY is not defined - email sending will fail')
}

const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * Send order confirmation email with invoice PDF attachment
 */
export async function sendOrderConfirmationEmail(
  order: OrderWithRelations
): Promise<{ success: boolean; error?: string }> {
  try {
    // Generate invoice PDF
    const invoicePDF = await generateInvoicePDF(order)

    // Get customer name
    const shippingAddress = order.shippingAddress as any
    const customerName = `${shippingAddress.firstName} ${shippingAddress.lastName}`

    // Send email
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'orders@kelpboardbags.co.za',
      to: [order.email],
      subject: `Order Confirmation - ${order.orderNumber}`,
      html: getOrderConfirmationEmailHTML(order, customerName),
      attachments: [
        {
          filename: getInvoiceFilename(order.orderNumber),
          content: invoicePDF,
        },
      ],
    })

    if (error) {
      console.error('Failed to send order confirmation email:', error)
      return { success: false, error: error.message }
    }

    console.log('Order confirmation email sent:', data?.id)
    return { success: true }
  } catch (error) {
    console.error('Error sending order confirmation email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Generate order confirmation email HTML
 */
function getOrderConfirmationEmailHTML(
  order: OrderWithRelations,
  customerName: string
): string {
  const shippingAddress = order.shippingAddress as any

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
          }
          .header {
            background-color: #2C5F3A;
            color: #ffffff;
            padding: 40px 20px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
          }
          .content {
            padding: 40px 20px;
          }
          .success-icon {
            text-align: center;
            font-size: 48px;
            margin-bottom: 20px;
          }
          h2 {
            color: #2C5F3A;
            font-size: 24px;
            margin-top: 0;
          }
          .order-number {
            background-color: #D4C5B0;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            margin: 20px 0;
          }
          .order-number strong {
            font-size: 18px;
            color: #2C5F3A;
          }
          .section {
            margin: 30px 0;
          }
          .section-title {
            font-size: 18px;
            font-weight: 600;
            color: #2C5F3A;
            margin-bottom: 15px;
            border-bottom: 2px solid #D4C5B0;
            padding-bottom: 10px;
          }
          .item {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #f0f0f0;
          }
          .item:last-child {
            border-bottom: none;
          }
          .item-details {
            flex: 1;
          }
          .item-name {
            font-weight: 600;
            margin-bottom: 5px;
          }
          .item-quantity {
            font-size: 14px;
            color: #666;
          }
          .item-price {
            font-weight: 600;
            color: #2C5F3A;
          }
          .totals {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 2px solid #2C5F3A;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
          }
          .total-row.grand-total {
            font-size: 20px;
            font-weight: 600;
            color: #2C5F3A;
            margin-top: 10px;
            padding-top: 10px;
            border-top: 2px solid #2C5F3A;
          }
          .address-box {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 8px;
            margin: 10px 0;
          }
          .button {
            display: inline-block;
            background-color: #2C5F3A;
            color: #ffffff !important;
            text-decoration: none;
            padding: 15px 30px;
            border-radius: 8px;
            font-weight: 600;
            margin: 20px 0;
            text-align: center;
          }
          .steps {
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .step {
            display: flex;
            align-items: start;
            margin-bottom: 15px;
          }
          .step-number {
            background-color: #2C5F3A;
            color: #ffffff;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            margin-right: 15px;
            flex-shrink: 0;
          }
          .footer {
            background-color: #f5f5f5;
            padding: 30px 20px;
            text-align: center;
            color: #666;
            font-size: 14px;
          }
          .footer a {
            color: #2C5F3A;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header -->
          <div class="header">
            <h1>Kelp Board Bags</h1>
          </div>

          <!-- Content -->
          <div class="content">
            <div class="success-icon">✅</div>
            <h2>Thank You for Your Order!</h2>
            <p>Hi ${customerName},</p>
            <p>We've received your order and are excited to get your premium board bags to you. Your order details are below:</p>

            <!-- Order Number -->
            <div class="order-number">
              <div>Order Number</div>
              <strong>${order.orderNumber}</strong>
            </div>

            <!-- Order Items -->
            <div class="section">
              <div class="section-title">Order Items</div>
              ${order.items
                .map(
                  item => `
                <div class="item">
                  <div class="item-details">
                    <div class="item-name">${item.productName}</div>
                    <div class="item-quantity">Quantity: ${item.quantity}</div>
                  </div>
                  <div class="item-price">${formatPrice(Number(item.total), order.currency)}</div>
                </div>
              `
                )
                .join('')}

              <!-- Totals -->
              <div class="totals">
                <div class="total-row">
                  <span>Subtotal:</span>
                  <span>${formatPrice(Number(order.subtotal), order.currency)}</span>
                </div>
                ${
                  Number(order.discount) > 0
                    ? `
                <div class="total-row">
                  <span>Discount:</span>
                  <span>-${formatPrice(Number(order.discount), order.currency)}</span>
                </div>
                `
                    : ''
                }
                <div class="total-row">
                  <span>Shipping:</span>
                  <span>${formatPrice(Number(order.shippingCost), order.currency)}</span>
                </div>
                <div class="total-row">
                  <span>VAT (15%):</span>
                  <span>${formatPrice(Number(order.tax), order.currency)}</span>
                </div>
                <div class="total-row grand-total">
                  <span>Total:</span>
                  <span>${formatPrice(Number(order.total), order.currency)}</span>
                </div>
              </div>
            </div>

            <!-- Shipping Address -->
            <div class="section">
              <div class="section-title">Shipping Address</div>
              <div class="address-box">
                ${shippingAddress.firstName} ${shippingAddress.lastName}<br>
                ${shippingAddress.address1}<br>
                ${shippingAddress.address2 ? `${shippingAddress.address2}<br>` : ''}
                ${shippingAddress.city}, ${shippingAddress.province || ''} ${shippingAddress.postalCode}<br>
                ${shippingAddress.country}
              </div>
            </div>

            <!-- What's Next -->
            <div class="section">
              <div class="section-title">What's Next?</div>
              <div class="steps">
                <div class="step">
                  <div class="step-number">1</div>
                  <div>Your order is being prepared by our team</div>
                </div>
                <div class="step">
                  <div class="step-number">2</div>
                  <div>You'll receive a shipping confirmation with tracking info once dispatched</div>
                </div>
                <div class="step">
                  <div class="step-number">3</div>
                  <div>Your order will arrive within 3-5 business days (SA) or 7-14 days (International)</div>
                </div>
              </div>
            </div>

            <!-- Track Order Button -->
            <center>
              <a href="${siteConfig.url}/account/orders/${order.orderNumber}" class="button">
                Track Your Order
              </a>
            </center>

            <p style="margin-top: 30px;">
              Your VAT invoice is attached to this email. If you have any questions about your order, please don't hesitate to contact us.
            </p>

            <p>
              <strong>Need Help?</strong><br>
              Email: <a href="mailto:${siteConfig.contact.email}">${siteConfig.contact.email}</a><br>
              WhatsApp: ${siteConfig.contact.whatsapp || siteConfig.contact.phone}
            </p>
          </div>

          <!-- Footer -->
          <div class="footer">
            <p>Thank you for supporting Kelp Board Bags!</p>
            <p>
              <a href="${siteConfig.url}">Visit our website</a> |
              <a href="${siteConfig.links.instagram}">Follow us on Instagram</a>
            </p>
            <p style="font-size: 12px; color: #999; margin-top: 20px;">
              ${siteConfig.business.legalName}<br>
              ${siteConfig.contact.address}
            </p>
          </div>
        </div>
      </body>
    </html>
  `
}

/**
 * Send shipping notification email
 */
export async function sendShippingNotificationEmail(
  order: OrderWithRelations,
  trackingNumber: string,
  carrier: string = 'Courier'
): Promise<{ success: boolean; error?: string }> {
  try {
    const shippingAddress = order.shippingAddress as any
    const customerName = `${shippingAddress.firstName} ${shippingAddress.lastName}`

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'orders@kelpboardbags.co.za',
      to: [order.email],
      subject: `Your Order ${order.orderNumber} Has Shipped!`,
      html: getShippingNotificationEmailHTML(
        order,
        customerName,
        trackingNumber,
        carrier
      ),
    })

    if (error) {
      console.error('Failed to send shipping notification email:', error)
      return { success: false, error: error.message }
    }

    console.log('Shipping notification email sent:', data?.id)
    return { success: true }
  } catch (error) {
    console.error('Error sending shipping notification email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Generate shipping notification email HTML
 */
function getShippingNotificationEmailHTML(
  order: OrderWithRelations,
  customerName: string,
  trackingNumber: string,
  carrier: string
): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          /* Same styles as confirmation email */
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; background-color: #f5f5f5; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background-color: #2C5F3A; color: #ffffff; padding: 40px 20px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; }
          .content { padding: 40px 20px; }
          .tracking-box { background-color: #D4C5B0; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
          .tracking-number { font-size: 24px; font-weight: 600; color: #2C5F3A; font-family: monospace; }
          .button { display: inline-block; background-color: #2C5F3A; color: #ffffff !important; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .footer { background-color: #f5f5f5; padding: 30px 20px; text-align: center; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📦 Your Order Is On Its Way!</h1>
          </div>
          <div class="content">
            <p>Hi ${customerName},</p>
            <p>Great news! Your order <strong>${order.orderNumber}</strong> has been shipped and is on its way to you.</p>

            <div class="tracking-box">
              <div>Tracking Number</div>
              <div class="tracking-number">${trackingNumber}</div>
              <div style="margin-top: 10px; font-size: 14px;">Carrier: ${carrier}</div>
            </div>

            <center>
              <a href="#" class="button">Track Your Package</a>
            </center>

            <p>Your order should arrive within 3-5 business days. You can track your package using the tracking number above.</p>

            <p>If you have any questions, please contact us at ${siteConfig.contact.email}</p>
          </div>
          <div class="footer">
            <p>Thank you for your order!</p>
            <p>Kelp Board Bags - ${siteConfig.contact.address}</p>
          </div>
        </div>
      </body>
    </html>
  `
}
