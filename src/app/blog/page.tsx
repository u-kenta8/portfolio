import type { Metadata } from "next";
import Link from "next/link";
import { allPosts } from "@/content/posts";
import { profile } from "@/content/profile";

export const metadata: Metadata = {
  title: "Blog",
  description: `Notes on software engineering, system design, and remote work by ${profile.name}.`,
  alternates: { canonical: "/blog" },
};

export default function BlogIndex() {
  return (
    <div className="flex flex-col flex-1 bg-paper text-ink">
      <header className="mx-auto w-full max-w-3xl px-6 pt-12">
        <Link
          href="/"
          className="text-xs uppercase tracking-[0.18em] text-[var(--ink-soft)] transition hover:text-ink"
        >
          ← Back home
        </Link>
      </header>

      <main className="mx-auto w-full max-w-3xl px-6 pb-20 pt-12 sm:pt-20">
        <div className="mb-12 flex items-baseline gap-3">
          <span className="font-jp text-xs tracking-[0.3em] text-[var(--accent)]">
            技術ブログ
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--ink-soft)]">
            · Blog
          </span>
          <span className="ml-2 h-px flex-1 bg-[var(--rule)]" />
        </div>

        <h1 className="font-display mb-3 text-4xl leading-tight tracking-tight sm:text-5xl">
          Notes on shipping software
        </h1>
        <p className="mb-12 max-w-2xl text-lg leading-relaxed text-[var(--ink-soft)]">
          System design choices, production stories, and what I&rsquo;ve learned
          building remote-friendly platforms from Japan.
        </p>

        <ul className="space-y-6">
          {allPosts.map(({ meta }) => (
            <li key={meta.slug}>
              <Link
                href={`/blog/${meta.slug}`}
                className="group block rounded-xl border border-[var(--rule)] bg-paper/40 p-6 transition hover:-translate-y-0.5 hover:border-[var(--accent)]/40 hover:shadow-[0_24px_60px_-20px_rgba(43,58,85,0.18)]"
              >
                <div className="mb-2 flex items-center gap-3 text-xs text-[var(--ink-soft)]">
                  <time dateTime={meta.date}>{formatDate(meta.date)}</time>
                  <span className="text-[var(--rule)]">·</span>
                  <span>{meta.readingMinutes} min read</span>
                </div>
                <h2 className="font-display text-2xl leading-tight tracking-tight transition group-hover:text-[var(--accent)]">
                  {meta.title}
                </h2>
                <p className="mt-3 text-[15px] leading-relaxed text-ink/85">
                  {meta.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {meta.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-[var(--rule)] bg-paper/60 px-2.5 py-0.5 text-xs font-medium text-[var(--ink-soft)]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00Z");
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
