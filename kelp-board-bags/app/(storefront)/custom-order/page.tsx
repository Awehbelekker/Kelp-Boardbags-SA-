"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageCircle, Ruler, Palette, Package } from "lucide-react"
import { siteConfig } from "@/config/site"

export default function CustomOrderPage() {
  const [formData, setFormData] = useState({
    boardType: '',
    length: '',
    width: '',
    thickness: '',
    color: '',
    padding: '10mm',
    features: [] as string[],
    name: '',
    email: '',
    phone: '',
    additionalNotes: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // TODO: Implement actual form submission
    await new Promise(resolve => setTimeout(resolve, 1000))

    setIsSubmitting(false)
    setSubmitted(true)

    setTimeout(() => setSubmitted(false), 5000)
  }

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }))
  }

  const estimatedPrice = () => {
    const basePrice = 1200
    const lengthMultiplier = formData.length ? parseFloat(formData.length) / 6 : 1
    const featuresCost = formData.features.length * 150
    return Math.round(basePrice * lengthMultiplier + featuresCost)
  }

  const generateWhatsAppMessage = () => {
    const parts = [
      "🏄 *Custom Board Bag Quote Request*",
      "",
      "*Board Specifications:*",
    ]

    if (formData.boardType) parts.push(`• Board Type: ${formData.boardType}`)
    if (formData.length) parts.push(`• Length: ${formData.length} ft`)
    if (formData.width) parts.push(`• Width: ${formData.width} inches`)
    if (formData.thickness) parts.push(`• Thickness: ${formData.thickness} inches`)

    if (formData.color || formData.padding || formData.features.length > 0) {
      parts.push("")
      parts.push("*Customization:*")
      if (formData.color) parts.push(`• Color: ${formData.color}`)
      if (formData.padding) parts.push(`• Padding: ${formData.padding}`)
      if (formData.features.length > 0) {
        parts.push(`• Features: ${formData.features.join(', ')}`)
      }
    }

    if (formData.name || formData.email || formData.phone) {
      parts.push("")
      parts.push("*Contact Details:*")
      if (formData.name) parts.push(`• Name: ${formData.name}`)
      if (formData.email) parts.push(`• Email: ${formData.email}`)
      if (formData.phone) parts.push(`• Phone: ${formData.phone}`)
    }

    if (formData.additionalNotes) {
      parts.push("")
      parts.push("*Additional Notes:*")
      parts.push(formData.additionalNotes)
    }

    parts.push("")
    parts.push(`*Estimated Price: R${estimatedPrice().toLocaleString()}*`)
    parts.push("")
    parts.push("Please provide a detailed quote and timeline for this custom bag. Thank you!")

    return parts.join('\n')
  }

  const getWhatsAppLink = () => {
    const message = generateWhatsAppMessage()
    const whatsappNumber = siteConfig.contact.whatsapp.replace(/\D/g, '')
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[300px] bg-gradient-to-br from-ocean-teal to-kelp-green flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 container-custom text-center">
          <h1 className="heading-xl mb-4">Build Your Custom Bag</h1>
          <p className="body-lg max-w-2xl mx-auto">
            Design a board bag perfectly tailored to your board's dimensions and your style
          </p>
        </div>
      </section>

      <div className="container-custom section-padding">
        {submitted && (
          <div className="mb-8 p-6 bg-kelp-green/10 border border-kelp-green rounded-lg">
            <h3 className="font-heading font-semibold text-lg text-kelp-green mb-2">
              Custom Order Received!
            </h3>
            <p className="text-muted-foreground">
              Thank you for your custom order request. We'll review your specifications and get back to you within 24 hours with a quote and timeline.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Custom Order Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Board Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Board Type */}
                  <div>
                    <Label htmlFor="boardType">Board Type *</Label>
                    <Select
                      value={formData.boardType}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, boardType: value }))}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select board type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="shortboard">Shortboard</SelectItem>
                        <SelectItem value="fish">Fish</SelectItem>
                        <SelectItem value="funboard">Funboard</SelectItem>
                        <SelectItem value="longboard">Longboard</SelectItem>
                        <SelectItem value="sup">SUP</SelectItem>
                        <SelectItem value="foil">Foil Board</SelectItem>
                        <SelectItem value="waveski">Waveski</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Dimensions */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="length">Length (ft) *</Label>
                      <Input
                        id="length"
                        type="number"
                        step="0.1"
                        value={formData.length}
                        onChange={(e) => setFormData(prev => ({ ...prev, length: e.target.value }))}
                        placeholder="6.0"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="width">Width (inches) *</Label>
                      <Input
                        id="width"
                        type="number"
                        step="0.1"
                        value={formData.width}
                        onChange={(e) => setFormData(prev => ({ ...prev, width: e.target.value }))}
                        placeholder="20.0"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="thickness">Thickness (inches)</Label>
                      <Input
                        id="thickness"
                        type="number"
                        step="0.1"
                        value={formData.thickness}
                        onChange={(e) => setFormData(prev => ({ ...prev, thickness: e.target.value }))}
                        placeholder="2.5"
                      />
                    </div>
                  </div>

                  {/* Color */}
                  <div>
                    <Label htmlFor="color">Preferred Color</Label>
                    <Select
                      value={formData.color}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, color: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select color" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kelp-green">Kelp Green</SelectItem>
                        <SelectItem value="ocean-teal">Ocean Teal</SelectItem>
                        <SelectItem value="sand-beige">Sand Beige</SelectItem>
                        <SelectItem value="charcoal">Charcoal</SelectItem>
                        <SelectItem value="navy">Navy Blue</SelectItem>
                        <SelectItem value="custom">Custom Color</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Padding */}
                  <div>
                    <Label htmlFor="padding">Padding Thickness</Label>
                    <Select
                      value={formData.padding}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, padding: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5mm">5mm - Light Protection</SelectItem>
                        <SelectItem value="10mm">10mm - Standard (Recommended)</SelectItem>
                        <SelectItem value="15mm">15mm - Heavy Duty</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Additional Features */}
                  <div>
                    <Label className="mb-3 block">Additional Features</Label>
                    <div className="space-y-2">
                      {[
                        { id: 'shoulder-strap', label: 'Padded Shoulder Strap' },
                        { id: 'fin-slot', label: 'External Fin Slot' },
                        { id: 'wax-pocket', label: 'Wax Pocket' },
                        { id: 'name-embroidery', label: 'Name Embroidery' },
                        { id: 'reinforced-nose', label: 'Extra Reinforced Nose' },
                      ].map((feature) => (
                        <label key={feature.id} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.features.includes(feature.id)}
                            onChange={() => handleFeatureToggle(feature.id)}
                            className="rounded border-gray-300 text-kelp-green focus:ring-kelp-green"
                          />
                          <span className="text-sm">{feature.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="pt-6 border-t">
                    <h3 className="font-heading font-semibold text-lg mb-4">Your Information</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          required
                          placeholder="Your name"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            required
                            placeholder="your@email.com"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone *</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                            required
                            placeholder="+27 XX XXX XXXX"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="additionalNotes">Additional Notes</Label>
                        <Textarea
                          id="additionalNotes"
                          value={formData.additionalNotes}
                          onChange={(e) => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
                          rows={4}
                          placeholder="Any special requirements or questions?"
                        />
                      </div>
                    </div>
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Request Custom Quote'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Estimated Price */}
            <Card className="bg-kelp-green text-white">
              <CardHeader>
                <CardTitle className="text-white">Estimated Price</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold mb-2">
                  R{estimatedPrice().toLocaleString()}
                </div>
                <p className="text-sm opacity-90">
                  Final price will be confirmed after review
                </p>
              </CardContent>
            </Card>

            {/* WhatsApp CTA */}
            <Card>
              <CardContent className="pt-6">
                <MessageCircle className="h-10 w-10 text-kelp-green mb-3" />
                <h3 className="font-heading font-semibold mb-2">
                  Get Instant Quote via WhatsApp
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {formData.boardType || formData.length
                    ? "Send your specifications directly to us for a quick quote!"
                    : "Fill in your board details above, then click to send via WhatsApp for instant assistance."}
                </p>
                <Button
                  asChild
                  variant={formData.boardType || formData.length ? "default" : "outline"}
                  className="w-full"
                >
                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {formData.boardType || formData.length ? "Send Quote Request" : "Chat on WhatsApp"}
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">What's Included</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <Ruler className="w-5 h-5 text-kelp-green mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Perfect Fit</p>
                    <p className="text-xs text-muted-foreground">Custom-sized to your exact board dimensions</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Palette className="w-5 h-5 text-kelp-green mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Your Style</p>
                    <p className="text-xs text-muted-foreground">Choose colors and features you want</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Package className="w-5 h-5 text-kelp-green mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Handcrafted</p>
                    <p className="text-xs text-muted-foreground">Made by skilled artisans in Cape Town</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

