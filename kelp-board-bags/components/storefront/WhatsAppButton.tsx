'use client'

import { MessageCircle } from 'lucide-react'
import { siteConfig } from '@/config/site'

interface WhatsAppButtonProps {
  message?: string
  className?: string
}

export function WhatsAppButton({
  message = "Hi! I'm interested in Kelp Board Bags...",
  className = '',
}: WhatsAppButtonProps) {
  // Remove any non-numeric characters from the phone number
  const phoneNumber = siteConfig.contact.whatsapp.replace(/\D/g, '')
  const encodedMessage = encodeURIComponent(message)

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${encodedMessage}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full p-4 shadow-lg transition-all hover:scale-110 hover:shadow-xl ${className}`}
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  )
}

// Variant for product pages with pre-filled product info
export function WhatsAppProductButton({
  productName,
  className = '',
}: {
  productName: string
  className?: string
}) {
  const message = `Hi! I'm interested in the ${productName}. Is it available?`
  return <WhatsAppButton message={message} className={className} />
}

// Variant for custom order inquiries
export function WhatsAppCustomButton({
  boardType,
  dimensions,
  className = '',
}: {
  boardType?: string
  dimensions?: string
  className?: string
}) {
  let message = "Hi! I'd like a custom quote for a"
  if (boardType) message += ` ${boardType} bag`
  if (dimensions) message += `, dimensions: ${dimensions}`
  if (!boardType && !dimensions) message += " custom board bag"

  return <WhatsAppButton message={message} className={className} />
}

