import { NextRequest, NextResponse } from "next/server";
import { supabaseServerWithCookies } from "@/lib/supabase/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await supabaseServerWithCookies();
    const { title, subtitle, image_url, is_active } = await request.json();

    if (!title) {
      return NextResponse.json({ error: "Título é obrigatório" }, { status: 400 });
    }

    if (is_active) {
      await supabase
        .from("banner")
        .update({ is_active: false })
        .neq("id", params.id);
    }

    const { data, error } = await supabase
      .from("banner")
      .update({ title, subtitle, image_url, is_active })
      .eq("id", params.id)
      .select("id, title, subtitle, image_url, is_active, created_at, updated_at")
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Banner não encontrado" }, { status: 404 });
      }
      if (error.code === "23505") {
        return NextResponse.json({ error: "Apenas um banner pode estar ativo por vez" }, { status: 400 });
      }
      console.error("Erro ao atualizar banner:", error);
      return NextResponse.json({ error: "Erro ao atualizar banner" }, { status: 500 });
    }

    return NextResponse.json({ banner: data });
  } catch (error) {
    console.error("Erro inesperado:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await supabaseServerWithCookies();

    const { error } = await supabase
      .from("banner")
      .delete()
      .eq("id", params.id);

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Banner não encontrado" }, { status: 404 });
      }
      console.error("Erro ao excluir banner:", error);
      return NextResponse.json({ error: "Erro ao excluir banner" }, { status: 500 });
    }

    return NextResponse.json({ message: "Banner excluído com sucesso" });
  } catch (error) {
    console.error("Erro inesperado:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
