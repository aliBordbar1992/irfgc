import Link from "next/link";
import { cn } from "@/lib/utils";

interface BrandMarkProps {
  href?: string;
  showDefinition?: boolean;
  className?: string;
  wordmarkClassName?: string;
}

function ArcadeMark({ className }: { className?: string }) {
  return (
    <span
      className={cn("inline-flex h-6 items-end gap-[3px]", className)}
      aria-hidden
    >
      <span className="h-3.5 w-[5px] bg-[var(--irfgc-accent)]" />
      <span className="h-6 w-[5px] bg-[var(--irfgc-accent)]" />
      <span className="h-[19px] w-[5px] bg-[var(--irfgc-accent)]" />
    </span>
  );
}

export function BrandMark({
  href = "/",
  showDefinition = true,
  className,
  wordmarkClassName,
}: BrandMarkProps) {
  const content = (
    <span className={cn("inline-flex items-center gap-3", className)}>
      {showDefinition && (
        <span className="hidden flex-col items-end gap-0.5 text-[11px] leading-normal sm:flex">
          <span className="font-[family-name:var(--font-inter)] text-[var(--irfgc-text-secondary)]">
            Iranian Fighting Game Community
          </span>
          <span className="text-[var(--irfgc-text-tertiary)]" dir="auto">
            جامعهٔ بازی‌های مبارزه‌ای ایران
          </span>
        </span>
      )}
      <span
        className={cn(
          "font-[family-name:var(--font-inter)] text-[30px] font-black leading-none text-[var(--irfgc-text-primary)]",
          wordmarkClassName
        )}
      >
        IRFGC
      </span>
      <ArcadeMark />
    </span>
  );

  if (!href) {
    return content;
  }

  return (
    <Link href={href} className="shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[var(--irfgc-accent)]">
      {content}
    </Link>
  );
}
