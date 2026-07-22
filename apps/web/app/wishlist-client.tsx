"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { createClient } from "@wishly/db/web"
import type { User } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Plus, Gift, X, Share2, Instagram, Twitter, ExternalLink, Sparkles } from "lucide-react"
import { TbBrandTiktok } from "react-icons/tb"
import { toast } from "@/hooks/use-toast"
import { GlobalHeader } from "@/components/global-header"

// --- Types ---
interface WishlistItem {
  id: string
  title: string
  image_url: string | null
  price: string | null
  original_url: string
  created_at: string
}

interface Profile {
  id: string
  username: string
  full_name: string | null
  avatar_url: string | null
  bio?: string
}

interface ScrapedData {
  title: string
  imageUrl: string | null
  price: string | null
  originalUrl: string
}

interface WishlistClientProps {
  user?: User | null
  initialItems?: WishlistItem[]
  profile?: Profile
  isOwner?: boolean
}

// Improved Gradients - Soft, high-end pastels
const getGradient = (id: string) => {
  const gradients = [
    "bg-[#FFF0F5]", // Soft Pink
    "bg-[#F0F8FF]", // Alice Blue
    "bg-[#F5F5DC]", // Beige
    "bg-[#F0FFF0]", // Honeydew
    "bg-[#FFF5EE]", // Seashell
  ]
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % gradients.length
  return gradients[index]
}

function tryGetDomain(url: string) {
  try {
    const hostname = new URL(url).hostname
    return hostname.replace("www.", "").split(".")[0]
  } catch (e) {
    return "Link"
  }
}

