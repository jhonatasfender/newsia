import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { normalizeSlug } from "@/lib/utils";
import { requireAdminAPI } from "@/lib/middleware/api-auth";

export async function GET() {
  try {
    const supabase = await supabaseServer();
    
    const { data, error } = await supabase
      .from("categories")
      .select("id, slug, title, created_at")
      .order("title");

    if (error) {
      console.error("Erro ao buscar categorias:", error);
      return NextResponse.json({ error: "Erro ao buscar categorias" }, { status: 500 });
    }

    return NextResponse.json({ categories: data || [] });
  } catch (error) {
    console.error("Erro inesperado:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { profile, response } = await requireAdminAPI();
  
  if (response) {
    return response;
  }

  try {
    const supabase = await supabaseServer();
    const { title, slug: rawSlug } = await request.json();

    if (!title || !rawSlug) {
      return NextResponse.json({ error: "Título e slug são obrigatórios" }, { status: 400 });
    }

    const slug = normalizeSlug(rawSlug);

    const { data, error } = await supabase
      .from("categories")
      .insert({ title, slug })
      .select("id, slug, title, created_at")
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "Já existe uma categoria com este slug" }, { status: 409 });
      }
      console.error("Erro ao criar categoria:", error);
      return NextResponse.json({ error: "Erro ao criar categoria" }, { status: 500 });
    }

    return NextResponse.json({ category: data }, { status: 201 });
  } catch (error) {
    console.error("Erro inesperado:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
