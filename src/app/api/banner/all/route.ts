import { NextResponse } from "next/server";
import { supabaseServerWithCookies } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await supabaseServerWithCookies();
    
    const { data, error } = await supabase
      .from("banner")
      .select("id, title, subtitle, image_url, is_active, created_at, updated_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar banners:", error);
      return NextResponse.json({ error: "Erro ao buscar banners" }, { status: 500 });
    }

    return NextResponse.json({ banners: data || [] });
  } catch (error) {
    console.error("Erro inesperado:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