export default function WishlistClient({ user, initialItems = [], profile, isOwner = false }: WishlistClientProps) {
  // --- State ---
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<ScrapedData | null>(null)
  const [items, setItems] = useState<WishlistItem[]>(initialItems)
  const [fetchingItems, setFetchingItems] = useState(false)
  const [supabase] = useState(() => createClient())

  // --- Effects ---
  useEffect(() => {
    if (initialItems.length === 0 && user && !profile && supabase) {
      setFetchingItems(true)
      fetchItems()
    }
  }, [user, profile, supabase])

  // --- Handlers ---
  const fetchItems = async () => {
    if (!supabase) return
    try {
      const userId = profile?.id || user?.id
      if (!userId) return
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
      if (error) throw error
      setItems(data || [])
    } catch (error) {
      console.error("Error fetching items:", error)
      toast({ title: "Error", description: "Failed to load items.", variant: "destructive" })
    } finally {
      setFetchingItems(false)
    }
  }

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return
    setLoading(true)
    setPreview(null)
    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Failed to fetch product details")
      setPreview(data)
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleAddItem = async () => {
    if (!preview || !user || !supabase) return
    try {
      const { data, error } = await supabase
        .from("items")
        .insert({
          title: preview.title,
          image_url: preview.imageUrl,
          price: preview.price,
          original_url: preview.originalUrl,
          user_id: user.id,
        })
        .select()
        .single()
      if (error) throw error
      toast({ title: "Success", description: "Added to your collection!" })
      setPreview(null)
      setUrl("")
      if (data) setItems([data, ...items])
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    }
  }

  const handleDeleteItem = async (itemId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!supabase || !isOwner) return
    try {
      const { error } = await supabase.from("items").delete().eq("id", itemId)
      if (error) throw error
      setItems(items.filter((item) => item.id !== itemId))
      toast({ title: "Removed", description: "Item removed." })
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    }
  }

  const displayName = profile?.full_name || profile?.username || "Sophie Miller"

  return (
    <div className="min-h-screen bg-[#FDFCF8] font-sans selection:bg-rose-100 pb-24 relative overflow-hidden">
      
      {/* --- TEXTURE OVERLAY --- */}
      <div className="fixed inset-0 opacity-[0.35] mix-blend-multiply pointer-events-none z-0" 
           style={{ backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")` }}>
      </div>

      {/* --- DECORATIVE BLUR --- */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-rose-100/40 blur-[100px] rounded-full pointer-events-none z-0" />

      <div className="relative z-10">
        <GlobalHeader variant="app" />

        <main className="mx-auto max-w-6xl px-4 sm:px-6 py-4 md:py-8">
          
          {/* --- RESPONSIVE PROFILE HEADER --- */}
          {/* Added 'relative' for absolute positioning of mobile share button */}
          {/* Changed 'flex-col' to 'flex-row' always, but tightened gap/padding on mobile */}
          <div className="relative flex flex-row items-center md:items-start gap-4 md:gap-8 mb-8 md:mb-12 animate-in fade-in slide-in-from-top-4 duration-700 bg-white/40 backdrop-blur-sm p-4 md:p-6 rounded-[2rem] border border-white shadow-sm">
            
            {/* Mobile Share Button (Absolute Top Right) */}
            <div className="md:hidden absolute top-3 right-3 z-20">
               <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-white/50 hover:bg-white border border-white/50">
                  <Share2 className="h-4 w-4 text-slate-600" />
               </Button>
            </div>

            {/* Avatar (Smaller on mobile: w-16 vs w-24) */}
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-gradient-to-tr from-rose-200 to-indigo-200 rounded-full blur-lg opacity-40"></div>
              <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-white p-1 relative z-10 shadow-sm ring-1 ring-slate-100">
                 {profile?.avatar_url ? (
                   <img src={profile.avatar_url} alt="avatar" className="w-full h-full rounded-full object-cover" />
                 ) : (
                   <div className="w-full h-full rounded-full bg-stone-50 flex items-center justify-center text-stone-300">
                      <span className="text-2xl md:text-4xl">🌸</span>
                   </div>
                 )}
              </div>
            </div>

            {/* Content (Left Aligned always) */}
            <div className="flex-1 text-left space-y-1 md:space-y-3">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4 pr-8 md:pr-0">
                 <div>
                    {/* Smaller text on mobile: text-xl vs text-4xl */}
                    <h1 className="font-serif text-xl md:text-4xl font-medium text-slate-900 tracking-tight leading-tight">
                        {displayName}
                    </h1>
                    {profile?.bio && (
                        <p className="text-stone-500 text-xs md:text-base leading-relaxed mt-0.5 md:mt-1 max-w-lg line-clamp-2 md:line-clamp-none">
                            {profile.bio}
                        </p>
                    )}
                 </div>

                 {/* Share Button (Desktop Only) */}
                 <Button 
                    className="hidden md:flex h-10 px-6 rounded-full bg-slate-900 text-white font-medium text-sm items-center gap-2 hover:bg-black transition-all hover:-translate-y-0.5 shadow-lg shadow-slate-900/10 shrink-0"
                  >
                     <Share2 className="w-4 h-4" />
                     Share
                 </Button>
              </div>

              {/* Social Icons (Smaller on mobile) */}
              <div className="flex justify-start items-center gap-2 pt-0.5 md:pt-1">
                 <Button variant="outline" size="icon" className="rounded-full w-8 h-8 md:w-9 md:h-9 border-stone-200 bg-white hover:bg-stone-50 hover:border-stone-300 text-slate-700 transition-all" asChild>
                   <a href="#" target="_blank"><Instagram className="h-3.5 w-3.5 md:h-4 md:w-4" /></a>
                 </Button>
                 <Button variant="outline" size="icon" className="rounded-full w-8 h-8 md:w-9 md:h-9 border-stone-200 bg-white hover:bg-stone-50 hover:border-stone-300 text-slate-700 transition-all" asChild>
                    <a href="#" target="_blank"><TbBrandTiktok className="h-3.5 w-3.5 md:h-4 md:w-4" /></a>
                 </Button>
                 <Button variant="outline" size="icon" className="rounded-full w-8 h-8 md:w-9 md:h-9 border-stone-200 bg-white hover:bg-stone-50 hover:border-stone-300 text-slate-700 transition-all" asChild>
                   <a href="#" target="_blank"><Twitter className="h-3.5 w-3.5 md:h-4 md:w-4" /></a>
                 </Button>
              </div>
            </div>
          </div>

          {/* --- OWNER INPUT --- */}
          {isOwner && (
            <div className="max-w-xl mx-auto mb-12 md:mb-16 relative z-20">
              <form onSubmit={handleScrape} className="relative group">
                <Input
                  placeholder="Paste a link to collect..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={loading}
                  className="relative rounded-full border-transparent bg-white/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] text-base h-14 md:h-16 pl-6 md:pl-8 pr-16 md:pr-20 
                             focus-visible:ring-0 focus-visible:shadow-[0_0_0_4px_rgba(251,113,133,0.1),0_10px_40px_-10px_rgba(251,113,133,0.3)] 
                             placeholder:text-stone-400 text-slate-800 transition-all duration-300 hover:shadow-[0_8px_40px_rgba(0,0,0,0.06)]"
                />
                <Button
                  type="submit"
                  disabled={loading || !url}
                  className="absolute right-2 top-2 bottom-2 rounded-full w-12 md:w-20 bg-gradient-to-r from-rose-300 to-rose-400 hover:from-rose-400 hover:to-rose-500 text-white shadow-md transition-all"
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5 md:h-6 md:w-6" />}
                </Button>
              </form>

              {/* Preview Card */}
              {preview && (
                <div className="mt-6 md:mt-8 relative bg-white rounded-3xl p-4 md:p-6 shadow-2xl shadow-rose-100/50 border border-stone-100 animate-in slide-in-from-bottom-4">
                  <button
                    className="absolute -top-2 -right-2 md:-top-3 md:-right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 hover:text-red-500 transition-colors border border-stone-50"
                    onClick={() => setPreview(null)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center md:items-start">
                    {preview.imageUrl && (
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden bg-stone-50 border border-stone-100 shrink-0">
                        <img src={preview.imageUrl || "/placeholder.svg"} alt="preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 space-y-2 text-center md:text-left">
                      <h3 className="font-serif text-lg md:text-xl text-slate-900 leading-snug">{preview.title}</h3>
                      <p className="text-rose-500 font-medium text-base md:text-lg font-mono">{preview.price}</p>
                      <Button onClick={handleAddItem} className="w-full md:w-auto rounded-full bg-slate-900 mt-2">Add to Wishlist</Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* --- WISHLIST GRID (The "Frame" Layout) --- */}
          <section>
            {fetchingItems ? (
              <div className="flex justify-center py-24">
                <Loader2 className="h-8 w-8 animate-spin text-stone-300" />
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-32 opacity-60">
                 <div className="mx-auto mb-6 w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center text-stone-300">
                   <Sparkles className="w-10 h-10" />
                 </div>
                <h3 className="text-2xl font-serif text-slate-900 mb-2">Start your collection</h3>
                <p className="text-stone-500 font-medium">Paste a URL above to save your first treasure.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
                {items.map((item) => (
                  <a
                    key={item.id}
                    href={item.original_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col relative"
                  >
                    {/* Card Outer Shell (The Gradient Frame) */}
                    <div className={`relative aspect-[3/4] ${getGradient(item.id)} rounded-[1.5rem] md:rounded-[2rem] p-2 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-lg border border-white/60`}>
                      
                      {/* Delete (Owner) */}
                      {isOwner && (
                        <button
                          className="absolute -top-1 -right-1 z-30 p-1.5 md:p-2 rounded-full bg-white shadow-md text-slate-400 hover:text-red-500 hover:scale-110 transition-all"
                          onClick={(e) => handleDeleteItem(item.id, e)}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}

                      {/* Inner White Container (The "Photo") - Top 75% */}
                      <div className="relative w-full h-[72%] bg-white rounded-[1rem] md:rounded-[1.5rem] overflow-hidden flex items-center justify-center p-3 md:p-4 shadow-inner">
                          
                          {/* Domain Badge (Inside White) */}
                          <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-stone-50/90 backdrop-blur-sm px-1.5 py-0.5 md:px-2 md:py-1 rounded-md border border-stone-100 z-10">
                             <p className="text-[8px] md:text-[9px] font-bold tracking-widest uppercase text-stone-400">
                                {tryGetDomain(item.original_url)}
                             </p>
                          </div>

                          {/* Image */}
                          {item.image_url ? (
                            <img
                              src={item.image_url || "/placeholder.svg"}
                              alt={item.title}
                              className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105" 
                            />
                          ) : (
                            <Gift className="h-10 w-10 text-stone-200" />
                          )}

                          {/* Price Tag (Inside White - Bottom Right) */}
                          {item.price && (
                             <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 bg-slate-900 text-white px-2 py-0.5 md:px-3 md:py-1 rounded-full shadow-md z-10">
                                <span className="text-[9px] md:text-[10px] font-bold tracking-wide">
                                  {item.price}
                                </span>
                             </div>
                          )}
                      </div>

                      {/* Text Area (The Gradient Bottom) - Bottom 25% */}
                      <div className="absolute bottom-0 left-0 right-0 top-[72%] flex items-center justify-center px-3 text-center">
                          <h3 className="font-serif text-slate-900 leading-tight line-clamp-2 text-xs md:text-sm group-hover:text-rose-600 transition-colors">
                            {item.title}
                          </h3>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </section>
        </main>

        {/* Mobile FAB */}
        {isOwner && (
          <button
            onClick={() => {
              document.querySelector("input")?.focus()
              window.scrollTo({ top: 0, behavior: "smooth" })
            }}
            className="fixed bottom-6 right-6 md:hidden w-14 h-14 rounded-full bg-slate-900 text-white shadow-xl shadow-slate-900/30 flex items-center justify-center z-40 active:scale-90 transition-transform"
          >
            <Plus className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  )
}
