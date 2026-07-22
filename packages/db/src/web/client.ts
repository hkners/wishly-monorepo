import { createBrowserClient } from "@supabase/ssr"

let browserClient: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  // Return existing instance if available
  if (browserClient) {
    return browserClient
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("[Supabase] Missing environment variables")
    throw new Error("Supabase configuration is missing")
  }

  browserClient = createBrowserClient(supabaseUrl, supabaseAnonKey, {
    db: { schema: 'schema_wishly' },
    global: {
      fetch: async (url: any, options: any) => {
        try {
          return await fetch(url, options)
        } catch (error) {
          console.warn("[Supabase] Fetch failed (browser extension interference):", error)
          return new Response(JSON.stringify({ error: "Network error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          })
        }
      },
    },
  })

  return browserClient
}
