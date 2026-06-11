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
    <article className="rounded-2xl border border-zinc-200 bg-white p-6 transition hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
      <header className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold">{role}</h3>
          <p className="text-zinc-600 dark:text-zinc-400">
            <a
              href={companyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-zinc-300 underline-offset-2 transition hover:decoration-zinc-700 dark:decoration-zinc-700 dark:hover:decoration-zinc-300"
            >
              {company}
            </a>{" "}
            · {location}
          </p>
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{period}</p>
      </header>

      <p className="mb-4 italic text-zinc-700 dark:text-zinc-300">{lede}</p>

      <ul className="mb-4 space-y-2">
        {bullets.map((b) => (
          <li key={b} className="flex gap-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
            <span aria-hidden className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-zinc-400 dark:bg-zinc-600" />
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-1.5">
        {stack.map((tech) => (
          <span
            key={tech}
            className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
          >
            {tech}
          </span>
        ))}
      </div>
    </article>
  );
}
