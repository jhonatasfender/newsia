import { supabaseServer } from "@/lib/supabase/server";

export type NewsCategory = {
  id: string;
  slug: string;
  title: string;
  created_at: string;
};

export type NewsArticle = {
  id: string;
  category_id: string | null;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  image_url: string | null;
  minutes: number | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export class NewsRepository {
  async listPublished(limit: number = 20): Promise<NewsArticle[]> {
    const supabase = supabaseServer();
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .not("published_at", "is", null)
      .order("published_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data ?? [];
  }

  async getBySlug(slug: string): Promise<NewsArticle | null> {
    const supabase = supabaseServer();
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("slug", slug)
      .single();
    if (error && error.code !== "PGRST116") throw error;
    return data ?? null;
  }
}
