"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Work" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

export function Nav({ name }: { name: string }) {
  const [active, setActive] = useState<string>("top");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop;
      const maxScroll = h.scrollHeight - h.clientHeight;
      setProgress(maxScroll > 0 ? (scrolled / maxScroll) * 100 : 0);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <nav className="sticky top-0 z-30 border-b border-[var(--rule)] bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-3">
        <a
          href="#top"
          className="group flex items-center gap-2.5 text-sm font-semibold tracking-tight"
        >
          <span className="grid h-7 w-7 place-items-center rounded-full border border-[var(--accent)]/30 bg-paper text-xs font-bold text-[var(--accent)] transition group-hover:border-[var(--accent)]">
            KU
          </span>
          <span className="hidden text-[var(--ink-soft)] transition group-hover:text-ink sm:inline">
            {name}
          </span>
        </a>
        <div className="hidden gap-1 text-xs uppercase tracking-[0.15em] sm:flex">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`relative px-2.5 py-1 transition ${
                active === s.id
                  ? "text-[var(--accent)]"
                  : "text-[var(--ink-soft)] hover:text-ink"
              }`}
            >
              {s.label}
              {active === s.id && (
                <span className="absolute -bottom-[1px] left-2 right-2 h-[2px] rounded-full bg-[var(--accent)]" />
              )}
            </a>
          ))}
          <Link
            href="/blog"
            className="relative px-2.5 py-1 text-[var(--ink-soft)] transition hover:text-ink"
          >
            Blog
          </Link>
        </div>
      </div>
      <div
        className="h-[2px] origin-left bg-gradient-to-r from-[var(--accent)] via-[var(--accent-soft)] to-[var(--accent)] transition-transform duration-100"
        style={{ transform: `scaleX(${progress / 100})` }}
        aria-hidden
      />
    </nav>
  );
}
