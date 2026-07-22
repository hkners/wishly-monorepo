"use client"

import { Instagram, Twitter, Youtube, Linkedin } from "lucide-react"
import { TbBrandTiktok, TbBrandPinterest } from "react-icons/tb"

export function LandingLogoCloud() {
  const logos = [
    { name: "Instagram", icon: Instagram },
    { name: "TikTok", icon: TbBrandTiktok },
    { name: "YouTube", icon: Youtube },
    { name: "Pinterest", icon: TbBrandPinterest },
    { name: "Twitter", icon: Twitter },
  ]

  return (
    <section className="border-y border-stone-100 bg-stone-50/50 py-10">
      <div className="container mx-auto px-4 text-center">
        <p className="text-xs font-bold text-stone-400 mb-8 tracking-widest uppercase">
          Works perfectly with
        </p>
        
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {logos.map((logo, i) => (
            <div key={i} className="group flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity duration-300">
              <logo.icon className="w-6 h-6 md:w-8 md:h-8 text-stone-600 group-hover:text-rose-500 transition-colors" />
              <span className="hidden md:block font-serif text-xl font-bold text-stone-600 group-hover:text-slate-900 transition-colors">
                {logo.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
