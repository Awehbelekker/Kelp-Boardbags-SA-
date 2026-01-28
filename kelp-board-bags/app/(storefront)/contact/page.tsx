"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react"
import { siteConfig } from "@/config/site"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
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
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' })

    setTimeout(() => setSubmitted(false), 5000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="container-custom section-padding">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="heading-xl mb-4">Get in Touch</h1>
        <p className="body-lg text-muted-foreground max-w-2xl mx-auto">
          Have a question about our products or need a custom order? We'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Information */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-kelp-green mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium mb-1">Address</p>
                  <p className="text-sm text-muted-foreground">
                    {siteConfig.business.address.street}<br />
                    {siteConfig.business.address.city}, {siteConfig.business.address.province}<br />
                    {siteConfig.business.address.postalCode}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-kelp-green mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium mb-1">Phone</p>
                  <a 
                    href={`tel:${siteConfig.contact.phone}`}
                    className="text-sm text-muted-foreground hover:text-kelp-green"
                  >
                    {siteConfig.contact.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-kelp-green mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium mb-1">Email</p>
                  <a 
                    href={`mailto:${siteConfig.contact.email}`}
                    className="text-sm text-muted-foreground hover:text-kelp-green"
                  >
                    {siteConfig.contact.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-kelp-green mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium mb-1">WhatsApp</p>
                  <a 
                    href={`https://wa.me/${siteConfig.contact.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-kelp-green"
                  >
                    {siteConfig.contact.whatsapp}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-kelp-green mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium mb-1">Business Hours</p>
                  <p className="text-sm text-muted-foreground">
                    Monday - Friday: 9:00 AM - 5:00 PM<br />
                    Saturday: 10:00 AM - 2:00 PM<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-kelp-green text-white">
            <CardContent className="pt-6">
              <h3 className="font-heading font-semibold text-lg mb-2">
                Prefer WhatsApp?
              </h3>
              <p className="text-sm mb-4 opacity-90">
                Chat with us directly for quick responses and custom order inquiries.
              </p>
              <Button 
                asChild 
                variant="secondary" 
                className="w-full"
              >
                <a 
                  href={`https://wa.me/${siteConfig.contact.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat on WhatsApp
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              {submitted && (
                <div className="mb-6 p-4 bg-kelp-green/10 border border-kelp-green rounded-lg">
                  <p className="text-kelp-green font-medium">
                    Thank you! We'll get back to you soon.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Name *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                      Phone
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+27 XX XXX XXXX"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-2">
                      Subject *
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="How can we help?"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full md:w-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

