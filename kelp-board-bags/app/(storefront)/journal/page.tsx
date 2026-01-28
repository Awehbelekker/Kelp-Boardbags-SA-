import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Calendar, ArrowRight } from "lucide-react"

export const metadata = {
  title: 'Journal | Kelp Board Bags',
  description: 'Stories from the surf, sustainability insights, and behind-the-scenes at Kelp Board Bags.',
}

// Placeholder blog posts - will be replaced with actual CMS content
const blogPosts = [
  {
    id: 1,
    title: 'The Art of Handcrafting Surfboard Bags',
    excerpt: 'Take a behind-the-scenes look at our workshop in Cape Town and discover the craftsmanship that goes into every Kelp Board Bag.',
    image: '/images/hero-bag.jpg',
    category: 'Craftsmanship',
    date: '2026-01-15',
    slug: 'art-of-handcrafting-surfboard-bags',
  },
  {
    id: 2,
    title: 'Sustainable Materials: Our Commitment to the Ocean',
    excerpt: 'Learn about the eco-friendly materials we use and how we're working to reduce our environmental impact while protecting your boards.',
    image: '/images/hero-bag.jpg',
    category: 'Sustainability',
    date: '2026-01-10',
    slug: 'sustainable-materials-commitment',
  },
  {
    id: 3,
    title: 'Choosing the Right Board Bag: A Complete Guide',
    excerpt: 'Not sure which bag is right for your board? This comprehensive guide will help you make the perfect choice for your surfing needs.',
    image: '/images/hero-bag.jpg',
    category: 'Guides',
    date: '2026-01-05',
    slug: 'choosing-right-board-bag-guide',
  },
]

export default function JournalPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[300px] bg-gradient-to-br from-kelp-green to-ocean-teal flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 container-custom text-center">
          <h1 className="heading-xl mb-4">The Journal</h1>
          <p className="body-lg max-w-2xl mx-auto">
            Stories from the surf, sustainability insights, and behind-the-scenes
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          {/* Featured Post */}
          {blogPosts[0] && (
            <Card className="mb-12 overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative aspect-video lg:aspect-auto">
                  <Image
                    src={blogPosts[0].image}
                    alt={blogPosts[0].title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-xs font-semibold text-kelp-green uppercase">
                      {blogPosts[0].category}
                    </span>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {new Date(blogPosts[0].date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                  <h2 className="heading-lg mb-4">{blogPosts[0].title}</h2>
                  <p className="text-muted-foreground mb-6">{blogPosts[0].excerpt}</p>
                  <div>
                    <Button asChild>
                      <Link href={`/journal/${blogPosts[0].slug}`}>
                        Read More
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Recent Posts Grid */}
          <div className="mb-8">
            <h2 className="heading-md mb-6">Recent Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.slice(1).map((post) => (
                <Card key={post.id} className="overflow-hidden flex flex-col">
                  <div className="relative aspect-video">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-xs font-semibold text-kelp-green uppercase">
                        {post.category}
                      </span>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                    </div>
                    <h3 className="font-heading font-semibold text-lg line-clamp-2">
                      {post.title}
                    </h3>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {post.excerpt}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="ghost" className="w-full">
                      <Link href={`/journal/${post.slug}`}>
                        Read More
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>

          {/* Coming Soon Message */}
          <div className="text-center py-12 bg-sand-beige/30 rounded-lg">
            <h3 className="font-heading font-semibold text-xl mb-2">
              More Stories Coming Soon
            </h3>
            <p className="text-muted-foreground mb-6">
              We're working on bringing you more content about surfing, sustainability, and our craft.
            </p>
            <Button asChild variant="outline">
              <Link href="/shop">
                Shop Our Collection
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

