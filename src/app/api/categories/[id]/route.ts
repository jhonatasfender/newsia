import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { normalizeSlug } from "@/lib/utils";
import { requireAdminAPI } from "@/lib/middleware/api-auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { response } = await requireAdminAPI();
  
  if (response) {
    return response;
  }

  try {
    const { id } = await params;
    const supabase = await supabaseServer();
    const { title, slug: rawSlug } = await request.json();

    if (!title || !rawSlug) {
      return NextResponse.json({ error: "Título e slug são obrigatórios" }, { status: 400 });
    }

    const slug = normalizeSlug(rawSlug);

    const { data, error } = await supabase
      .from("categories")
      .update({ title, slug })
      .eq("id", id)
      .select("id, slug, title, created_at")
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "Já existe uma categoria com este slug" }, { status: 409 });
      }
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Categoria não encontrada" }, { status: 404 });
      }
      console.error("Erro ao atualizar categoria:", error);
      return NextResponse.json({ error: "Erro ao atualizar categoria" }, { status: 500 });
    }

    return NextResponse.json({ category: data });
  } catch (error) {
    console.error("Erro inesperado:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { profile, response } = await requireAdminAPI();
  
  if (response) {
    return response;
  }

  try {
    const { id } = await params;
    const supabase = await supabaseServer();

    const { data: articles, error: articlesError } = await supabase
      .from("articles")
      .select("id")
      .eq("category_id", id)
      .limit(1);

    if (articlesError) {
      console.error("Erro ao verificar artigos vinculados:", articlesError);
      return NextResponse.json({ error: "Erro ao verificar dependências" }, { status: 500 });
    }

    if (articles && articles.length > 0) {
      return NextResponse.json({ 
        error: "Não é possível excluir categoria que possui artigos vinculados" 
      }, { status: 409 });
    }

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Categoria não encontrada" }, { status: 404 });
      }
      console.error("Erro ao excluir categoria:", error);
      return NextResponse.json({ error: "Erro ao excluir categoria" }, { status: 500 });
    }

    return NextResponse.json({ message: "Categoria excluída com sucesso" });
  } catch (error) {
    console.error("Erro inesperado:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
