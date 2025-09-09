import Image from "next/image";
import Link from "next/link";

export type NewsCardProps = {
  category: string;
  categoryColor: string; // tailwind class e.g. 'bg-emerald-600'
  title: string;
  excerpt: string;
  minutes: number;
  date: string; // ISO or display
  imageSrc: string;
  href: string;
};

export default function NewsCard(props: NewsCardProps): JSX.Element {
  const { category, categoryColor, title, excerpt, minutes, date, imageSrc, href } = props;
  return (
    <article className="rounded-xl border border-black/10 overflow-hidden bg-white flex flex-col">
      <div className="relative aspect-[16/9]">
        <Image src={imageSrc} alt="" fill className="object-cover" />
      </div>
      <div className="p-4 sm:p-5 space-y-2">
        <div className="flex items-center justify-between text-xs text-black/60">
          <span className={`inline-flex items-center px-2 py-0.5 rounded ${categoryColor} text-white font-semibold uppercase tracking-wide`}>{category}</span>
          <span>
            {minutes} min
          </span>
        </div>
        <h3 className="text-base sm:text-lg font-semibold leading-snug">
          {title}
        </h3>
        <p className="text-sm text-black/70 line-clamp-3">{excerpt}</p>
        <div className="flex items-center justify-between text-xs text-black/60 pt-2">
          <span>{date}</span>
          <Link href={href} className="hover:underline">Ler mais</Link>
        </div>
      </div>
    </article>
  );
}


