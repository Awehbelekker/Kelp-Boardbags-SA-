import React from 'react'
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from '@react-pdf/renderer'
import { formatPrice, formatDate } from './utils'

// Register fonts (optional - using system fonts for now)
// Font.register({
//   family: 'Roboto',
//   src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxP.ttf',
// })

// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  logo: {
    width: 120,
    height: 60,
  },
  companyInfo: {
    textAlign: 'right',
  },
  companyName: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: '#2C5F3A', // Kelp green
    marginBottom: 5,
  },
  companyDetails: {
    fontSize: 9,
    color: '#666',
    lineHeight: 1.5,
  },
  invoiceTitle: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 20,
    color: '#2C5F3A',
  },
  section: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  column: {
    flex: 1,
  },
  label: {
    fontSize: 9,
    color: '#666',
    marginBottom: 3,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 10,
    color: '#333',
  },
  valueBold: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#333',
  },
  table: {
    marginTop: 20,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    padding: 8,
    fontFamily: 'Helvetica-Bold',
    borderBottom: '2px solid #2C5F3A',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottom: '1px solid #E0E0E0',
  },
  tableColDescription: {
    flex: 3,
  },
  tableColQty: {
    flex: 1,
    textAlign: 'center',
  },
  tableColPrice: {
    flex: 1,
    textAlign: 'right',
  },
  tableColTotal: {
    flex: 1,
    textAlign: 'right',
  },
  totalsSection: {
    marginTop: 20,
    marginLeft: 'auto',
    width: 200,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  totalLabel: {
    fontSize: 10,
    color: '#666',
  },
  totalValue: {
    fontSize: 10,
    color: '#333',
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTop: '2px solid #2C5F3A',
  },
  grandTotalLabel: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#2C5F3A',
  },
  grandTotalValue: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#2C5F3A',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#999',
    borderTop: '1px solid #E0E0E0',
    paddingTop: 10,
  },
  notes: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
  },
  notesTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 5,
  },
  notesText: {
    fontSize: 9,
    color: '#666',
    lineHeight: 1.4,
  },
})

interface InvoiceData {
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

export const InvoiceTemplate: React.FC<{ data: InvoiceData }> = ({ data }) => {
  const company = {
    name: 'Kelp Board Bags',
    legalName: 'Kelp Board Bags (Pty) Ltd',
    address: 'Cape Town, South Africa',
    phone: '+27 XX XXX XXXX',
    email: 'hello@kelpboardbags.co.za',
    website: 'www.kelpboardbags.co.za',
    vatNumber: 'VAT REG: XXXXXXXXXX',
    registrationNumber: 'REG: XXXX/XXXXXX/XX',
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.companyName}>{company.name}</Text>
            <Text style={styles.companyDetails}>{company.legalName}</Text>
            <Text style={styles.companyDetails}>{company.address}</Text>
            <Text style={styles.companyDetails}>{company.phone}</Text>
            <Text style={styles.companyDetails}>{company.email}</Text>
            <Text style={styles.companyDetails}>{company.website}</Text>
          </View>
          <View style={styles.companyInfo}>
            <Text style={styles.companyDetails}>{company.vatNumber}</Text>
            <Text style={styles.companyDetails}>{company.registrationNumber}</Text>
          </View>
        </View>

        {/* Invoice Title */}
        <Text style={styles.invoiceTitle}>
          {data.paymentStatus === 'PAID' ? 'TAX INVOICE' : 'PROFORMA INVOICE'}
        </Text>

        {/* Invoice Details */}
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Invoice Number</Text>
            <Text style={styles.valueBold}>{data.orderNumber}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Invoice Date</Text>
            <Text style={styles.value}>{formatDate(data.invoiceDate)}</Text>
          </View>
          {data.dueDate && (
            <View style={styles.column}>
              <Text style={styles.label}>Due Date</Text>
              <Text style={styles.value}>{formatDate(data.dueDate)}</Text>
            </View>
          )}
          <View style={styles.column}>
            <Text style={styles.label}>Payment Status</Text>
            <Text style={styles.valueBold}>
              {data.paymentStatus === 'PAID' ? 'PAID' : 'PENDING'}
            </Text>
          </View>
        </View>

        {/* Customer Details */}
        <View style={styles.section}>
          <Text style={styles.label}>Bill To</Text>
          <Text style={styles.valueBold}>{data.customer.name}</Text>
          <Text style={styles.value}>{data.customer.email}</Text>
          {data.customer.phone && <Text style={styles.value}>{data.customer.phone}</Text>}
          <Text style={styles.value}>{data.customer.address.address1}</Text>
          {data.customer.address.address2 && (
            <Text style={styles.value}>{data.customer.address.address2}</Text>
          )}
          <Text style={styles.value}>
            {data.customer.address.city}
            {data.customer.address.province ? `, ${data.customer.address.province}` : ''}{' '}
            {data.customer.address.postalCode}
          </Text>
          <Text style={styles.value}>{data.customer.address.country}</Text>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={styles.tableColDescription}>Description</Text>
            <Text style={styles.tableColQty}>Qty</Text>
            <Text style={styles.tableColPrice}>Price</Text>
            <Text style={styles.tableColTotal}>Total</Text>
          </View>

          {/* Table Rows */}
          {data.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableColDescription}>{item.description}</Text>
              <Text style={styles.tableColQty}>{item.quantity}</Text>
              <Text style={styles.tableColPrice}>
                {formatPrice(item.price, data.currency)}
              </Text>
              <Text style={styles.tableColTotal}>
                {formatPrice(item.total, data.currency)}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>
              {formatPrice(data.subtotal, data.currency)}
            </Text>
          </View>

          {data.discount > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Discount:</Text>
              <Text style={styles.totalValue}>
                -{formatPrice(data.discount, data.currency)}
              </Text>
            </View>
          )}

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Shipping:</Text>
            <Text style={styles.totalValue}>
              {formatPrice(data.shipping, data.currency)}
            </Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>VAT (15%):</Text>
            <Text style={styles.totalValue}>
              {formatPrice(data.tax, data.currency)}
            </Text>
          </View>

          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>TOTAL:</Text>
            <Text style={styles.grandTotalValue}>
              {formatPrice(data.total, data.currency)}
            </Text>
          </View>
        </View>

        {/* Notes */}
        {data.notes && (
          <View style={styles.notes}>
            <Text style={styles.notesTitle}>Notes:</Text>
            <Text style={styles.notesText}>{data.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Thank you for your business!</Text>
          <Text>
            For queries, contact us at {company.email} or {company.phone}
          </Text>
        </View>
      </Page>
    </Document>
  )
}
