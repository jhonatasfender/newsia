import { NextRequest, NextResponse } from "next/server";
import { supabaseServerWithCookies } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await supabaseServerWithCookies();
    
    const { data, error } = await supabase
      .from("banner")
      .select("id, title, subtitle, image_url, is_active, created_at, updated_at")
      .eq("is_active", true)
      .single();

    if (error) {
      console.error("Erro ao buscar banner:", error);
      return NextResponse.json({ error: "Erro ao buscar banner" }, { status: 500 });
    }

    return NextResponse.json({ banner: data });
  } catch (error) {
    console.error("Erro inesperado:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
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
        .eq("is_active", true);
    }

    const { data, error } = await supabase
      .from("banner")
      .insert({ title, subtitle, image_url, is_active: is_active || false })
      .select("id, title, subtitle, image_url, is_active, created_at, updated_at")
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "Apenas um banner pode estar ativo por vez" }, { status: 400 });
      }
      console.error("Erro ao criar banner:", error);
      return NextResponse.json({ error: "Erro ao criar banner" }, { status: 500 });
    }

    return NextResponse.json({ banner: data }, { status: 201 });
  } catch (error) {
    console.error("Erro inesperado:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
