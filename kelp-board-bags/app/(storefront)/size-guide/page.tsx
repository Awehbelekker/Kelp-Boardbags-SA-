"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Ruler, HelpCircle, MessageCircle, ArrowRight } from "lucide-react"
import { siteConfig } from "@/config/site"

const boardSizeGuide = [
  { type: "Shortboard", lengthRange: "5'6\" - 6'6\"", widthRange: "18\" - 20\"", bagSize: "6'0\" - 6'6\" Bag" },
  { type: "Fish / Hybrid", lengthRange: "5'4\" - 6'4\"", widthRange: "20\" - 22\"", bagSize: "6'0\" - 6'6\" Wide Bag" },
  { type: "Funboard", lengthRange: "6'6\" - 8'0\"", widthRange: "20\" - 23\"", bagSize: "7'0\" - 8'0\" Bag" },
  { type: "Longboard", lengthRange: "9'0\" - 10'0\"", widthRange: "22\" - 24\"", bagSize: "9'6\" - 10'6\" Bag" },
  { type: "Log / Noserider", lengthRange: "9'6\" - 12'0\"", widthRange: "23\" - 26\"", bagSize: "Custom XXL Bag" },
  { type: "SUP", lengthRange: "9'0\" - 14'0\"", widthRange: "28\" - 34\"", bagSize: "Custom SUP Bag" },
  { type: "Foilboard", lengthRange: "4'0\" - 6'0\"", widthRange: "18\" - 24\"", bagSize: "Custom Foil Bag" },
  { type: "Kiteboard", lengthRange: "4'0\" - 6'0\"", widthRange: "15\" - 18\"", bagSize: "Kiteboard Bag" },
  { type: "Waveski", lengthRange: "6'0\" - 9'0\"", widthRange: "18\" - 22\"", bagSize: "Custom Waveski Bag" },
]

export default function SizeGuidePage() {
  const [length, setLength] = useState("")
  const [width, setWidth] = useState("")
  const [recommendation, setRecommendation] = useState<string | null>(null)

  const calculateRecommendation = () => {
    const lengthNum = parseFloat(length)
    const widthNum = parseFloat(width)

    if (isNaN(lengthNum) || isNaN(widthNum)) {
      setRecommendation("Please enter valid dimensions")
      return
    }

    // Add 2-4 inches to length for bag size
    const bagLength = lengthNum + 0.25 // Add 3 inches (0.25 feet)
    
    let bagType = "Standard Bag"
    if (widthNum >= 28) {
      bagType = "SUP Bag"
    } else if (lengthNum >= 9.5) {
      bagType = "XXL / Longboard Bag"
    } else if (lengthNum >= 9) {
      bagType = "Longboard Bag"
    } else if (widthNum >= 21) {
      bagType = "Wide Bag (Fish/Funboard)"
    } else if (lengthNum >= 7) {
      bagType = "Funboard Bag"
    } else {
      bagType = "Shortboard Bag"
    }

    setRecommendation(`Recommended: ${Math.ceil(bagLength * 2) / 2}'0" ${bagType}`)
  }

  const getWhatsAppLink = () => {
    const message = `Hi! I need help finding the right bag size for my board. Dimensions: ${length}'0" x ${width}"`
    return `https://wa.me/${siteConfig.contact.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
  }

  return (
    <div className="container-custom section-padding">
      {/* Page Header */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="heading-xl mb-4">Size Guide</h1>
        <p className="text-lg text-muted-foreground">
          Find the perfect bag size for your board. Use our calculator or reference guide below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        {/* Size Calculator */}
        <Card className="border-2 border-kelp-green">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ruler className="h-5 w-5 text-kelp-green" />
              What Size Do I Need?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm text-muted-foreground">
              Enter your board dimensions and we'll recommend the right bag size.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="length">Board Length (feet)</Label>
                <Input
                  id="length"
                  type="number"
                  step="0.5"
                  min="4"
                  max="14"
                  placeholder="e.g., 9.6"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="width">Board Width (inches)</Label>
                <Input
                  id="width"
                  type="number"
                  step="0.5"
                  min="14"
                  max="36"
                  placeholder="e.g., 23"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                />
              </div>
            </div>

            <Button onClick={calculateRecommendation} className="w-full">
              Get Recommendation
            </Button>

            {recommendation && (
              <div className="p-4 bg-sand-beige rounded-lg">
                <p className="font-semibold text-kelp-green">{recommendation}</p>
              </div>
            )}

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-3">
                Need a custom size? We specialize in boards that don't fit standard bags!
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/custom-order">
                    Custom Order <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild className="flex-1 bg-[#25D366] hover:bg-[#128C7E]">
                  <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Ask via WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How to Measure */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-ocean-teal" />
              How to Measure Your Board
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-kelp-green text-white flex items-center justify-center font-bold">1</div>
                <div>
                  <h4 className="font-semibold">Length</h4>
                  <p className="text-sm text-muted-foreground">Measure from the tip of the nose to the end of the tail along the stringer (center line).</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-kelp-green text-white flex items-center justify-center font-bold">2</div>
                <div>
                  <h4 className="font-semibold">Width</h4>
                  <p className="text-sm text-muted-foreground">Measure at the widest point of your board, typically near the center.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-kelp-green text-white flex items-center justify-center font-bold">3</div>
                <div>
                  <h4 className="font-semibold">Thickness (Optional)</h4>
                  <p className="text-sm text-muted-foreground">Measure at the thickest point. Important for travel bags and custom orders.</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-sand-beige/50 rounded-lg mt-6">
              <h4 className="font-semibold mb-2">💡 Pro Tip</h4>
              <p className="text-sm text-muted-foreground">
                Always add 2-4 inches to your board length when selecting a bag. This ensures easy insertion and protects the nose and tail.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Size Reference Table */}
      <div className="mb-16">
        <h2 className="heading-lg text-center mb-8">Board Size Reference Guide</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-kelp-green text-white">
                <th className="p-4 text-left font-semibold">Board Type</th>
                <th className="p-4 text-left font-semibold">Typical Length</th>
                <th className="p-4 text-left font-semibold">Typical Width</th>
                <th className="p-4 text-left font-semibold">Recommended Bag</th>
              </tr>
            </thead>
            <tbody>
              {boardSizeGuide.map((row, index) => (
                <tr
                  key={row.type}
                  className={index % 2 === 0 ? "bg-sand-beige/30" : "bg-white"}
                >
                  <td className="p-4 font-medium">{row.type}</td>
                  <td className="p-4 text-muted-foreground">{row.lengthRange}</td>
                  <td className="p-4 text-muted-foreground">{row.widthRange}</td>
                  <td className="p-4 font-medium text-kelp-green">{row.bagSize}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-kelp-green text-white rounded-2xl p-8 md:p-12 text-center">
        <h2 className="heading-lg mb-4">Can't Find Your Size?</h2>
        <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
          We specialize in custom bags for boards that don't fit anywhere else.
          Logs, XXL boards, SUPs, foilboards - we've got you covered.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" variant="secondary">
            <Link href="/custom-order">
              Request Custom Quote
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            className="bg-[#25D366] hover:bg-[#128C7E] text-white"
          >
            <a
              href={`https://wa.me/${siteConfig.contact.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent("Hi! I need a custom bag for my board. Can you help?")}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              WhatsApp Us
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}

