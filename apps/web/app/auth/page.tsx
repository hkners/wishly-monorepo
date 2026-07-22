"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { createClient } from "@wishly/db/web"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Mail, Lock, AtSign, Instagram, Apple, ArrowRight, Star, Check } from "lucide-react"
import { TbBrandTiktok } from "react-icons/tb"
import { WishlyLogo } from "@/components/wishly-logo"
import { toast } from "@/hooks/use-toast"

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("signup")
  const [supabase, setSupabase] = useState<any>(null)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const client = createClient()
    setSupabase(client)

    const checkUser = async () => {
      const {
        data: { user },
      } = await client.auth.getUser()
      if (user) {
        const { data: profile } = await client.from("profiles").select("username").eq("id", user.id).maybeSingle()
        if (profile?.username) {
          window.location.href = `/${profile.username}`
        }
      }
      setIsChecking(false)
    }
    checkUser()
  }, [])

  if (isChecking || !supabase) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-[#FFFCF8]">
        <Loader2 className="h-8 w-8 animate-spin text-rose-300" />
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2">
      
      {/* --- LEFT PANEL (Aesthetic Editorial) --- */}
      <div className="hidden lg:flex relative flex-col justify-between overflow-hidden bg-[#FDFCF8] border-r border-[#F0EFEA]">
        
        {/* 1. BACKGROUND LAYERS */}
        
        {/* A. Grain Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.4] mix-blend-multiply pointer-events-none z-[2]" 
             style={{ backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")` }}>
        </div>

        {/* B. Floating Items Grid (Using bio1-4.png) */}
        {/* We use a tilted grid of "Cards" to display the items like a wishlist collection */}
        <div className="absolute inset-0 z-0 grid grid-cols-2 gap-8 px-12 opacity-[0.4] -rotate-6 scale-110 pointer-events-none overflow-hidden">
           
           {/* Column 1 - Slow Scroll Up */}
           <div className="space-y-8 animate-scroll-slow">
              {/* Item Card 1 */}
              <div className="aspect-[4/5] rounded-3xl bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-6 flex items-center justify-center border border-stone-50">
                 <img src="/bio1.png" alt="Item 1" className="w-full h-full object-contain drop-shadow-sm transition-transform hover:scale-105 duration-700" />
              </div>
              {/* Item Card 2 */}
              <div className="aspect-[4/5] rounded-3xl bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-6 flex items-center justify-center border border-stone-50">
                 <img src="/bio2.png" alt="Item 2" className="w-full h-full object-contain drop-shadow-sm transition-transform hover:scale-105 duration-700" />
              </div>
              {/* Duplicate for infinite loop feel */}
              <div className="aspect-[4/5] rounded-3xl bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-6 flex items-center justify-center border border-stone-50">
                 <img src="/bio1.png" alt="Item 1" className="w-full h-full object-contain drop-shadow-sm" />
              </div>
           </div>

           {/* Column 2 - Slow Scroll Up (Offset) */}
           <div className="space-y-8 -mt-24 animate-scroll-slow" style={{ animationDuration: '35s' }}>
              {/* Item Card 3 */}
              <div className="aspect-[4/5] rounded-3xl bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-6 flex items-center justify-center border border-stone-50">
                 <img src="/bio3.png" alt="Item 3" className="w-full h-full object-contain drop-shadow-sm transition-transform hover:scale-105 duration-700" />
              </div>
              {/* Item Card 4 */}
              <div className="aspect-[4/5] rounded-3xl bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-6 flex items-center justify-center border border-stone-50">
                 <img src="/bio4.png" alt="Item 4" className="w-full h-full object-contain drop-shadow-sm transition-transform hover:scale-105 duration-700" />
              </div>
               {/* Duplicate for infinite loop feel */}
               <div className="aspect-[4/5] rounded-3xl bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-6 flex items-center justify-center border border-stone-50">
                 <img src="/bio3.png" alt="Item 3" className="w-full h-full object-contain drop-shadow-sm" />
              </div>
           </div>

           {/* Gradient Overlay to fade the items at top/bottom */}
           <div className="absolute inset-0 bg-gradient-to-b from-[#FDFCF8] via-transparent to-[#FDFCF8] z-10"></div>
        </div>

        {/* C. Soft Aura Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[700px] h-[700px] bg-rose-200/40 rounded-full blur-[120px] animate-pulse-slow pointer-events-none z-[1]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-200/30 rounded-full blur-[120px] animate-pulse-slow delay-700 pointer-events-none z-[1]"></div>

        {/* 2. FOREGROUND CONTENT */}
        
        {/* Logo */}
        <div className="relative z-20 p-12">
          <Link href="/" className="flex items-center gap-2 w-fit hover:opacity-80 transition-opacity">
            <WishlyLogo className="w-8 h-8 text-rose-500" /> 
            <span className="font-serif text-2xl font-bold text-stone-800 tracking-tight">Wishly</span>
          </Link>
        </div>

        {/* Center Visual: Glass Card + Floating Elements */}
        <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-12">
          
          {/* Decorative Blob behind card */}
          <div className="absolute top-1/4 right-16 w-48 h-48 bg-gradient-to-tr from-rose-100 to-orange-50 rounded-full opacity-80 blur-3xl animate-blob pointer-events-none"></div>
          
          {/* The Glass Card */}
          <div className="relative bg-white/40 backdrop-blur-xl border border-white/60 p-10 rounded-[2.5rem] shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] max-w-md transform transition-all hover:scale-[1.01] duration-500">
             
             {/* Floating Quote Icon */}
             <div className="absolute -top-6 -left-6 bg-rose-100/80 text-rose-500 w-12 h-12 flex items-center justify-center rounded-full text-2xl font-serif shadow-sm">
               "
             </div>

             {/* Stars */}
             <div className="flex gap-1.5 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-300 text-amber-300" />
                ))}
             </div>

             {/* Editorial Text */}
             <p className="text-2xl font-serif text-stone-800 leading-snug mb-8 italic">
               "Wishly isn't just a list. It’s my <span className="text-rose-500/90 font-medium bg-rose-50/50 px-1 rounded">aesthetic storefront</span> for everything I love."
             </p>

             {/* User Profile */}
             <div className="flex items-center gap-4 border-t border-white/40 pt-6">
                 <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-100 to-blue-50 p-0.5 ring-2 ring-white shadow-sm relative overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" 
                      alt="User" 
                      className="w-full h-full rounded-full object-cover" 
                    />
                 </div>
                 <div>
                   <div className="font-bold text-stone-800 text-sm flex items-center gap-1">
                     Sophie Miller 
                     <div className="bg-blue-500 text-white p-[2px] rounded-full"><Check className="w-2 h-2" strokeWidth={4}/></div>
                   </div>
                   <div className="text-xs text-stone-500 font-medium tracking-wide">@sophie_creates</div>
                 </div>
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-20 p-12 text-xs font-medium tracking-widest text-stone-400 uppercase">
          © 2024 Wishly Inc. — Curation Tools
        </div>
      </div>

      {/* --- RIGHT PANEL (Soft Interaction Form) --- */}
      <div className="flex flex-col items-center justify-center p-6 md:p-12 bg-[#FEFDFB] relative min-h-screen lg:min-h-auto">
        
        <div className="w-full max-w-[380px] space-y-8">
          
          {/* Mobile Logo */}
          <div className="lg:hidden flex flex-col items-center mb-6">
             <Link href="/">
               <div className="bg-rose-50 p-3 rounded-2xl mb-2">
                 <WishlyLogo className="w-8 h-8 text-rose-400" />
               </div>
             </Link>
          </div>

          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="font-serif text-3xl md:text-4xl font-medium text-stone-800 tracking-tight">
              {activeTab === "login" ? "Welcome back" : "Claim your space"}
            </h2>
            <p className="text-stone-400 text-sm font-medium tracking-wide uppercase">
              {activeTab === "login" ? "Continue your curation" : "Create your aesthetic storefront"}
            </p>
          </div>

          {/* Soft Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-14 rounded-full bg-[#F5F5F2] p-1.5 border border-transparent mb-8">
              <TabsTrigger
                value="login"
                className="rounded-full text-sm font-medium text-stone-500 data-[state=active]:bg-white data-[state=active]:text-stone-800 data-[state=active]:shadow-[0_2px_10px_-2px_rgba(0,0,0,0.05)] transition-all duration-300 ease-out"
              >
                Log In
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="rounded-full text-sm font-medium text-stone-500 data-[state=active]:bg-white data-[state=active]:text-stone-800 data-[state=active]:shadow-[0_2px_10px_-2px_rgba(0,0,0,0.05)] transition-all duration-300 ease-out"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
              <TabsContent value="login" className="mt-0 outline-none">
                <LoginForm supabase={supabase} switchToSignup={() => setActiveTab("signup")} />
              </TabsContent>

              <TabsContent value="signup" className="mt-0 outline-none">
                <SignUpForm supabase={supabase} switchToLogin={() => setActiveTab("login")} />
              </TabsContent>
            </div>
          </Tabs>

          <div className="text-center">
              <p className="text-[11px] text-stone-400 font-medium tracking-wide">
                BY CONTINUING, YOU AGREE TO OUR <Link href="#" className="underline decoration-stone-300 underline-offset-2 hover:text-stone-600">TERMS</Link> AND <Link href="#" className="underline decoration-stone-300 underline-offset-2 hover:text-stone-600">PRIVACY POLICY</Link>.
              </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- FORM COMPONENTS ---

function LoginForm({ supabase, switchToSignup }: { supabase: any; switchToSignup: () => void }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Validation
    if (!email || !password) {
      toast({
        title: "Missing details",
        description: "Please enter both email and password.",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    try {
      // --- REAL SUPABASE LOGIN ---
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      toast({
        title: "Welcome back! ✨",
        description: "Redirecting you...",
        className: "bg-rose-50 border-rose-200 text-rose-900",
      })

      if (data.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", data.user.id)
          .maybeSingle()

        if (profile?.username) {
          window.location.href = `/${profile.username}`
        } else {
          // Fallback if profile missing (rare edge case)
          window.location.href = "/"
        }
      }
    } catch (err: any) {
      toast({
        title: "Login failed",
        description: err.message || "Invalid credentials",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Soft Social Buttons */}
      <div className="flex justify-center gap-4">
        {[
          { icon: TbBrandTiktok },
          { icon: Instagram },
          { icon: Apple },
        ].map((item, i) => (
          <Button
            key={i}
            variant="outline"
            className="h-14 w-14 rounded-full border border-transparent bg-[#F4F4F0] hover:bg-white hover:border-rose-100 hover:shadow-md hover:scale-105 transition-all duration-300 flex items-center justify-center text-stone-600"
            type="button"
          >
            <item.icon className="h-6 w-6" /> 
          </Button>
        ))}
      </div>

      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-stone-100" /></div>
        <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold text-stone-300">
          <span className="bg-[#FEFDFB] px-2">Or continue with</span>
        </div>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-4">
          <div className="relative group">
            <Mail className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400 group-focus-within:text-rose-500 transition-colors z-10" />
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 md:h-14 rounded-[2rem] bg-stone-100/60 border border-stone-200/40 pl-12 md:pl-14 text-base shadow-sm transition-all duration-200 placeholder:text-stone-400 text-stone-800 focus-visible:bg-white focus-visible:border-rose-200 focus-visible:ring-4 focus-visible:ring-rose-50"
              placeholder="Email address"
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400 group-focus-within:text-rose-500 transition-colors z-10" />
            <Input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 md:h-14 rounded-[2rem] bg-stone-100/60 border border-stone-200/40 pl-12 md:pl-14 text-base shadow-sm transition-all duration-200 placeholder:text-stone-400 text-stone-800 focus-visible:bg-white focus-visible:border-rose-200 focus-visible:ring-4 focus-visible:ring-rose-50"
              placeholder="Password"
            />
          </div>
          
          <div className="flex justify-end px-2">
            <Link href="#" className="text-[11px] font-medium text-stone-400 hover:text-rose-500 transition-colors">
              Forgot password?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          className="group relative w-full h-12 md:h-14 rounded-full bg-gradient-to-br from-rose-300 to-rose-400 hover:from-rose-400 hover:to-rose-500 text-white font-semibold text-lg tracking-wide shadow-[0_10px_25px_-5px_rgba(251,113,133,0.4)] hover:shadow-[0_15px_30px_-5px_rgba(251,113,133,0.5)] transition-all duration-300 ease-out transform hover:-translate-y-0.5 overflow-hidden"
          disabled={loading}
        >
          <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />
          <span className="relative z-20 flex items-center justify-center gap-2">
            {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Sign In"}
            {!loading && <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />}
          </span>
        </Button>
      </form>
    </div>
  )
}

