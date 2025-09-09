"use client";

import { useEffect, useRef } from "react";
import type EditorJS from "@editorjs/editorjs";
import type { OutputData, ToolConstructable } from "@editorjs/editorjs";

type Props = {
  initialData?: OutputData;
  onReady?: () => void;
  onChange?: (data: OutputData) => void;
  onInstance?: (instance: EditorJS) => void;
};

export default function EditorJsClient({
  initialData,
  onReady,
  onChange,
  onInstance,
}: Props) {
  const ref = useRef<EditorJS | null>(null);
  const onInstanceRef = useRef<Props["onInstance"]>(onInstance);

  useEffect(() => {
    onInstanceRef.current = onInstance;
  }, [onInstance]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!mounted || ref.current) return;
      const [
        { default: EditorJS },
        { default: Header },
        { default: List },
        { default: Checklist },
        { default: Quote },
        { default: Table },
        { default: Embed },
        { default: Code },
        { default: Marker },
        { default: InlineCode },
        { default: SimpleImage },
      ] = await Promise.all([
        import("@editorjs/editorjs"),
        import("@editorjs/header"),
        import("@editorjs/list"),
        import("@editorjs/checklist"),
        import("@editorjs/quote"),
        import("@editorjs/table"),
        import("@editorjs/embed"),
        import("@editorjs/code"),
        import("@editorjs/marker"),
        import("@editorjs/inline-code"),
        import("@editorjs/simple-image"),
      ]);

      const instance = new EditorJS({
        holder: "editorjs",
        placeholder: "Comece a escrever… / insira blocos pelo painel acima",
        tools: {
          header: {
            class: Header as unknown as ToolConstructable,
            inlineToolbar: ["marker", "inlineCode"],
            config: { placeholder: "Cabeçalho" },
          },
          list: {
            class: List as unknown as ToolConstructable,
            inlineToolbar: true,
          },
          checklist: Checklist as unknown as ToolConstructable,
          quote: {
            class: Quote as unknown as ToolConstructable,
            inlineToolbar: true,
            config: {
              quotePlaceholder: "Citação",
              captionPlaceholder: "Autor",
            },
          },
          table: Table as unknown as ToolConstructable,
          embed: Embed as unknown as ToolConstructable,
          code: Code as unknown as ToolConstructable,
          marker: Marker as unknown as ToolConstructable,
          inlineCode: InlineCode as unknown as ToolConstructable,
          image: SimpleImage as unknown as ToolConstructable,
        },
        data: initialData,
        autofocus: false,
        onReady: onReady,
        async onChange(api) {
          const saved = await api.saver.save();
          onChange?.(saved);
        },
      });
      ref.current = instance;
      onInstanceRef.current?.(instance);
    })();
    return () => {
      mounted = false;
      const inst = ref.current as unknown as { destroy?: () => void } | null;
      if (inst && typeof inst.destroy === "function") {
        try {
          inst.destroy();
        } catch {}
      }
      ref.current = null;
    };
  }, [initialData, onReady, onChange]);

  return (
    <div
      id="editorjs"
      className="min-h-[320px] border border-black/15 rounded-md bg-white"
    />
  );
}
