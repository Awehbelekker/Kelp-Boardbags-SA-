import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Leaf, Heart, Sparkles } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[600px] md:h-[700px] bg-gradient-to-br from-kelp-green to-ocean-teal flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative z-10 container-custom text-center">
          <h1 className="heading-xl mb-6 animate-fade-in">
            Protect Your Board.
            <br />
            <span className="text-sand-beige">Respect the Ocean.</span>
          </h1>

          <p className="body-lg mb-8 max-w-2xl mx-auto text-white/90 animate-slide-in-up">
            Handcrafted, sustainable surfboard bags made in Cape Town.
            Built to last, designed to protect.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-in-up">
            <Button asChild size="lg" variant="default" className="bg-white text-kelp-green hover:bg-sand-beige hover:text-kelp-green">
              <Link href="/shop">
                Shop All Bags
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>

            <Button asChild size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-kelp-green transition-all">
              <Link href="/custom-order">
                Build Custom Bag
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border-kelp-green/20">
              <CardHeader>
                <Leaf className="h-12 w-12 mx-auto text-kelp-green mb-4" />
                <CardTitle className="heading-sm">Sustainable Materials</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Made from recycled and eco-friendly materials. Every bag helps reduce ocean waste.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-ocean-teal/20">
              <CardHeader>
                <Heart className="h-12 w-12 mx-auto text-ocean-teal mb-4" />
                <CardTitle className="heading-sm">Handcrafted Quality</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Each bag is carefully crafted by skilled artisans in Cape Town with attention to detail.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-driftwood/20">
              <CardHeader>
                <Sparkles className="h-12 w-12 mx-auto text-driftwood mb-4" />
                <CardTitle className="heading-sm">Custom Options</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Need a specific size or design? We create custom bags tailored to your board.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="section-padding bg-sand-beige/30">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-lg mb-4">Bestsellers</h2>
            <p className="body-lg text-muted-foreground max-w-2xl mx-auto">
              Our most popular bags, loved by surfers around the world.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Placeholder product cards - will be replaced with actual products */}
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="overflow-hidden card-hover">
                <div className="relative aspect-square bg-sand-beige">
                  {/* Placeholder for product image */}
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    Product Image
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">Classic Shortboard Bag</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Perfect protection for your daily driver
                  </p>
                  <p className="text-2xl font-bold text-kelp-green">R1,250</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link href="/shop">View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline">
              <Link href="/shop">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-kelp-green text-white">
        <div className="container-custom text-center">
          <h2 className="heading-lg mb-4">Need a Custom Bag?</h2>
          <p className="body-lg mb-8 max-w-2xl mx-auto text-white/90">
            We craft custom bags for any board size or shape. Tell us what you need,
            and we'll create the perfect protection for your ride.
          </p>
          <Button asChild size="lg" variant="default" className="bg-white text-kelp-green hover:bg-sand-beige">
            <Link href="/custom-order">
              Start Custom Order
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Social Proof / About Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="heading-lg mb-4">Made in Cape Town, Loved Worldwide</h2>
              <p className="body-base text-muted-foreground mb-6">
                Since our founding, we've been dedicated to creating the finest surfboard
                bags using sustainable materials and traditional craftsmanship. Each bag
                tells a story of our commitment to quality and the ocean.
              </p>
              <p className="body-base text-muted-foreground mb-6">
                From local surfers at Muizenberg to international travelers, our bags have
                protected boards on waves around the world.
              </p>
              <Button asChild variant="outline">
                <Link href="/about">
                  Read Our Story
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div className="relative aspect-square bg-sand-beige rounded-lg">
              {/* Placeholder for about image */}
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                Workshop / Craftsmanship Image
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
