import { Gamepad2, MessagesSquare, Trophy } from "lucide-react";

const pillars = [
  {
    title: "خبر و گفتگو",
    body: "خبرهای همان بازی را دنبال کن، در انجمن گفتگو کن و در چت زنده با بازیکنان کامیونیتی در ارتباط باش.",
    icon: MessagesSquare,
  },
  {
    title: "پیدا کردن هم‌بازی",
    body: "برای بازی همین حالا درخواست بگذار؛ با انتخاب پلتفرم، شهر ایران یا آنلاین، و سطح مهارت.",
    meta: "PC · PlayStation · Xbox · Switch",
    icon: Gamepad2,
  },
  {
    title: "تورنمنت و دورهمی",
    body: "برای مسابقهٔ رقابتی یا دورهمی دوستانه ثبت‌نام کن؛ رویدادهایی منظم، آنلاین یا حضوری در یکی از شهرهای ایران.",
    icon: Trophy,
  },
];

export function HubPillars() {
  return (
    <section className="flex w-full flex-col gap-4 pb-9 pt-10">
      <h2
        className="text-right text-xl font-semibold leading-[1.8] text-[var(--irfgc-text-primary)]"
        dir="auto"
      >
        داخل هر کامیونیتی چه خبر است؟
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-0">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div
              key={pillar.title}
              className="flex flex-col gap-2.5 border-[var(--irfgc-border)] p-5 md:border-r"
            >
              <div className="flex items-center gap-3">
                <p
                  className="flex-1 text-right text-base font-semibold leading-[1.8] text-[var(--irfgc-text-primary)]"
                  dir="auto"
                >
                  {pillar.title}
                </p>
                <Icon className="size-[22px] shrink-0 text-[var(--irfgc-accent)]" />
              </div>
              <p
                className="text-right text-sm leading-[1.9] text-[var(--irfgc-text-secondary)]"
                dir="auto"
              >
                {pillar.body}
              </p>
              {pillar.meta && (
                <p className="font-[family-name:var(--font-inter)] text-right text-xs font-medium text-[var(--irfgc-text-secondary)]">
                  {pillar.meta}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
