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
    <article className="group relative overflow-hidden rounded-2xl border border-[var(--rule)] bg-paper/40 p-7 backdrop-blur-sm transition hover:border-[var(--accent)]/40 hover:shadow-[0_10px_40px_-15px_rgba(43,58,85,0.25)]">
      <div className="absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-[var(--accent)] via-[var(--accent)]/40 to-transparent opacity-60" />

      <header className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h3 className="font-display text-xl tracking-tight">{role}</h3>
          <p className="mt-1 text-[var(--ink-soft)]">
            <a
              href={companyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[var(--accent)] underline decoration-[var(--accent)]/30 underline-offset-4 transition hover:decoration-[var(--accent)]"
            >
              {company}
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
              className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-[var(--accent)]/60"
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
