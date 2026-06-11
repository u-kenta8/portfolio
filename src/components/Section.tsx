type Props = {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
};

export function Section({ id, eyebrow, title, children }: Props) {
  return (
    <section id={id} className="border-t border-zinc-200 py-16 dark:border-zinc-800">
      <div className="mx-auto w-full max-w-3xl px-6">
        <div className="mb-8 flex items-baseline gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
            {eyebrow}
          </span>
          <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <h2 className="mb-8 text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
}
