"use client";

import { useCallback, useMemo, useState } from "react";

type ShareButtonsProps = {
  title?: string;
  url?: string; // if not provided, uses current location
};

export default function ShareButtons(props: ShareButtonsProps) {
  const { title } = props;
  const [copied, setCopied] = useState(false);

  const shareUrl = useMemo(() => {
    if (props.url) return props.url;
    if (typeof window !== "undefined") return window.location.href;
    return "";
  }, [props.url]);

  const onCopy = useCallback(async () => {
    try {
      const textToCopy =
        shareUrl || (typeof window !== "undefined" ? window.location.href : "");
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // noop
    }
  }, [shareUrl]);

  const facebookHref = useMemo(
    () =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    [shareUrl],
  );
  const linkedinHref = useMemo(
    () =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    [shareUrl],
  );

  return (
    <section aria-labelledby="share-heading" className="mt-10">
      <h2 id="share-heading" className="text-lg font-semibold mb-3">
        Compartilhar
      </h2>
      <div className="flex flex-wrap items-center gap-3">
        <a
          href={facebookHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1877F2] text-white text-sm font-medium hover:opacity-90"
          aria-label="Compartilhar no Facebook"
        >
          <span>Facebook</span>
        </a>
        <a
          href={linkedinHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0A66C2] text-white text-sm font-medium hover:opacity-90"
          aria-label="Compartilhar no LinkedIn"
        >
          <span>LinkedIn</span>
        </a>
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-black/5 text-black text-sm font-medium hover:bg-black/10"
          aria-label="Copiar link"
        >
          <span>{copied ? "Copiado!" : "Copiar Link"}</span>
        </button>
      </div>
      {title ? <p className="sr-only">{title}</p> : null}
    </section>
  );
}
