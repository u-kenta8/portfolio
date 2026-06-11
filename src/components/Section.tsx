import { Reveal } from "./Reveal";

type Props = {
  id: string;
  index: number;
  labelEn: string;
  labelJp: string;
  title: string;
  children: React.ReactNode;
};

const KANJI_NUMS = ["一", "二", "三", "四", "五", "六", "七", "八", "九"];

export function Section({ id, index, labelEn, labelJp, title, children }: Props) {
  const num = String(index).padStart(2, "0");
  const kanji = KANJI_NUMS[index - 1] ?? "";

  return (
    <section id={id} className="relative py-20 sm:py-28">
      <div className="mx-auto w-full max-w-3xl px-6">
        <Reveal>
          <div className="mb-12 flex items-center gap-5">
            <div className="flex items-baseline gap-2 font-mono text-xs text-[var(--ink-soft)]">
              <span className="text-2xl font-light text-[var(--accent)]/70 tabular-nums">
                {num}
              </span>
              <span className="font-jp text-base text-[var(--accent)]/60">
                {kanji}
              </span>
            </div>
            <div className="flex flex-1 items-baseline gap-2">
              <span className="font-jp text-xs tracking-[0.3em] text-[var(--accent)]">
                {labelJp}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--ink-soft)]">
                · {labelEn}
              </span>
              <span className="ml-2 h-px flex-1 bg-[var(--rule)]" />
            </div>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <h2 className="font-display mb-10 text-3xl leading-[1.15] tracking-tight sm:text-[2.75rem]">
            {title}
          </h2>
        </Reveal>

        <Reveal delay={200}>{children}</Reveal>
      </div>
    </section>
  );
}
