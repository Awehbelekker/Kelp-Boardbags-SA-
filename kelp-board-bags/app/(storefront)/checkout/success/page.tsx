"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Loader2, Mail, Package } from "lucide-react"
import { formatPrice } from "@/lib/utils"

interface OrderData {
  orderNumber: string
  email: string
  total: number
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  status: string
  paymentStatus: string
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('order')
  const [order, setOrder] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (orderNumber) {
      // Fetch order details
      fetch(`/api/orders/${orderNumber}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setOrder(data.data)
          }
        })
        .catch(error => console.error('Failed to fetch order:', error))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [orderNumber])

  if (loading) {
    return (
      <div className="container-custom section-padding flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-kelp-green" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container-custom section-padding text-center">
        <h1 className="heading-lg mb-4">Order Not Found</h1>
        <p className="text-muted-foreground mb-8">
          We couldn't find the order you're looking for.
        </p>
        <Button asChild>
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container-custom section-padding">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h1 className="heading-lg mb-4">Thank You for Your Order!</h1>
          <p className="text-lg text-muted-foreground mb-2">
            Your order has been received and is being processed.
          </p>
          <p className="text-sm text-muted-foreground">
            Order Number: <span className="font-semibold text-kelp-green">{order.orderNumber}</span>
          </p>
        </div>

        {/* Order Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Mail className="w-8 h-8 text-kelp-green mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Confirmation Email</h3>
              <p className="text-sm text-muted-foreground">
                Sent to {order.email}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Package className="w-8 h-8 text-kelp-green mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Order Status</h3>
              <p className="text-sm text-muted-foreground">
                {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Payment</h3>
              <p className="text-sm text-muted-foreground">
                {order.paymentStatus === 'PAID' ? 'Completed' : 'Processing'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="font-heading text-2xl font-semibold mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">
                    {formatPrice(item.price * item.quantity, 'ZAR')}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span className="text-kelp-green">{formatPrice(order.total, 'ZAR')}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What's Next */}
        <Card className="mb-8 bg-sand-beige/30">
          <CardContent className="p-8">
            <h3 className="font-heading text-xl font-semibold mb-4">What's Next?</h3>
            <ol className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-kelp-green text-white flex items-center justify-center text-xs">
                  1
                </span>
                <span>
                  You'll receive an order confirmation email with your invoice at {order.email}
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-kelp-green text-white flex items-center justify-center text-xs">
                  2
                </span>
                <span>
                  We'll prepare your items and send a shipping confirmation once dispatched
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-kelp-green text-white flex items-center justify-center text-xs">
                  3
                </span>
                <span>
                  Track your order status in your account or via the tracking link in your email
                </span>
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/account/orders">View Order Details</Link>
          </Button>
          <Button asChild size="lg">
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="container-custom section-padding flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-kelp-green" />
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  )
}
