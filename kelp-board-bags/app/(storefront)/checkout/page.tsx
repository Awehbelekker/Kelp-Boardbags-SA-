"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { checkoutSchema, type CheckoutInput } from "@/lib/validations"
import { useCart } from "@/hooks/use-cart"
import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CreditCard, Smartphone } from "lucide-react"
import Image from "next/image"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, cart, clearCart } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'YOCO' | 'PAYFAST' | 'STRIPE' | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      sameAsShipping: true,
      paymentMethod: 'YOCO',
    },
  })

  const sameAsShipping = watch('sameAsShipping')

  // Redirect if cart is empty
  if (items.length === 0) {
    router.push('/cart')
    return null
  }

  const onSubmit = async (data: CheckoutInput) => {
    setIsProcessing(true)

    try {
      // Create order
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          items: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
          cart,
        }),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to create order')
      }

      // Process payment based on method
      if (data.paymentMethod === 'YOCO') {
        // Redirect to Yoco checkout
        window.location.href = result.data.paymentUrl
      } else if (data.paymentMethod === 'PAYFAST') {
        // Redirect to PayFast
        window.location.href = result.data.paymentUrl
      } else if (data.paymentMethod === 'STRIPE') {
        // Redirect to Stripe checkout
        window.location.href = result.data.paymentUrl
      } else if (data.paymentMethod === 'WHATSAPP') {
        // Generate WhatsApp order message
        const whatsappUrl = result.data.whatsappUrl
        window.open(whatsappUrl, '_blank')
        router.push(`/checkout/success?order=${result.data.orderNumber}`)
      }

      // Clear cart after successful order creation
      clearCart()
    } catch (error) {
      console.error('Checkout error:', error)
      alert(error instanceof Error ? error.message : 'Failed to process checkout')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="container-custom section-padding">
      <h1 className="heading-lg mb-8">Checkout</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      {...register('email')}
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Phone Number *
                    </label>
                    <Input
                      type="tel"
                      {...register('phone')}
                      placeholder="+27 XX XXX XXXX"
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      First Name *
                    </label>
                    <Input {...register('shippingFirstName')} />
                    {errors.shippingFirstName && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.shippingFirstName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Last Name *
                    </label>
                    <Input {...register('shippingLastName')} />
                    {errors.shippingLastName && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.shippingLastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Company (Optional)
                  </label>
                  <Input {...register('shippingCompany')} />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Street Address *
                  </label>
                  <Input {...register('shippingAddress1')} placeholder="Street address" />
                  {errors.shippingAddress1 && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.shippingAddress1.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Apartment, Suite, etc. (Optional)
                  </label>
                  <Input {...register('shippingAddress2')} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">City *</label>
                    <Input {...register('shippingCity')} />
                    {errors.shippingCity && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.shippingCity.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Province/State
                    </label>
                    <Input {...register('shippingProvince')} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Postal Code *
                    </label>
                    <Input {...register('shippingPostalCode')} />
                    {errors.shippingPostalCode && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.shippingPostalCode.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Country *</label>
                  <select
                    {...register('shippingCountry')}
                    className="w-full border rounded-md px-3 py-2"
                  >
                    <option value="South Africa">South Africa</option>
                    <option value="Namibia">Namibia</option>
                    <option value="Botswana">Botswana</option>
                    <option value="Zimbabwe">Zimbabwe</option>
                    <option value="Mozambique">Mozambique</option>
                    <option value="">---</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                    <option value="New Zealand">New Zealand</option>
                  </select>
                  {errors.shippingCountry && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.shippingCountry.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone Number *
                  </label>
                  <Input
                    type="tel"
                    {...register('shippingPhone')}
                    placeholder="+27 XX XXX XXXX"
                  />
                  {errors.shippingPhone && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.shippingPhone.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Billing Address */}
            <Card>
              <CardHeader>
                <CardTitle>Billing Address</CardTitle>
              </CardHeader>
              <CardContent>
                <label className="flex items-center space-x-2 mb-4">
                  <input
                    type="checkbox"
                    {...register('sameAsShipping')}
                    className="rounded border-gray-300 text-kelp-green focus:ring-kelp-green"
                  />
                  <span className="text-sm">Same as shipping address</span>
                </label>

                {!sameAsShipping && (
                  <div className="space-y-4">
                    {/* Repeat billing address fields */}
                    <p className="text-sm text-muted-foreground">
                      Billing address fields (same as shipping)
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Order Notes (Optional)</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  {...register('customerNotes')}
                  rows={4}
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="Any special instructions for your order?"
                />
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Yoco - Recommended for SA */}
                <label className="flex items-center space-x-3 p-4 border-2 border-kelp-green rounded-lg cursor-pointer hover:bg-sand-beige/30 relative">
                  <input
                    type="radio"
                    {...register('paymentMethod')}
                    value="YOCO"
                    className="text-kelp-green focus:ring-kelp-green"
                  />
                  <CreditCard className="w-5 h-5 text-kelp-green" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">Yoco</p>
                      <span className="text-xs bg-kelp-green text-white px-2 py-0.5 rounded-full">
                        Recommended
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Card, Instant EFT, SnapScan (South African customers)
                    </p>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-sand-beige/30">
                  <input
                    type="radio"
                    {...register('paymentMethod')}
                    value="PAYFAST"
                    className="text-kelp-green focus:ring-kelp-green"
                  />
                  <CreditCard className="w-5 h-5" />
                  <div className="flex-1">
                    <p className="font-medium">PayFast</p>
                    <p className="text-sm text-muted-foreground">
                      Card, EFT, or Instant EFT (South African customers)
                    </p>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-sand-beige/30">
                  <input
                    type="radio"
                    {...register('paymentMethod')}
                    value="STRIPE"
                    className="text-kelp-green focus:ring-kelp-green"
                  />
                  <CreditCard className="w-5 h-5" />
                  <div className="flex-1">
                    <p className="font-medium">Credit Card (International)</p>
                    <p className="text-sm text-muted-foreground">
                      Visa, Mastercard, Amex via Stripe
                    </p>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-sand-beige/30">
                  <input
                    type="radio"
                    {...register('paymentMethod')}
                    value="WHATSAPP"
                    className="text-kelp-green focus:ring-kelp-green"
                  />
                  <Smartphone className="w-5 h-5" />
                  <div className="flex-1">
                    <p className="font-medium">WhatsApp Order</p>
                    <p className="text-sm text-muted-foreground">
                      Place order via WhatsApp and pay on delivery
                    </p>
                  </div>
                </label>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div
                      key={`${item.productId}-${item.variantId || ''}`}
                      className="flex gap-3"
                    >
                      <div className="relative w-16 h-16 bg-sand-beige rounded flex-shrink-0">
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover rounded"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-sm font-medium">
                          {formatPrice(item.price * item.quantity, 'ZAR')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(cart.subtotal, 'ZAR')}</span>
                  </div>

                  {cart.discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-{formatPrice(cart.discount, 'ZAR')}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{formatPrice(cart.shipping, 'ZAR')}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">VAT (15%)</span>
                    <span>{formatPrice(cart.tax, 'ZAR')}</span>
                  </div>

                  <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span className="text-kelp-green">
                        {formatPrice(cart.total, 'ZAR')}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>Complete Order</>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By placing your order, you agree to our Terms and Privacy Policy
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
