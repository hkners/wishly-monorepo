import { Card, CardContent } from '@/components/ui/card'
import { Link2, Share2, Sparkles, Zap } from 'lucide-react'

const features = [
  {
    icon: Link2,
    title: 'Instant Previews',
    description: 'Paste any product URL and get a beautiful preview with image, title, price, and description automatically.',
  },
  {
    icon: Sparkles,
    title: 'Rich Product Data',
    description: 'Our smart scraper extracts all the important details from popular shopping sites automatically.',
  },
  {
    icon: Share2,
    title: 'Easy Sharing',
    description: 'Share your wishlist with a simple link. Friends and family can view your wishlist without signing up.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Built for speed with modern technology. Create and share wishlists in seconds, not minutes.',
  },
]

export function LandingFeatures() {
  return (
    <section id="features" className="container mx-auto px-4 py-24 md:py-32">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">
          Everything you need for the perfect wishlist
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
          Create beautiful, shareable wishlists in seconds with automatic product previews and seamless sharing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <Card key={index} className="border-border bg-card hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
