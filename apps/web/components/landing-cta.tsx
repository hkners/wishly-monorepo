"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

export function LandingCTA() {
  return (
    <section className="container mx-auto px-4 py-24 pb-32">
      <div className="max-w-5xl mx-auto">
        {/* CHANGED: 
            - Removed dark bg-[#0F172A]
            - Added white background with subtle gradient
            - Added border-rose-100 for that premium outline look 
        */}
        <div className="relative bg-gradient-to-b from-white to-rose-50/50 rounded-[3rem] p-12 md:p-24 text-center overflow-hidden shadow-xl border border-rose-100/50">
           
           {/* BACKGROUND DECORATION (The "Hero" Blobs are back) */}
           {/* Top Right Pink Blob */}
           <div className="absolute top-0 right-0 w-96 h-96 bg-rose-200/30 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
           {/* Bottom Left Orange/Blue Blob */}
           <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200/30 rounded-full blur-[100px] pointer-events-none translate-y-1/2 -translate-x-1/2"></div>
           
           {/* CONTENT CONTAINER */}
           <div className="relative z-10 space-y-8 flex flex-col items-center">
             
             {/* Small Badge - Changed from transparent white to soft rose pill */}
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100/50 text-rose-600 text-sm font-medium border border-rose-200/50 mb-4">
                <Sparkles className="w-4 h-4" />
                <span>Join the movement</span>
             </div>

             {/* Headline - Changed from White to Slate-900 */}
             <h2 className="font-serif text-4xl md:text-6xl font-bold text-slate-900 leading-[1.1] tracking-tight">
               Ready to reimagine <br className="hidden md:block"/>
               your wishlist?
             </h2>

             {/* Subtext - Changed from Slate-300 to Slate-600 */}
             <p className="text-slate-600 text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
               Join 10,000+ creators who are sharing their favorite finds in style. 
               Create your free bio link today.
             </p>
             
             {/* Button - Kept the Brand Rose color for the main action */}
             <div className="pt-6">
               <Link href="/auth">
                 <Button className="h-14 md:h-16 px-10 rounded-full bg-rose-400 hover:bg-rose-500 text-white text-lg font-bold transition-all shadow-xl shadow-rose-200 hover:shadow-2xl hover:scale-105">
                   Claim Your Username 
                   <ArrowRight className="ml-2 w-5 h-5" />
                 </Button>
               </Link>
             </div>
             
             {/* Micro-copy */}
             <p className="text-xs text-slate-400 font-medium tracking-widest uppercase opacity-80 pt-2">
               No credit card required • Free forever plan available
             </p>
           </div>
        </div>
      </div>
    </section>
  )
}
