type Props = {
  title: string;
  summary: string;
  tech: readonly string[];
  liveUrl: string;
  repoUrl: string;
};

export function ProjectCard({ title, summary, tech, liveUrl, repoUrl }: Props) {
  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-6 transition hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
      <header className="mb-3 flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex gap-3 text-sm">
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-2 transition hover:decoration-zinc-700 dark:text-zinc-100 dark:decoration-zinc-700 dark:hover:decoration-zinc-300"
          >
            Live demo ↗
          </a>
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-600 underline decoration-zinc-300 underline-offset-2 transition hover:decoration-zinc-700 dark:text-zinc-400 dark:decoration-zinc-700 dark:hover:decoration-zinc-300"
          >
            Source ↗
          </a>
        </div>
      </header>

      <p className="mb-4 text-zinc-700 dark:text-zinc-300">{summary}</p>

      <div className="flex flex-wrap gap-1.5">
        {tech.map((t) => (
          <span
            key={t}
            className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
          >
            {t}
          </span>
        ))}
      </div>
    </article>
  );
}
