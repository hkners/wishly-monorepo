"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LogOut, Menu, X, User as UserIcon, ArrowRight } from "lucide-react"
import { WishlyLogo } from "@/components/wishly-logo"
import { createClient } from "@wishly/db/web"
import type { User } from "@supabase/supabase-js"

interface GlobalHeaderProps {
  variant?: "landing" | "app"
}

export function GlobalHeader({ variant = "landing" }: GlobalHeaderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [supabase] = useState(() => createClient())

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", user.id)
          .maybeSingle()

        if (profile?.username) {
          setUsername(profile.username)
        }
      }
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-100 bg-white/80 backdrop-blur-xl transition-all">
      {/* FIX 1: Increased vertical padding (py-4) to make the bar taller 
         FIX 2: Kept max-w-6xl so sides are constrained
      */}
      <div className="max-w-6xl mx-auto px-6 py-4">
        
        {/* FIX 3: Increased nav height from h-10 to h-14 */}
        <nav className="flex items-center justify-between h-14">
          
          {/* --- Logo --- */}
          <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-70">
            {/* FIX 4: Increased Logo Size (w-10 h-10) */}
            <WishlyLogo className="w-10 h-10" />
            
            {/* FIX 5: Increased Font Size (text-2xl) */}
            <span className="font-serif text-2xl font-bold tracking-tight text-stone-800 hidden sm:block">
              Wishly
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {/* --- Desktop Navigation (Hidden on Mobile) --- */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <>
                  <Link href={username ? `/${username}` : "/onboarding"}>
                    <Button variant="ghost" className="rounded-full h-11 px-5 text-base text-stone-600 hover:bg-stone-50 hover:text-stone-900">
                      <UserIcon className="w-5 h-5 mr-2" />
                      {username ? `@${username}` : "Profile"}
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    className="rounded-full h-11 px-5 text-base text-stone-500 hover:text-rose-500 hover:bg-rose-50"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth">
                    {/* Increased button height/padding slightly to match new header scale */}
                    <Button className="rounded-full bg-rose-400 hover:bg-rose-500 text-white shadow-sm px-7 h-11 text-base transition-all duration-300 ease-out hover:shadow-rose-200 hover:shadow-md">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* --- MOBILE VISIBLE CTA --- */}
            <div className="md:hidden flex items-center gap-3">
              {!user && (
                 <Link href="/auth">
                   <Button size="sm" className="rounded-full bg-rose-400 hover:bg-rose-500 text-white text-xs px-5 h-10 font-medium shadow-sm">
                     Get Started
                   </Button>
                 </Link>
              )}
              
              <button
                className="p-2 text-stone-500 hover:bg-stone-50 hover:text-stone-800 rounded-full transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
              </button>
            </div>
          </div>
        </nav>

        {/* --- Mobile Menu Dropdown --- */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-md border-b border-stone-100 shadow-sm animate-in slide-in-from-top-2">
            <div className="flex flex-col p-5 gap-4">
              {user ? (
                <>
                  <Link href={username ? `/${username}` : "/onboarding"} onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="secondary" className="w-full justify-start rounded-xl h-14 text-lg bg-stone-50 text-stone-700 hover:bg-stone-100">
                      <UserIcon className="w-5 h-5 mr-3" />
                      My List
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-xl h-14 text-lg"
                    onClick={() => {
                      handleSignOut()
                      setMobileMenuOpen(false)
                    }}
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full rounded-xl bg-rose-400 hover:bg-rose-500 text-white h-14 text-lg shadow-sm">
                      Create Account <ArrowRight className="w-5 h-5 ml-2 opacity-80" />
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
