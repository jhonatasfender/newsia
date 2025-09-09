"use client";

import { useEffect } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";
import type { ReactElement } from "react";

export default function AuthClient(): ReactElement {
  const router = useRouter();
  const supabase = supabaseBrowser();

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        supabase.auth.getSession().then(async ({ data }) => {
          const s = data.session;
          if (s?.access_token && s?.refresh_token) {
            await fetch("/api/auth/set", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                access_token: s.access_token,
                refresh_token: s.refresh_token,
              }),
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
              brand: "#000000",
              brandAccent: "#111111",
            },
          },
        },
        className: {
          button:
            "h-10 rounded-md bg-[color:var(--color-primary)] text-black font-semibold hover:brightness-110",
          input:
            "h-10 px-3 rounded-md border border-black/15 outline-none focus:border-[color:var(--color-primary)]",
          anchor: "text-[color:var(--color-primary)] hover:underline",
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
