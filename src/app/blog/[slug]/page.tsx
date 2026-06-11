import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { allPosts, getPostBySlug } from "@/content/posts";
import { profile } from "@/content/profile";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return allPosts.map((p) => ({ slug: p.meta.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.meta.title,
    description: post.meta.description,
    alternates: { canonical: `/blog/${post.meta.slug}` },
    openGraph: {
      title: post.meta.title,
      description: post.meta.description,
      type: "article",
      publishedTime: post.meta.date,
      authors: [profile.name],
      tags: [...post.meta.tags],
    },
    twitter: {
      card: "summary_large_image",
      title: post.meta.title,
      description: post.meta.description,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { meta, Component } = post;

  return (
    <div className="flex flex-col flex-1 bg-paper text-ink">
      <header className="mx-auto w-full max-w-3xl px-6 pt-12">
        <Link
          href="/blog"
          className="text-xs uppercase tracking-[0.18em] text-[var(--ink-soft)] transition hover:text-ink"
        >
          ← All posts
        </Link>
      </header>

      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-10 sm:pt-16">
        <div className="mb-6 flex items-center gap-3 text-xs text-[var(--ink-soft)]">
          <time dateTime={meta.date}>{formatDate(meta.date)}</time>
          <span className="text-[var(--rule)]">·</span>
          <span>{meta.readingMinutes} min read</span>
        </div>

        <h1 className="font-display mb-5 text-4xl leading-[1.1] tracking-tight sm:text-5xl">
          {meta.title}
        </h1>

        <p className="mb-8 text-lg leading-relaxed text-[var(--ink-soft)]">
          {meta.description}
        </p>

        <div className="mb-12 flex flex-wrap gap-1.5">
          {meta.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-[var(--rule)] bg-paper/60 px-2.5 py-0.5 text-xs font-medium text-[var(--ink-soft)]"
            >
              {t}
            </span>
          ))}
        </div>

        <Component />

        <footer className="mt-16 flex flex-col gap-4 border-t border-[var(--rule)] pt-10 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[var(--ink-soft)]">Written by</p>
            <p className="font-display text-lg">{profile.name}</p>
            <p className="text-xs text-[var(--ink-soft)]">
              Senior Fullstack Engineer · Osaka, Japan
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-[var(--rule)] bg-paper/80 px-4 py-2 font-medium transition hover:border-[var(--accent)]/50 hover:text-[var(--accent)]"
            >
              LinkedIn ↗
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-[var(--rule)] bg-paper/80 px-4 py-2 font-medium transition hover:border-[var(--accent)]/50 hover:text-[var(--accent)]"
            >
              GitHub ↗
            </a>
          </div>
        </footer>
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
