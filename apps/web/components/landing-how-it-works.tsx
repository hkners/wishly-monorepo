"use client"

import { UserPlus, Link2, Send } from "lucide-react"

export function LandingHowItWorks() {
  const steps = [
    {
      icon: UserPlus,
      title: "Sign up for free",
      description: "Claim your unique username in seconds. No credit card required.",
      bg: "bg-orange-100",
      text: "text-orange-600",
      border: "border-orange-200",
      delay: "delay-0", // Immediate appearance
    },
    {
      icon: Link2,
      title: "Paste product links",
      description: "Add items to your wishlist by pasting product URLs from any store.",
      bg: "bg-blue-100",
      text: "text-blue-600",
      border: "border-blue-200",
      delay: "delay-150", // Slight delay
    },
    {
      icon: Send,
      title: "Share your wishlist",
      description: "Get a shareable link and send it to friends and family.",
      bg: "bg-emerald-100",
      text: "text-emerald-600",
      border: "border-emerald-200",
      delay: "delay-300", // Longer delay
    },
  ]

  return (
    <section id="how-it-works" className="bg-white py-24 relative overflow-hidden">
      
      {/* Background Blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-r from-orange-50/50 via-blue-50/50 to-emerald-50/50 rounded-full blur-3xl -z-10 opacity-60 pointer-events-none" />

      <div className="container mx-auto px-4">
        
        {/* HEADER */}
        <div className="text-center mb-16 md:mb-24">
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-slate-900">
            How it works
          </h2>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Turn your finds into a shareable shop in three simple steps.
          </p>
        </div>

        {/* STEPS GRID */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 max-w-6xl mx-auto">
          
          {/* DESKTOP CONNECTING LINE - VISIBILITY FIX */}
          {/* Changed h-1 to h-1.5 and darkened colors to 200 so it stands out against white */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-1.5 bg-gradient-to-r from-orange-200 via-blue-200 to-emerald-200 rounded-full opacity-80" />

          {steps.map((step, index) => (
            <div 
              key={index} 
              // ADDED: Animation classes for smooth entry
              className={`relative group animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both ${step.delay}`}
            >
              
              <div className="flex flex-row md:flex-col items-start md:items-center text-left md:text-center gap-5 md:gap-0">
                
                {/* ICON CIRCLE */}
                <div className={`
                  shrink-0 relative z-10
                  h-16 w-16 md:h-24 md:w-24 
                  rounded-full ${step.bg} ${step.text} 
                  flex items-center justify-center 
                  shadow-sm border-4 border-white 
                  transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3
                  md:mb-8
                `}>
                  <step.icon className="w-7 h-7 md:w-10 md:h-10" strokeWidth={1.5} />
                </div>

                {/* TEXT CONTENT */}
                <div className="flex flex-col pt-1 md:pt-0">
                  <h3 className="font-serif text-xl md:text-2xl font-bold mb-2 text-slate-900">
                    {step.title}
                  </h3>
                  <p className="text-slate-500 leading-relaxed text-base md:text-lg">
                    {step.description}
                  </p>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
