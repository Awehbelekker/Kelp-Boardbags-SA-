import React from 'react'
import { pdf } from '@react-pdf/renderer'
import { InvoiceTemplate } from './invoice-template'
import { OrderWithRelations } from '@/types'

export interface InvoiceData {
  orderNumber: string
  invoiceDate: Date
  dueDate?: Date
  customer: {
    name: string
    email: string
    phone?: string
    address: {
      address1: string
      address2?: string
      city: string
      province?: string
      postalCode: string
      country: string
    }
  }
  items: Array<{
    description: string
    quantity: number
    price: number
    total: number
  }>
  subtotal: number
  discount: number
  shipping: number
  tax: number
  total: number
  currency: string
  notes?: string
  paymentStatus: string
}

/**
 * Generate invoice PDF from order data
 * Returns a Buffer containing the PDF
 */
export async function generateInvoicePDF(order: OrderWithRelations): Promise<Buffer> {
  // Extract shipping address
  const shippingAddress = order.shippingAddress as any

  // Prepare invoice data
  const invoiceData: InvoiceData = {
    orderNumber: order.orderNumber,
    invoiceDate: order.createdAt,
    customer: {
      name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
      email: order.email,
      phone: order.phone || shippingAddress.phone,
      address: {
        address1: shippingAddress.address1,
        address2: shippingAddress.address2,
        city: shippingAddress.city,
        province: shippingAddress.province,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country,
      },
    },
    items: order.items.map(item => ({
      description: item.productName,
      quantity: item.quantity,
      price: Number(item.price),
      total: Number(item.total),
    })),
    subtotal: Number(order.subtotal),
    discount: Number(order.discount),
    shipping: Number(order.shippingCost),
    tax: Number(order.tax),
    total: Number(order.total),
    currency: order.currency,
    notes: order.customerNotes || undefined,
    paymentStatus: order.paymentStatus,
  }

  // Generate PDF
  const blob = await pdf(
    React.createElement(InvoiceTemplate, { data: invoiceData }) as any
  ).toBlob()

  // Convert blob to buffer
  const arrayBuffer = await blob.arrayBuffer()
  const pdfBuffer = Buffer.from(arrayBuffer)

  return pdfBuffer
}

/**
 * Generate invoice PDF and save to file system (for development/testing)
 */
export async function generateAndSaveInvoice(
  order: OrderWithRelations,
  filePath: string
): Promise<void> {
  const pdfBuffer = await generateInvoicePDF(order)
  const fs = await import('fs')
  fs.writeFileSync(filePath, pdfBuffer)
}

/**
 * Get invoice filename
 */
export function getInvoiceFilename(orderNumber: string): string {
  return `Invoice-${orderNumber}.pdf`
}
