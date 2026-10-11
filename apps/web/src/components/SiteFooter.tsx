export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="flex w-full items-center justify-between border-t border-[var(--irfgc-border)] px-5 py-6 sm:px-12 lg:px-24">
      <p className="font-[family-name:var(--font-inter)] text-xs text-[var(--irfgc-text-tertiary)]">
        © {year} IRFGC
      </p>
      <p
        className="text-right text-[13px] text-[var(--irfgc-text-secondary)]"
        dir="auto"
      >
        ساخته‌شده برای جامعهٔ بازی‌های مبارزه‌ای ایران
      </p>
    </footer>
  );
}
