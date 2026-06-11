import { profile } from "@/content/profile";
import { Section } from "@/components/Section";
import { ExperienceCard } from "@/components/ExperienceCard";
import { ProjectCard } from "@/components/ProjectCard";
import { SkillGroup } from "@/components/SkillGroup";
import { JsonLd } from "@/components/JsonLd";
import { Nav } from "@/components/Nav";
import { Enso } from "@/components/Enso";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 bg-paper text-ink">
      <JsonLd />
      <Nav name={profile.name} />
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Education />
      <Contact />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <header
      id="top"
      className="relative overflow-hidden border-b border-[var(--rule)]"
    >
      {/* Layer 1: drifting warm radial glow */}
      <div
        className="animate-drift absolute -left-32 -top-32 h-[480px] w-[480px] rounded-full"
        aria-hidden
        style={{
          background:
            "radial-gradient(circle, var(--gold-soft) 0%, transparent 70%)",
        }}
      />
      {/* Layer 2: drifting indigo radial glow */}
      <div
        className="animate-drift-2 absolute -right-32 top-1/3 h-[520px] w-[520px] rounded-full"
        aria-hidden
        style={{
          background:
            "radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)",
        }}
      />
      {/* Layer 3: seigaiha wave pattern */}
      <div className="seigaiha absolute inset-0 opacity-40" aria-hidden />
      {/* Layer 4: soft fade to page */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-paper/30 to-paper"
        aria-hidden
      />
      {/* Layer 5: Enso ink circle decoration */}
      <Enso
        className="animate-ink-fade pointer-events-none absolute -right-16 -top-12 text-[var(--accent)]/30 sm:-right-4 sm:-top-4"
        size={360}
      />

      <div className="relative mx-auto w-full max-w-3xl px-6 pb-28 pt-20 sm:pb-36 sm:pt-32">
        {/* Avatar + status row */}
        <div className="fade-up mb-8 flex items-center gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-full border border-[var(--accent)]/40 bg-paper font-display text-base font-bold text-[var(--accent)] shadow-sm">
            KU
          </div>
          <div className="flex items-center gap-2 rounded-full border border-[var(--rule)] bg-paper/80 px-3 py-1 text-xs backdrop-blur">
            <span className="relative inline-flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="font-medium text-[var(--ink-soft)]">
              {profile.status}
            </span>
          </div>
        </div>

        {/* Headline */}
        <h1 className="fade-up fade-up-delay-1 font-display text-[2.75rem] leading-[1.08] tracking-tight sm:text-[4.5rem]">
          {profile.tagline}
        </h1>

        {/* JP tagline */}
        <p className="fade-up fade-up-delay-2 font-jp mt-7 text-lg leading-relaxed text-[var(--ink-soft)] sm:text-xl">
          {profile.taglineJp}
        </p>

        {/* Identity row */}
        <div className="fade-up fade-up-delay-3 mt-12 flex flex-wrap items-baseline gap-x-4 gap-y-2 text-sm">
          <span className="font-display text-xl font-semibold tracking-tight">
            {profile.name}
          </span>
          <span className="font-jp text-base text-[var(--ink-soft)]">
            「{profile.nameJp}」
          </span>
          <span className="text-[var(--rule)]">·</span>
          <span className="text-[var(--ink-soft)]">
            Senior Fullstack Engineer
          </span>
          <span className="text-[var(--rule)]">·</span>
          <span className="text-[var(--ink-soft)]">{profile.location}</span>
        </div>

        {/* Stats bar */}
        <div className="fade-up fade-up-delay-3 mt-10 grid max-w-xl grid-cols-3 gap-px overflow-hidden rounded-2xl border border-[var(--rule)] bg-[var(--rule)] text-center">
          <Stat value="10+" label="Years shipping" labelJp="経験年数" />
          <Stat value="6" label="Languages" labelJp="言語" />
          <Stat value="JST" label="UTC+9 base" labelJp="拠点" />
        </div>

        {/* CTAs */}
        <div className="fade-up fade-up-delay-3 mt-10 flex flex-wrap gap-3 text-sm">
          <CtaPrimary href={`mailto:${profile.email}`}>Email me</CtaPrimary>
          <CtaSecondary href={profile.linkedin}>LinkedIn ↗</CtaSecondary>
          <CtaSecondary href={profile.github}>GitHub ↗</CtaSecondary>
          <CtaSecondary href={profile.resumeUrl}>Resume ↗</CtaSecondary>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 sm:block">
        <div className="flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[var(--ink-soft)]">
          <span>Scroll</span>
          <span className="animate-bounce-slow inline-block">↓</span>
        </div>
      </div>
    </header>
  );
}

