"use client"

import Image from "next/image"
import { Star, Check } from "lucide-react"

export function InfluencerProof() {
  const testimonials = [
    {
      name: "Emma Chen",
      username: "@emmaesthetic",
      text: "My followers loved this! So much easier than link trees. The auto-fetch feature is a lifesaver.",
      image: "/user1.png", 
    },
    {
      name: "Sophie Rodriguez",
      username: "@sophstyle",
      text: "Got 50+ gifts for my birthday. This app is magic! I love how it looks on mobile.",
      image: "/user2.png", 
    },
    {
      name: "Lily Zhang",
      username: "@lilylife",
      text: "Perfect for my wedding registry. Clean, beautiful, and my grandma figured it out instantly.",
      image: "/user3.png", 
    },
  ]

  return (
    <section className="container mx-auto px-4 py-24">
      
      {/* HEADER: Minimal and Serif */}
      <div className="text-center mb-16 space-y-4">
        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900">
          Loved by Creators
        </h2>
        <p className="text-slate-500 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
          Join thousands of influencers sharing their wishlists
        </p>
      </div>

      {/* REVIEWS GRID */}
      <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
        {testimonials.map((testimonial, i) => (
          <div 
            key={i} 
            className="group bg-white rounded-[2rem] p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-500 ease-out"
          >
            
            {/* PROFILE HEADER */}
            <div className="flex items-center gap-4 mb-6">
              {/* Avatar with Ring */}
              <div className="relative w-14 h-14 shrink-0">
                <div className="absolute inset-0 rounded-full border-2 border-rose-100 scale-110 group-hover:scale-125 transition-transform duration-500"></div>
                <Image 
                  src={testimonial.image}
                  alt={testimonial.name}
                  width={56}
                  height={56}
                  className="rounded-full object-cover border border-white shadow-sm relative z-10"
                />
              </div>
              
              {/* Name & Handle */}
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-900 leading-tight text-lg">
                    {testimonial.name}
                  </span>
                  {/* The Black Verified Badge - Matches the Bio Section */}
                  <div className="bg-black text-white p-0.5 rounded-full">
                    <Check className="w-2.5 h-2.5" strokeWidth={4} />
                  </div>
                </div>
                <div className="text-sm text-rose-500 font-medium tracking-wide">
                  {testimonial.username}
                </div>
              </div>
            </div>

            {/* STAR RATING - Soft Amber */}
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-300 text-amber-300" />
              ))}
            </div>

            {/* THE QUOTE */}
            <p className="text-slate-600 leading-relaxed text-base font-medium">
              "{testimonial.text}"
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
