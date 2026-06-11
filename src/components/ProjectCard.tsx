type Props = {
  title: string;
  summary: string;
  tech: readonly string[];
  liveUrl: string;
  repoUrl: string;
};

export function ProjectCard({ title, summary, tech, liveUrl, repoUrl }: Props) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-[var(--rule)] bg-paper/40 p-7 backdrop-blur-sm transition-all duration-500 hover:-translate-y-0.5 hover:border-[var(--accent)]/40 hover:shadow-[0_24px_60px_-20px_rgba(43,58,85,0.25)]">
      <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[var(--accent)]/0 blur-3xl transition-all duration-700 group-hover:bg-[var(--accent)]/10" />

      <div className="absolute right-6 top-6 font-jp text-3xl text-[var(--accent)]/15 transition group-hover:text-[var(--accent)]/30">
        作
      </div>

      <header className="mb-4">
        <h3 className="font-display text-2xl tracking-tight">{title}</h3>
        <div className="mt-2 flex flex-wrap gap-4 text-sm">
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group/link relative font-medium text-[var(--accent)] transition"
          >
            <span className="border-b border-[var(--accent)]/40 pb-0.5 transition group-hover/link:border-[var(--accent)]">
              Live demo
            </span>
            <span aria-hidden className="ml-1">↗</span>
          </a>
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group/link relative text-[var(--ink-soft)] transition hover:text-ink"
          >
            <span className="border-b border-[var(--rule)] pb-0.5 transition group-hover/link:border-[var(--ink-soft)]">
              Source
            </span>
            <span aria-hidden className="ml-1">↗</span>
          </a>
        </div>
      </header>

      <p className="mb-5 leading-relaxed text-ink/85">{summary}</p>

      <div className="flex flex-wrap gap-1.5">
        {tech.map((t) => (
          <span
            key={t}
            className="rounded-full border border-[var(--rule)] bg-paper/60 px-3 py-1 text-xs font-medium text-[var(--ink-soft)] transition hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
          >
            {t}
          </span>
        ))}
      </div>
    </article>
  );
}
