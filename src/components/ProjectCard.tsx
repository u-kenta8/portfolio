type Props = {
  title: string;
  summary: string;
  tech: readonly string[];
  liveUrl: string;
  repoUrl: string;
};

export function ProjectCard({ title, summary, tech, liveUrl, repoUrl }: Props) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-[var(--rule)] bg-paper/40 p-7 backdrop-blur-sm transition hover:border-[var(--accent)]/40 hover:shadow-[0_10px_40px_-15px_rgba(43,58,85,0.25)]">
      <div className="absolute right-6 top-6 text-3xl text-[var(--accent)]/15 transition group-hover:text-[var(--accent)]/30">
        ⌘
      </div>

      <header className="mb-4">
        <h3 className="font-display text-2xl tracking-tight">{title}</h3>
        <div className="mt-2 flex flex-wrap gap-4 text-sm">
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[var(--accent)] underline decoration-[var(--accent)]/30 underline-offset-4 transition hover:decoration-[var(--accent)]"
          >
            Live demo ↗
          </a>
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--ink-soft)] underline decoration-[var(--rule)] underline-offset-4 transition hover:text-ink hover:decoration-[var(--ink-soft)]"
          >
            Source ↗
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
