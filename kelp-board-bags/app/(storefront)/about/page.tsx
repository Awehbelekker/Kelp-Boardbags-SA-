import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Leaf, Heart, Users, Award } from "lucide-react"

export const metadata = {
  title: 'About Us | Kelp Board Bags',
  description: 'Learn about Kelp Board Bags - handcrafted, sustainable surfboard bags made in Cape Town, South Africa.',
}

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[400px] bg-gradient-to-br from-kelp-green to-ocean-teal flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 container-custom text-center">
          <h1 className="heading-xl mb-4">Our Story</h1>
          <p className="body-lg max-w-2xl mx-auto">
            Crafting sustainable surfboard protection in the heart of Cape Town
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="heading-lg mb-6">Protecting Boards, Respecting Oceans</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded in Cape Town, South Africa, Kelp Board Bags was born from a simple belief: 
                  surfers deserve quality gear that doesn't compromise the environment they love.
                </p>
                <p>
                  Every bag we create is handcrafted by skilled artisans using sustainable materials 
                  and eco-friendly processes. We're not just making board bags – we're building a 
                  movement toward responsible surf culture.
                </p>
                <p>
                  From our workshop in Paarden Island, we've been serving the local and international 
                  surf community with premium, custom-fit protection for boards of all shapes and sizes.
                </p>
              </div>
              <div className="mt-8">
                <Button asChild size="lg">
                  <Link href="/shop">Shop Our Collection</Link>
                </Button>
              </div>
            </div>
            <div className="relative aspect-square bg-sand-beige rounded-lg overflow-hidden">
              <Image
                src="/images/hero-bag.jpg"
                alt="Kelp Board Bags Workshop"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-sand-beige/30">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-lg mb-4">Our Values</h2>
            <p className="body-lg text-muted-foreground max-w-2xl mx-auto">
              Everything we do is guided by these core principles
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardContent className="pt-8 pb-8">
                <Leaf className="h-12 w-12 mx-auto text-kelp-green mb-4" />
                <h3 className="font-heading font-semibold text-lg mb-2">Sustainability</h3>
                <p className="text-sm text-muted-foreground">
                  Using recycled and eco-friendly materials to minimize our environmental impact
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-8 pb-8">
                <Heart className="h-12 w-12 mx-auto text-ocean-teal mb-4" />
                <h3 className="font-heading font-semibold text-lg mb-2">Craftsmanship</h3>
                <p className="text-sm text-muted-foreground">
                  Every bag is handmade with attention to detail and built to last
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-8 pb-8">
                <Users className="h-12 w-12 mx-auto text-driftwood mb-4" />
                <h3 className="font-heading font-semibold text-lg mb-2">Community</h3>
                <p className="text-sm text-muted-foreground">
                  Supporting local artisans and the global surf community
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-8 pb-8">
                <Award className="h-12 w-12 mx-auto text-kelp-green mb-4" />
                <h3 className="font-heading font-semibold text-lg mb-2">Quality</h3>
                <p className="text-sm text-muted-foreground">
                  Premium materials and construction for maximum board protection
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-kelp-green text-white">
        <div className="container-custom text-center">
          <h2 className="heading-lg mb-4">Ready to Protect Your Board?</h2>
          <p className="body-lg mb-8 max-w-2xl mx-auto opacity-90">
            Browse our collection or get in touch for a custom order
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/shop">Shop Now</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-kelp-green">
              <Link href="/custom-order">Custom Order</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

