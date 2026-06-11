type Props = {
  role: string;
  company: string;
  companyUrl: string;
  period: string;
  location: string;
  lede: string;
  bullets: readonly string[];
  stack: readonly string[];
};

export function ExperienceCard({
  role,
  company,
  companyUrl,
  period,
  location,
  lede,
  bullets,
  stack,
}: Props) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-[var(--rule)] bg-paper/40 p-7 backdrop-blur-sm transition-all duration-500 hover:-translate-y-0.5 hover:border-[var(--accent)]/40 hover:shadow-[0_24px_60px_-20px_rgba(43,58,85,0.25)]">
      <div className="absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-[var(--accent)] via-[var(--accent)]/40 to-transparent opacity-60 transition-opacity group-hover:opacity-100" />
      <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[var(--accent)]/0 blur-3xl transition-all duration-700 group-hover:bg-[var(--accent)]/10" />

      <header className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h3 className="font-display text-xl tracking-tight">{role}</h3>
          <p className="mt-1 text-[var(--ink-soft)]">
            <a
              href={companyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative font-medium text-[var(--accent)] transition"
            >
              <span className="border-b border-[var(--accent)]/30 pb-0.5 transition group-hover:border-[var(--accent)] hover:border-[var(--accent)]">
                {company}
              </span>
              <span aria-hidden className="ml-0.5">↗</span>
            </a>
            <span className="mx-2 text-[var(--rule)]">·</span>
            {location}
          </p>
        </div>
        <p className="font-jp text-sm text-[var(--ink-soft)]">{period}</p>
      </header>

      <p className="mb-5 italic leading-relaxed text-[var(--ink-soft)]">{lede}</p>

      <ul className="mb-5 space-y-2.5">
        {bullets.map((b) => (
          <li
            key={b}
            className="flex gap-3 text-[15px] leading-relaxed text-ink/85"
          >
            <span
              aria-hidden
              className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-[var(--accent)]/60 transition group-hover:bg-[var(--accent)]"
            />
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-1.5">
        {stack.map((tech) => (
          <span
            key={tech}
            className="rounded-full border border-[var(--rule)] bg-paper/60 px-3 py-1 text-xs font-medium text-[var(--ink-soft)] transition hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
          >
            {tech}
          </span>
        ))}
      </div>
    </article>
  );
}
