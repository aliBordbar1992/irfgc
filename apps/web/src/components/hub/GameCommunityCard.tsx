import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface GameCommunityCardProps {
  href: string;
  title: string;
  description: string;
  imageSrc: string;
}

export function GameCommunityCard({
  href,
  title,
  description,
  imageSrc,
}: GameCommunityCardProps) {
  return (
    <Link
      href={href}
      className="group relative flex h-[252px] flex-col gap-3 overflow-hidden rounded-xl border border-[var(--irfgc-border)] p-5 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[var(--irfgc-accent)]"
    >
      <span aria-hidden className="pointer-events-none absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt=""
          className="absolute inset-0 size-full rounded-xl object-cover"
        />
        <span className="absolute inset-0 rounded-xl bg-gradient-to-t from-[rgba(12,16,20,0.94)] via-[rgba(12,16,20,0.6)] via-[55%] to-transparent" />
      </span>

      <span className="relative flex h-[62px] items-start">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--irfgc-accent-surface)] px-2.5 py-1">
          <span className="size-1.5 rounded-full bg-[var(--irfgc-accent)]" />
          <span className="text-[11px] font-medium text-[var(--irfgc-accent)]" dir="auto">
            فعال
          </span>
        </span>
      </span>

      <span className="relative font-[family-name:var(--font-inter)] text-[22px] font-bold leading-7 text-[var(--irfgc-text-primary)]">
        {title}
      </span>

      <span
        className="relative h-[50px] text-sm leading-[1.75] text-[var(--irfgc-text-on-media)]"
        dir="auto"
      >
        {description}
      </span>

      <span className="relative h-px w-full bg-[rgba(43,54,66,0.6)]" />

      <span className="relative flex items-center justify-between">
        <ArrowLeft className="size-5 text-[var(--irfgc-accent)] transition-transform group-hover:-translate-x-0.5" />
        <span
          className="text-sm font-semibold leading-[27px] text-[var(--irfgc-accent)]"
          dir="auto"
        >
          ورود به کامیونیتی
        </span>
      </span>
    </Link>
  );
}
