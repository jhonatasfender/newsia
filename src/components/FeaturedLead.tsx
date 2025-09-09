import Image from "next/image";
import Link from "next/link";

export type FeaturedLeadProps = {
  image: string;
  category: string;
  meta: string;
  title: string;
  excerpt: string;
  href?: string;
};

import type { ReactElement } from "react";

export default function FeaturedLead(props: FeaturedLeadProps): ReactElement {
  const { image, category, meta, title, excerpt, href = "#" } = props;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-xl border border-black/10 bg-white">
      <div className="relative aspect-[16/9] md:aspect-auto md:h-full">
        <Image src={image} alt="" fill className="object-cover" />
      </div>
      <div className="p-6 md:p-7">
        <div className="flex items-center gap-3 text-xs">
          <span className="inline-flex items-center px-2 py-0.5 rounded bg-[color:var(--color-primary)] text-white font-semibold uppercase tracking-wide">
            {category}
          </span>
          <span className="text-black/60">{meta}</span>
        </div>
        <h3 className="mt-2 text-xl font-semibold">{title}</h3>
        <p className="mt-2 text-black/70 text-sm">{excerpt}</p>
        <div className="mt-3">
          <Link href={href} className="text-sm font-semibold hover:underline">
            Ler mais →
          </Link>
        </div>
      </div>
    </div>
  );
}
