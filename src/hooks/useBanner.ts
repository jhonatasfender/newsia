import { supabaseServer } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";

export type Banner = {
  title: string;
  subtitle: string | null;
  image_url: string | null;
};

const DEFAULT_BANNER: Banner = {
  title: "Impacto IA",
  subtitle: "Inteligência Artificial e Sociedade",
  image_url: "https://picsum.photos/seed/network-bg/1600/800"
};

export async function getActiveBannerForSSG(): Promise<Banner> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    const { data: banner } = await supabase
      .from("banner")
      .select("title, subtitle, image_url")
      .eq("is_active", true)
      .single();

    if (!banner) {
      return DEFAULT_BANNER;
    }

    return {
      title: banner.title || DEFAULT_BANNER.title,
      subtitle: banner.subtitle || DEFAULT_BANNER.subtitle,
      image_url: banner.image_url || DEFAULT_BANNER.image_url
    };
  } catch (error) {
    console.error("Erro ao buscar banner:", error);
    return DEFAULT_BANNER;
  }
}

export async function getActiveBanner(): Promise<Banner> {
  try {
    const supabase = await supabaseServer();
    const { data: banner } = await supabase
      .from("banner")
      .select("title, subtitle, image_url")
      .eq("is_active", true)
      .single();

    if (!banner) {
      return DEFAULT_BANNER;
    }

    return {
      title: banner.title || DEFAULT_BANNER.title,
      subtitle: banner.subtitle || DEFAULT_BANNER.subtitle,
      image_url: banner.image_url || DEFAULT_BANNER.image_url
    };
  } catch (error) {
    console.error("Erro ao buscar banner:", error);
    return DEFAULT_BANNER;
  }
}
