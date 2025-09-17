import { NextResponse } from "next/server";
import { supabaseServerWithCookies } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const { access_token, refresh_token } = await request.json();
  if (!access_token || !refresh_token) {
    return NextResponse.json({ error: "missing tokens" }, { status: 400 });
  }

  const res = NextResponse.json({ ok: true });
  const supabase = await supabaseServerWithCookies();

  const { error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return res;
}