function SignUpForm({ supabase, switchToLogin }: { supabase: any; switchToLogin: () => void }) {
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Validation
    if (!email || !username || !password) {
        toast({ title: "Missing details", description: "Please fill all fields", variant: "destructive" })
        setLoading(false)
        return
    }

    try {
        // 1. Check if username taken
        const { data: existingUser } = await supabase
            .from("profiles")
            .select("username")
            .eq("username", username)
            .maybeSingle()
            
        if (existingUser) {
            toast({ title: "Username taken", description: "Try another one", variant: "destructive" })
            setLoading(false)
            return
        }

        // 2. Sign Up
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { username } }
        })

        if (error) throw error

        if (data.user) {
            // 3. Auto-login attempt
            await supabase.auth.signInWithPassword({ email, password })
            
            // 4. Create profile manually
            const { error: profileError } = await supabase
                .from("profiles")
                .insert({ id: data.user.id, username, email })
            
            if (!profileError) {
               window.location.href = `/${username}`
            }
            
            toast({ title: "Welcome!", description: "Account created successfully", className: "bg-green-50 text-green-900" })
        }
    } catch (err: any) {
        toast({ title: "Error", description: err.message, variant: "destructive" })
    } finally {
        setLoading(false)
    }
  }
  
  return (
    <div className="space-y-6">
      {/* Soft Social Buttons */}
      <div className="flex justify-center gap-4">
        {[
          { icon: TbBrandTiktok },
          { icon: Instagram },
          { icon: Apple },
        ].map((item, i) => (
          <Button
            key={i}
            variant="outline"
            className="h-14 w-14 rounded-full border border-transparent bg-[#F4F4F0] hover:bg-white hover:border-rose-100 hover:shadow-md hover:scale-105 transition-all duration-300 flex items-center justify-center text-stone-600"
            type="button"
          >
            <item.icon className="h-6 w-6" />
          </Button>
        ))}
      </div>

      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-stone-100" /></div>
        <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold text-stone-300">
          <span className="bg-[#FEFDFB] px-2">Or create with</span>
        </div>
      </div>

      <form onSubmit={handleSignUp} className="space-y-4">
        <div className="space-y-4">
          
          <div className="relative group">
            <AtSign className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400 group-focus-within:text-rose-500 transition-colors z-10" />
            <Input
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-12 md:h-14 rounded-[2rem] bg-stone-100/60 border border-stone-200/40 pl-12 md:pl-14 text-base shadow-sm transition-all duration-200 placeholder:text-stone-400 text-stone-800 focus-visible:bg-white focus-visible:border-rose-200 focus-visible:ring-4 focus-visible:ring-rose-50"
              placeholder="Username"
            />
          </div>

          <div className="relative group">
            <Mail className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400 group-focus-within:text-rose-500 transition-colors z-10" />
            <Input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 md:h-14 rounded-[2rem] bg-stone-100/60 border border-stone-200/40 pl-12 md:pl-14 text-base shadow-sm transition-all duration-200 placeholder:text-stone-400 text-stone-800 focus-visible:bg-white focus-visible:border-rose-200 focus-visible:ring-4 focus-visible:ring-rose-50"
              placeholder="Email address"
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400 group-focus-within:text-rose-500 transition-colors z-10" />
            <Input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 md:h-14 rounded-[2rem] bg-stone-100/60 border border-stone-200/40 pl-12 md:pl-14 text-base shadow-sm transition-all duration-200 placeholder:text-stone-400 text-stone-800 focus-visible:bg-white focus-visible:border-rose-200 focus-visible:ring-4 focus-visible:ring-rose-50"
              placeholder="Password"
              minLength={6}
            />
          </div>

        </div>

        <Button
          type="submit"
          className="group relative w-full h-12 md:h-14 rounded-full bg-gradient-to-br from-rose-300 to-rose-400 hover:from-rose-400 hover:to-rose-500 text-white font-semibold text-lg tracking-wide shadow-[0_10px_25px_-5px_rgba(251,113,133,0.4)] hover:shadow-[0_15px_30px_-5px_rgba(251,113,133,0.5)] transition-all duration-300 ease-out transform hover:-translate-y-0.5 overflow-hidden"
          disabled={loading}
        >
          <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />
          <span className="relative z-20 flex items-center justify-center gap-2">
            {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Create Account"}
            {!loading && <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />}
          </span>
        </Button>
      </form>
    </div>
  )
}