function Stat({
  value,
  label,
  labelJp,
}: {
  value: string;
  label: string;
  labelJp: string;
}) {
  return (
    <div className="bg-paper px-3 py-4">
      <div className="font-display text-2xl font-bold tracking-tight text-[var(--accent)] sm:text-3xl">
        {value}
      </div>
      <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[var(--ink-soft)]">
        {label}
      </div>
      <div className="font-jp text-[10px] text-[var(--ink-soft)]/70">
        {labelJp}
      </div>
    </div>
  );
}

function CtaPrimary({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="group relative overflow-hidden rounded-full bg-[var(--accent)] px-5 py-2.5 font-medium text-paper shadow-[0_4px_18px_-4px_rgba(43,58,85,0.4)] transition hover:shadow-[0_8px_24px_-4px_rgba(43,58,85,0.5)]"
    >
      <span className="relative z-10">{children}</span>
      <span
        aria-hidden
        className="absolute inset-0 origin-left scale-x-0 bg-[var(--accent-soft)] transition-transform duration-500 ease-out group-hover:scale-x-100"
      />
    </a>
  );
}

function CtaSecondary({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative overflow-hidden rounded-full border border-[var(--rule)] bg-paper/80 px-5 py-2.5 font-medium backdrop-blur transition hover:border-[var(--accent)]/50"
    >
      <span className="relative z-10 transition group-hover:text-[var(--accent)]">
        {children}
      </span>
    </a>
  );
}

function About() {
  return (
    <Section
      id="about"
      index={1}
      labelEn={profile.labels.about.en}
      labelJp={profile.labels.about.jp}
      title="What I do, and what I'm looking for"
      tone="tint"
    >
      <div className="space-y-5 text-[17px] leading-relaxed text-ink/85">
        {profile.about.map((p, i) => (
          <p key={p} className={i === 0 ? "text-lg" : ""}>
            {p}
          </p>
        ))}
      </div>
    </Section>
  );
}

function Skills() {
  return (
    <Section
      id="skills"
      index={2}
      labelEn={profile.labels.skills.en}
      labelJp={profile.labels.skills.jp}
      title="The stack I reach for"
    >
      <div className="rounded-2xl border border-[var(--rule)] bg-paper/40 p-4 backdrop-blur-sm sm:p-6">
        {profile.skills.map((group) => (
          <SkillGroup key={group.group} group={group.group} items={group.items} />
        ))}
      </div>
    </Section>
  );
}

function Experience() {
  return (
    <Section
      id="experience"
      index={3}
      labelEn={profile.labels.experience.en}
      labelJp={profile.labels.experience.jp}
      title="Where I've shipped production work"
      tone="tint"
    >
      <div className="space-y-5">
        {profile.experience.map((role) => (
          <ExperienceCard key={role.company} {...role} />
        ))}
      </div>
    </Section>
  );
}

function Projects() {
  return (
    <Section
      id="projects"
      index={4}
      labelEn={profile.labels.projects.en}
      labelJp={profile.labels.projects.jp}
      title="What I'm building in the open"
    >
      <div className="space-y-5">
        {profile.projects.map((project) => (
          <ProjectCard key={project.title} {...project} />
        ))}
      </div>
    </Section>
  );
}

function Education() {
  const { school, schoolJp, location, degree, year } = profile.education;
  return (
    <Section
      id="education"
      index={5}
      labelEn={profile.labels.education.en}
      labelJp={profile.labels.education.jp}
      title="Where I studied"
      tone="tint"
    >
      <div className="rounded-2xl border border-[var(--rule)] bg-paper/40 p-7 backdrop-blur-sm">
        <p className="font-display text-lg">{degree}</p>
        <p className="mt-2 text-[var(--ink-soft)]">
          {school} <span className="font-jp">「{schoolJp}」</span> · {location} ·{" "}
          {year}
        </p>
      </div>
    </Section>
  );
}

function Contact() {
  return (
    <Section
      id="contact"
      index={6}
      labelEn={profile.labels.contact.en}
      labelJp={profile.labels.contact.jp}
      title="Let's talk"
    >
      <p className="mb-8 text-[17px] leading-relaxed text-ink/85">
        Email is the best way to reach me. I reply within one day, usually faster.
        <br />
        <span className="font-jp text-[var(--ink-soft)]">
          メールが一番早いです。一日以内にお返事します。
        </span>
      </p>
      <div className="flex flex-wrap gap-3 text-sm">
        <CtaPrimary href={`mailto:${profile.email}`}>{profile.email}</CtaPrimary>
        <CtaSecondary href={profile.linkedin}>LinkedIn ↗</CtaSecondary>
        <CtaSecondary href={profile.github}>GitHub ↗</CtaSecondary>
      </div>
    </Section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[var(--rule)] px-6 py-12">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-3 text-center text-xs text-[var(--ink-soft)] sm:flex-row sm:justify-between">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <p className="font-jp">大阪より、心を込めて</p>
        <p>Built with Next.js · Deployed on Vercel</p>
      </div>
    </footer>
  );
}
