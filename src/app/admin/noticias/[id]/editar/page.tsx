import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import Image from "next/image";
import type { OutputData } from "@editorjs/editorjs";
import EditorJsField from "@/components/EditorJsField";

type Params = { params: { id: string } };

async function updateArticle(formData: FormData) {
  "use server";
  const supabase = await supabaseServer();
  const id = String(formData.get("id") || "");
  const title = String(formData.get("title") || "");
  const slug = String(formData.get("slug") || "");
  const minutes = formData.get("minutes") ? Number(formData.get("minutes")) : null;
  const body = String(formData.get("body") || "");
  const imageUrl = String(formData.get("image_url") || "");

  await supabase.from("articles").update({ title, slug, minutes, body, image_url: imageUrl }).eq("id", id);
  redirect("/admin");
}

export default async function EditArticlePage({ params }: Params) {
  const supabase = await supabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) redirect("/login");

  const { data } = await supabase
    .from("articles")
    .select("id, title, slug, minutes, body, image_url")
    .eq("id", params.id)
    .single();

  if (!data) redirect("/admin");

  let initialBlocks: OutputData | undefined = undefined;
  try {
    initialBlocks = data.body ? (JSON.parse(data.body) as OutputData) : undefined;
  } catch {}

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
        <h1 className="text-2xl font-extrabold mb-4">Editar Notícia</h1>
        <form action={updateArticle} className="grid gap-3">
          <input type="hidden" name="id" value={data.id} />
          <input type="hidden" id="body" name="body" />
          <div>
            <label className="text-sm font-medium" htmlFor="image_url">Imagem do banner (URL)</label>
            <input id="image_url" name="image_url" defaultValue={data.image_url ?? ""} placeholder="https://..." className="mt-1 w-full h-10 px-3 rounded-md border border-black/15" />
            {data.image_url ? (
              <div className="mt-2">
                <div className="relative w-full max-w-xl aspect-[16/9] rounded-md overflow-hidden border border-black/10">
                  <Image src={data.image_url} alt="Prévia do banner" fill className="object-cover" />
                </div>
              </div>
            ) : null}
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="title">Título</label>
            <input id="title" name="title" defaultValue={data.title} className="mt-1 w-full h-10 px-3 rounded-md border border-black/15" />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="slug">Slug</label>
            <input id="slug" name="slug" defaultValue={data.slug} className="mt-1 w-full h-10 px-3 rounded-md border border-black/15" />
          </div>
          <div>
            <label className="text-sm font-medium">Conteúdo</label>
            <EditorJsField initialData={initialBlocks} hiddenInputId="body" />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="minutes">Minutos</label>
            <input id="minutes" name="minutes" type="number" defaultValue={data.minutes ?? undefined} className="mt-1 w-full h-10 px-3 rounded-md border border-black/15" />
          </div>
          <div className="mt-2 flex gap-3">
            <button className="h-10 px-4 rounded-md bg-black text-white" type="submit">Salvar</button>
            <a className="h-10 px-4 rounded-md border border-black/15 inline-flex items-center" href="/admin">Cancelar</a>
          </div>
        </form>
      </div>
    </main>
  );
}


