import { redirect } from 'next/navigation'
import { createClient } from '@wishly/db/web/server'
import WishlistClient from '../wishlist-client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface PageProps {
  params: Promise<{ username: string }>
}

export default async function PublicProfilePage({ params }: PageProps) {
  const { username } = await params
  
  const reservedRoutes = ['auth', 'api', 'dashboard', '_next', 'favicon.ico']
  if (reservedRoutes.includes(username)) {
    redirect('/')
  }
  
  const supabase = await createClient()

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .maybeSingle()

  if (profileError || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-6 px-4">
          <h1 className="text-6xl font-bold text-foreground">404</h1>
          <h2 className="text-2xl font-semibold text-foreground">User Not Found</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            The wishlist for <span className="font-semibold">@{username}</span> doesn't exist. The username may have been changed or the profile was deleted.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/">Go Home</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/auth">Create Your Wishlist</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Fetch the items for this profile
  const { data: items } = await supabase
    .from('items')
    .select('*')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false })

  // Check if the current user is the owner
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isOwner = user?.id === profile.id

  return (
    <WishlistClient
      user={user}
      initialItems={items || []}
      profile={profile}
      isOwner={isOwner}
    />
  )
}
