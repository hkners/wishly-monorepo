"use client"

import Image from "next/image"
import { Lock, Share2, Instagram, Twitter } from "lucide-react"
import { TbBrandTiktok } from "react-icons/tb"

export function LandingLinkBio() {
  const products = [
    {
      title: "Glossier Balm Dotcom",
      store: "GLOSSIER",
      price: "$14.00",
      color: "from-rose-100 to-rose-50",
      image: "/bio11.png", // Glossier Image
    },
    {
      title: "AirPods Max Silver",
      store: "APPLE",
      price: "$549.00",
      color: "from-slate-100 to-slate-50",
      image: "/bio2.png", // AirPods Image
    },
    {
      title: "Stanley Quencher",
      store: "AMAZON",
      price: "$45.00",
      color: "from-emerald-100 to-emerald-50",
      image: "/bio3.png", // Stanley Image
    },
    {
      title: "Prada Paradoxe",
      store: "SEPHORA",
      price: "$95.00",
      color: "from-amber-100 to-amber-50",
      image: "/bio4.png", // Prada Image
    },
  ]

  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      {/* SECTION HEADER */}
      <div className="text-center mb-12 space-y-4">
        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
          Your Link-in-Bio, <span className="text-primary">But Better</span>
        </h2>
        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          Share your wishlist on Instagram, TikTok, or anywhere. Your followers see beautiful product previews
          instantly.
        </p>
      </div>

      {/* THE BROWSER WINDOW COMPONENT */}
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/60 overflow-hidden border border-slate-100 transition-all duration-500 hover:shadow-3xl hover:scale-[1.005]">
          
          {/* 1. THE BROWSER BAR */}
          <div className="bg-slate-50/80 border-b border-slate-100 px-4 py-3 flex items-center justify-between backdrop-blur-sm sticky top-0 z-20">
            {/* Window Controls */}
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
            </div>
            {/* URL Bar */}
            <div className="flex items-center gap-2 px-4 py-1.5 bg-white rounded-full shadow-sm border border-slate-100 text-xs font-medium text-slate-500">
              <Lock className="w-3 h-3 text-emerald-500" />
              <span className="text-slate-600">wishly.me/sophie_creates</span>
            </div>
            {/* Spacer */}
            <div className="w-10"></div>
          </div>

          {/* 2. THE PROFILE HEADER */}
          <div className="px-8 pt-12 pb-8 text-center bg-gradient-to-b from-slate-50/50 to-white">
            
            {/* Avatar Circle */}
            <div className="relative inline-block mb-5">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-tr from-rose-50 to-orange-50 p-1 shadow-xl shadow-rose-100/50 border-4 border-white">
                 <Image 
                   src="/link-in-bio-profile.png"
                   alt="Profile Avatar"
                   width={128}
                   height={128}
                   className="w-full h-full rounded-full object-cover"
                 />
              </div>
            </div>
            
            {/* Name */}
            <h3 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Sophie Miller
            </h3>
            
            {/* Social Actions Row */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-3 mt-8">
              
              <div className="grid grid-cols-3 gap-2 md:gap-3">
                  <button className="h-11 md:h-12 w-14 md:w-16 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
                    <Instagram className="w-5 h-5" />
                  </button>
                  
                  <button className="h-11 md:h-12 w-14 md:w-16 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
                    <TbBrandTiktok className="w-5 h-5" />
                  </button>

                  <button className="h-11 md:h-12 w-14 md:w-16 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
                    <Twitter className="w-5 h-5" />
                  </button>
              </div>

              <button className="h-11 md:h-12 px-8 rounded-full bg-[#0F172A] text-white font-medium text-sm flex items-center gap-2 hover:bg-black hover:scale-105 transition-all shadow-lg shadow-slate-900/20">
                 <Share2 className="w-4 h-4" />
                 Share List
              </button>
            </div>
          </div>

          {/* 3. THE PRODUCT GRID */}
          <div className="px-6 pb-12 bg-white">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {products.map((product, i) => (
                <div key={i} className="group cursor-pointer flex flex-col gap-3">
                  {/* Image Container */}
                  <div className={`aspect-[4/5] rounded-[2rem] bg-gradient-to-br ${product.color} overflow-hidden relative border border-slate-100/50 shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:shadow-rose-100/50 group-hover:-translate-y-1`}>
                      
                      {/* PRICE PILL */}
                      <div className="absolute bottom-3 right-3 z-20 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-white/50">
                        <span className="text-xs font-bold text-slate-900">{product.price}</span>
                      </div>
                      
                      {/* PRODUCT IMAGE */}
                      <div className="absolute inset-4 flex items-center justify-center">
                        <Image 
                          src={product.image}
                          alt={product.title}
                          width={200}
                          height={200}
                          // mix-blend-multiply is key here - it makes the white background of the JPEGs transparent
                          className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>
                  </div>
                  
                  {/* Product Details */}
                  <div className="px-1 text-center">
                    <h4 className="font-bold text-sm text-slate-900 truncate group-hover:text-rose-500 transition-colors">
                      {product.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                       {product.store}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  )
}
