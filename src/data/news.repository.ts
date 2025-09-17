import { supabaseServer } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";

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
  categories?: {
    id: string;
    title: string;
    slug: string;
  } | null;
};

export class NewsRepository {
  static async getCategoriesForSSG(): Promise<NewsCategory[]> {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { data, error } = await supabase
        .from("categories")
        .select("id, slug, title, created_at")
        .order("title");

      if (error) {
        console.error("Erro ao buscar categorias:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Erro inesperado ao buscar categorias:", error);
      return [];
    }
  }

  static async getPublishedArticlesForSSG(limit: number = 50): Promise<{ slug: string }[]> {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { data, error } = await supabase
        .from("articles")
        .select("slug")
        .not("published_at", "is", null)
        .limit(limit);

      if (error) {
        console.error("Erro ao buscar artigos:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Erro inesperado ao buscar artigos:", error);
      return [];
    }
  }

  static async getCategoryBySlugForSSG(slug: string): Promise<NewsCategory | null> {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { data, error } = await supabase
        .from("categories")
        .select("id, slug, title, created_at")
        .eq("slug", slug)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return null;
        }
        console.error("Erro ao buscar categoria:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Erro inesperado ao buscar categoria:", error);
      return null;
    }
  }

  static async getNewsByCategoryForSSG(categoryId: string, limit: number = 50): Promise<NewsArticle[]> {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { data, error } = await supabase
        .from("articles")
        .select(`
          id,
          category_id,
          slug,
          title,
          excerpt,
          body,
          image_url,
          minutes,
          published_at,
          created_at,
          updated_at,
          categories:category_id (
            id,
            title,
            slug
          )
        `)
        .eq("category_id", categoryId)
        .not("published_at", "is", null)
        .order("published_at", { ascending: false })
        .limit(limit);

      if (error) {
        console.error("Erro ao buscar notícias por categoria:", error);
        return [];
      }

      const transformedData = (data || []).map(article => ({
        ...article,
        categories: Array.isArray(article.categories) && article.categories.length > 0 
          ? article.categories[0] 
          : null
      }));

      return transformedData;
    } catch (error) {
      console.error("Erro inesperado ao buscar notícias por categoria:", error);
      return [];
    }
  }

  async listPublished(limit: number = 20): Promise<NewsArticle[]> {
    const supabase = await supabaseServer();
    const { data, error } = await supabase
      .from("articles")
      .select(
        `
        *,
        categories (
          id,
          title,
          slug
        )
      `,
      )
      .not("published_at", "is", null)
      .order("published_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data ?? [];
  }

  async getBySlug(slug: string): Promise<NewsArticle | null> {
    const supabase = await supabaseServer();
    const { data, error } = await supabase
      .from("articles")
      .select(
        `
        *,
        categories (
          id,
          title,
          slug
        )
      `,
      )
      .eq("slug", slug)
      .single();
    if (error && error.code !== "PGRST116") throw error;
    return data ?? null;
  }

  async getFeaturedNews(limit: number = 6): Promise<NewsArticle[]> {
    const supabase = await supabaseServer();
    const { data, error } = await supabase
      .from("articles")
      .select(
        `
        *,
        categories (
          id,
          title,
          slug
        )
      `,
      )
      .not("published_at", "is", null)
      .order("published_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data ?? [];
  }

  async getAllArticles(): Promise<NewsArticle[]> {
    const supabase = await supabaseServer();
    const { data, error } = await supabase
      .from("articles")
      .select(
        `
        *,
        categories (
          id,
          title,
          slug
        )
      `,
      )
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  }

  async publishArticle(
    articleId: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = await supabaseServer();

      const { error } = await supabase
        .from("articles")
        .update({ published_at: new Date().toISOString() })
        .eq("id", articleId);

      if (error) {
        console.error("Erro ao publicar artigo:", error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error("Erro inesperado ao publicar artigo:", error);
      return { success: false, error: "Erro interno do servidor" };
    }
  }

  async unpublishArticle(
    articleId: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = await supabaseServer();

      const { error } = await supabase
        .from("articles")
        .update({ published_at: null })
        .eq("id", articleId);

      if (error) {
        console.error("Erro ao despublicar artigo:", error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error("Erro inesperado ao despublicar artigo:", error);
      return { success: false, error: "Erro interno do servidor" };
    }
  }

  async isArticlePublished(articleId: string): Promise<boolean> {
    try {
      const supabase = await supabaseServer();

      const { data, error } = await supabase
        .from("articles")
        .select("published_at")
        .eq("id", articleId)
        .single();

      if (error) {
        console.error("Erro ao verificar status de publicação:", error);
        return false;
      }

      return data?.published_at !== null;
    } catch (error) {
      console.error("Erro inesperado ao verificar publicação:", error);
      return false;
    }
  }

  async deleteArticle(
    articleId: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = await supabaseServer();

      const { error } = await supabase
        .from("articles")
        .delete()
        .eq("id", articleId);

      if (error) {
        console.error("Erro ao deletar artigo:", error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error("Erro inesperado ao deletar artigo:", error);
      return { success: false, error: "Erro interno do servidor" };
    }
  }

  async getRelatedNews(
    articleId: string,
    categoryId: string | null,
    limit: number = 3,
  ): Promise<NewsArticle[]> {
    try {
      const supabase = await supabaseServer();

      let query = supabase
        .from("articles")
        .select(
          `
          *,
          categories (
            id,
            title,
            slug
          )
        `,
        )
        .not("published_at", "is", null)
        .neq("id", articleId)
        .order("published_at", { ascending: false })
        .limit(limit);

      if (categoryId) {
        query = query.eq("category_id", categoryId);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Erro ao buscar notícias relacionadas:", error);
        return [];
      }

      return data ?? [];
    } catch (error) {
      console.error("Erro inesperado ao buscar notícias relacionadas:", error);
      return [];
    }
  }

  async getTotalPublishedCount(): Promise<number> {
    try {
      const supabase = await supabaseServer();

      const { count, error } = await supabase
        .from("articles")
        .select("*", { count: "exact", head: true })
        .not("published_at", "is", null);

      if (error) {
        console.error("Erro ao contar notícias publicadas:", error);
        return 0;
      }

      return count ?? 0;
    } catch (error) {
      console.error("Erro inesperado ao contar notícias:", error);
      return 0;
    }
  }

  async getCategories(): Promise<NewsCategory[]> {
    try {
      const supabase = await supabaseServer();

      const { data, error } = await supabase
        .from("categories")
        .select("id, slug, title, created_at")
        .order("title");

      if (error) {
        console.error("Erro ao buscar categorias:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Erro inesperado ao buscar categorias:", error);
      return [];
    }
  }

  async getCategoryBySlug(slug: string): Promise<NewsCategory | null> {
    try {
      const supabase = await supabaseServer();

      const { data, error } = await supabase
        .from("categories")
        .select("id, slug, title, created_at")
        .eq("slug", slug)
        .single();

      if (error) {
        console.error("Erro ao buscar categoria:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Erro inesperado ao buscar categoria:", error);
      return null;
    }
  }

  async getNewsByCategory(
    categoryId: string,
    limit: number = 20,
  ): Promise<NewsArticle[]> {
    try {
      const supabase = await supabaseServer();

      const { data, error } = await supabase
        .from("articles")
        .select(
          `
          *,
          categories (
            id,
            title,
            slug
          )
        `,
        )
        .eq("category_id", categoryId)
        .not("published_at", "is", null)
        .order("published_at", { ascending: false })
        .limit(limit);

      if (error) {
        console.error("Erro ao buscar notícias por categoria:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Erro inesperado ao buscar notícias por categoria:", error);
      return [];
    }
  }
}
