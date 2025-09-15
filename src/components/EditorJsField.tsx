"use client";

import EditorJsClient from "@/components/EditorJsClient";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type EditorJS from "@editorjs/editorjs";
import type { OutputData } from "@editorjs/editorjs";

type Props = {
  initialData?: OutputData;
  hiddenInputId: string;
};

export default function EditorJsField({ initialData, hiddenInputId }: Props) {
  const editorRef = useRef<EditorJS | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const insertBlock = useCallback(
    async (tool: string, data: Record<string, unknown>) => {
      const ed = editorRef.current;
      if (!ed) return;
      await ed.blocks.insert(
        tool as unknown as string,
        data as Record<string, unknown>,
        {},
        ed.blocks.getBlocksCount(),
      );
    },
    [],
  );

  const groups = useMemo(
    () => [
      {
        label: "Texto",
        items: [
          {
            key: "h2",
            icon: "fa-heading",
            text: "H2",
            onClick: () => insertBlock("header", { text: "Título", level: 2 }),
          },
          {
            key: "h3",
            icon: "fa-heading",
            text: "H3",
            onClick: () =>
              insertBlock("header", { text: "Subtítulo", level: 3 }),
          },
          {
            key: "p",
            icon: "fa-paragraph",
            text: "Parágrafo",
            onClick: () => insertBlock("paragraph", { text: "" }),
          },
        ],
      },
      {
        label: "Listas",
        items: [
          {
            key: "ul",
            icon: "fa-list-ul",
            text: "Lista",
            onClick: () =>
              insertBlock("list", {
                style: "unordered",
                items: ["Item 1", "Item 2"],
              }),
          },
          {
            key: "check",
            icon: "fa-square-check",
            text: "Checklist",
            onClick: () =>
              insertBlock("checklist", {
                items: [{ text: "Tarefa", checked: false }],
              }),
          },
        ],
      },
      {
        label: "Inserir",
        items: [
          {
            key: "quote",
            icon: "fa-quote-left",
            text: "Citação",
            onClick: () =>
              insertBlock("quote", { text: "Citação", caption: "Autor" }),
          },
          {
            key: "table",
            icon: "fa-table",
            text: "Tabela",
            onClick: () =>
              insertBlock("table", {
                withHeadings: true,
                content: [
                  ["Col 1", "Col 2"],
                  ["", ""],
                ],
              }),
          },
          {
            key: "embed",
            icon: "fa-photo-film",
            text: "Embed",
            onClick: () =>
              insertBlock("embed", {
                service: "youtube",
                source: "",
                embed: "",
                width: 640,
                height: 360,
                caption: "",
              }),
          },
          {
            key: "image",
            icon: "fa-image",
            text: "Imagem (URL)",
            onClick: () =>
              insertBlock("image", {
                url: "https://placehold.co/800x400",
                caption: "",
              }),
          },
          {
            key: "code",
            icon: "fa-code",
            text: "Código",
            onClick: () => insertBlock("code", { code: "// código" }),
          },
        ],
      },
    ],
    [insertBlock],
  );

  return (
    <div className="space-y-2">
      {/* Painel de ferramentas (ícones apenas) */}
      {mounted ? (
        <div className="rounded-lg border border-black/10 bg-white p-2">
          <div className="flex flex-wrap items-center gap-2">
            {groups.map((g, idx) => (
              <div key={g.label} className="flex items-center gap-1">
                {g.items.map((it) => (
                  <button
                    key={it.key}
                    type="button"
                    title={it.text}
                    aria-label={it.text}
                    className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-black/10 bg-white hover:bg-black/5"
                    onClick={it.onClick}
                  >
                    <i
                      className={`fa-solid ${it.icon} text-[13px]`}
                      aria-hidden
                    />
                  </button>
                ))}
                {idx < groups.length - 1 ? (
                  <span className="mx-1 h-5 w-px bg-black/10" />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Editor */}
      <div data-cy="editorjs-content">
        <EditorJsClient
          initialData={initialData}
          onInstance={(inst) => {
            editorRef.current = inst;
          }}
          onChange={(d) => {
            const el = document.getElementById(
              hiddenInputId,
            ) as HTMLInputElement | null;
            if (el) el.value = JSON.stringify(d);
          }}
        />
      </div>

      {/* Campo hidden sincronizado desde o início */}
      <input
        type="hidden"
        id={hiddenInputId}
        name={hiddenInputId}
        defaultValue={initialData ? JSON.stringify(initialData) : ""}
      />

      <p className="text-xs text-black/60">
        Dica: selecione texto para ver formatações inline. Use os ícones para
        inserir blocos.
      </p>
    </div>
  );
}
