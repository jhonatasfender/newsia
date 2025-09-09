import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function supabaseWritable() {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        for (const cookie of cookiesToSet) {
          const { name, value, options } = cookie as unknown as {
            name: string;
            value: string;
            options: Record<string, unknown>;
          };
          cookieStore.set({ name, value, ...options });
        }
      },
    },
  });
}
