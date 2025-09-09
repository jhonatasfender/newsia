"use client";

import { useEffect } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function AuthClient(): JSX.Element {
  const router = useRouter();
  const supabase = supabaseBrowser();

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        // Sync session cookies to server for SSR
        supabase.auth.getSession().then(async ({ data }) => {
          const s = data.session;
          if (s?.access_token && s?.refresh_token) {
            await fetch("/api/auth/set", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ access_token: s.access_token, refresh_token: s.refresh_token }),
            });
          }
          router.replace("/admin");
        });
      }
    });
    return () => {
      sub.subscription.unsubscribe();
    };
  }, [router, supabase]);

  return (
    <Auth
      supabaseClient={supabase}
      providers={[]}
      view="sign_in"
      appearance={{
        theme: ThemeSupa,
        variables: {
          default: {
            colors: {
              brand: "#fcd34d",
              brandAccent: "#f59e0b",
            },
          },
        },
      }}
      localization={{
        variables: {
          sign_in: {
            email_label: "Email",
            password_label: "Senha",
            button_label: "Entrar",
          },
        },
      }}
    />
  );
}


