import { redirect } from "next/navigation"
import { createClient } from "@wishly/db/web/server"
import { GlobalHeader } from "@/components/global-header"
import { LandingHero } from "@/components/landing-hero"
import { LandingLinkBio } from "@/components/landing-link-bio"
import { LandingHowItWorks } from "@/components/landing-how-it-works"
import { InfluencerProof } from "@/components/influencer-proof"
import { LandingCTA } from "@/components/landing-cta"
import { LandingFooter } from "@/components/landing-footer"
import { LandingLogoCloud } from "@/components/landing-logo-cloud"

export default async function Home() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    const { data: profile } = await supabase.from("profiles").select("username").eq("id", user.id).maybeSingle()

    if (profile?.username) {
      redirect(`/${profile.username}`)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader variant="landing" />
      <main>
        <LandingHero />
        <LandingLogoCloud />
        <LandingLinkBio />
        <LandingHowItWorks />
        <InfluencerProof />
        <LandingCTA />
      </main>
      <LandingFooter />
    </div>
  )
}
