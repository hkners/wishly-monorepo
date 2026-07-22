"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight } from "lucide-react"

export function LandingHero() {
  const scrollToExamples = () => {
    const element = document.getElementById("trending-gifts")
    element?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    /* FIX APPLIED: 
       - Changed 'py-12 md:py-24 lg:py-32' to specific top/bottom paddings.
       - 'pt-8 md:pt-12 lg:pt-20': Reduces top space so it sits closer to header.
       - 'pb-12 md:pb-24 lg:pb-32': Keeps the bottom space airy.
    */
    <section className="relative w-full overflow-hidden pt-8 md:pt-12 lg:pt-20 pb-12 md:pb-24 lg:pb-32">
      
      <div className="max-w-6xl mx-auto px-6">
        
        <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* LEFT COLUMN (TEXT) */}
          <div className="space-y-8 lg:col-span-5">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 text-primary text-sm font-medium hover-lift">
              <Sparkles className="w-4 h-4 animate-pulse-soft" />
              <span>Join 10K+ creators</span>
            </div>

            <h1 className="font-serif text-5xl md:text-6xl font-bold leading-tight tracking-tight lg:text-7xl">
              Your Wishlist, <span className="text-primary">Reimagined</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
              Create beautiful, shareable wishlists that your followers will actually love. Perfect for birthdays,
              weddings, or just because.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full w-full sm:w-auto border-2 bg-rose-400 text-white border-rose-400 hover:bg-rose-500 hover:border-rose-500 hover:text-white px-8 h-12"
                >
                  Claim Your Username
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* RIGHT COLUMN (IMAGE) */}
          <div className="relative flex justify-center items-center lg:col-span-7 group perspective-1000">
            {/* BACKGROUND BLOBS */}
            <div className="absolute -top-12 -right-20 w-72 h-72 lg:w-96 lg:h-96 bg-rose-200/40 rounded-full blur-3xl animate-pulse-soft transition-opacity duration-500 group-hover:opacity-40"></div>
            <div className="absolute -bottom-12 -left-12 w-72 h-72 lg:w-96 lg:h-96 bg-orange-200/40 rounded-full blur-3xl animate-pulse-soft transition-opacity duration-500 group-hover:opacity-40"></div>

            {/* IMAGE CONTAINER */}
            <div className="relative z-10 w-full max-w-[500px] lg:max-w-none transition-all duration-500 hover:scale-[1.01]">
              <Image
                src="/hero7.png"
                alt="Wishlist App Interface showing products like iPad, Nike sneakers, and more"
                width={1000}
                height={1400}
                priority
                className="w-full h-auto object-contain drop-shadow-2xl [mask-image:linear-gradient(to_bottom,black_75%,transparent)]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
