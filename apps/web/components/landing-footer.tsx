"use client"

import Link from "next/link"
import { Heart, Instagram, Twitter } from "lucide-react"
import { TbBrandTiktok } from "react-icons/tb" // Using the specific icon you wanted
import { WishlyLogo } from "@/components/wishly-logo" 

export function LandingFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="border-t border-stone-100 bg-stone-50 pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Brand & Socials (The "Fat" part) */}
          <div className="col-span-1 md:col-span-1 space-y-6">
            <div>
              <Link 
                href="/" 
                onClick={scrollToTop} 
                className="flex items-center gap-2 mb-4 hover:opacity-70 transition-opacity"
              >
                <WishlyLogo className="w-8 h-8" />
                <span className="font-serif text-2xl font-bold text-slate-900">Wishly</span>
              </Link>

              <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
                The most beautiful way to curate and share your wishlist. 
                Designed for creators, loved by everyone.
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex gap-3">
              <button className="h-10 w-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-rose-500 hover:border-rose-200 hover:scale-105 transition-all shadow-sm">
                <Instagram className="w-4 h-4" />
              </button>
              <button className="h-10 w-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-rose-500 hover:border-rose-200 hover:scale-105 transition-all shadow-sm">
                <TbBrandTiktok className="w-4 h-4" />
              </button>
              <button className="h-10 w-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-rose-500 hover:border-rose-200 hover:scale-105 transition-all shadow-sm">
                <Twitter className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Column 2: Product */}
          <div>
            <h3 className="font-serif text-slate-900 font-bold mb-6 text-lg">Product</h3>
            <ul className="space-y-4 text-sm text-slate-500">
              <li>
                <Link href="#features" className="hover:text-rose-500 transition-colors">Features</Link>
              </li>
              <li>
                <Link href="#pricing" className="hover:text-rose-500 transition-colors">Pricing</Link>
              </li>
              <li>
                <Link href="#examples" className="hover:text-rose-500 transition-colors">Examples</Link>
              </li>
              <li>
                <Link href="#extension" className="hover:text-rose-500 transition-colors">Chrome Extension</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h3 className="font-serif text-slate-900 font-bold mb-6 text-lg">Company</h3>
            <ul className="space-y-4 text-sm text-slate-500">
              <li>
                <Link href="#about" className="hover:text-rose-500 transition-colors">About</Link>
              </li>
              <li>
                <Link href="#blog" className="hover:text-rose-500 transition-colors">Blog</Link>
              </li>
              <li>
                <Link href="#careers" className="hover:text-rose-500 transition-colors">Careers</Link>
              </li>
              <li>
                <Link href="#contact" className="hover:text-rose-500 transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h3 className="font-serif text-slate-900 font-bold mb-6 text-lg">Legal</h3>
            <ul className="space-y-4 text-sm text-slate-500">
              <li>
                <Link href="#privacy" className="hover:text-rose-500 transition-colors">Privacy</Link>
              </li>
              <li>
                <Link href="#terms" className="hover:text-rose-500 transition-colors">Terms</Link>
              </li>
              <li>
                <Link href="#cookies" className="hover:text-rose-500 transition-colors">Cookie Policy</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom (Separated Layout) */}
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
          <p>© 2024 Wishly Inc. All rights reserved.</p>
          
          <div className="flex items-center gap-1.5">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 animate-pulse" />
            <span>for creators everywhere</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
