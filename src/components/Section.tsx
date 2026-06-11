type Props = {
  id: string;
  labelEn: string;
  labelJp: string;
  title: string;
  children: React.ReactNode;
};

export function Section({ id, labelEn, labelJp, title, children }: Props) {
  return (
    <section id={id} className="relative py-20 sm:py-28">
      <div className="mx-auto w-full max-w-3xl px-6">
        <div className="mb-10 flex items-center gap-4">
          <div className="flex items-baseline gap-2">
            <span className="font-jp text-xs tracking-[0.3em] text-[var(--accent)]">
              {labelJp}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--ink-soft)]">
              · {labelEn}
            </span>
          </div>
          <span className="h-px flex-1 bg-[var(--rule)]" />
        </div>
        <h2 className="font-display mb-10 text-3xl leading-tight sm:text-4xl">
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
}
