import { profile } from "@/content/profile";
import { Section } from "@/components/Section";
import { ExperienceCard } from "@/components/ExperienceCard";
import { ProjectCard } from "@/components/ProjectCard";
import { SkillGroup } from "@/components/SkillGroup";
import { JsonLd } from "@/components/JsonLd";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 bg-paper text-ink">
      <JsonLd />
      <Nav />
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

function Nav() {
  return (
    <nav className="sticky top-0 z-30 border-b border-[var(--rule)] bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-3">
        <a href="#top" className="flex items-center gap-2 text-sm font-semibold tracking-tight">
          <span className="font-display text-base text-[var(--accent)]">K·U</span>
          <span className="hidden text-[var(--ink-soft)] sm:inline">{profile.name}</span>
        </a>
        <div className="hidden gap-6 text-xs uppercase tracking-[0.15em] text-[var(--ink-soft)] sm:flex">
          <a href="#about" className="transition hover:text-ink">About</a>
          <a href="#skills" className="transition hover:text-ink">Skills</a>
          <a href="#experience" className="transition hover:text-ink">Work</a>
          <a href="#projects" className="transition hover:text-ink">Projects</a>
          <a href="#contact" className="transition hover:text-ink">Contact</a>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <header id="top" className="relative overflow-hidden">
      <div className="seigaiha absolute inset-0 opacity-60" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-paper/30 to-paper" aria-hidden />

      <div className="relative mx-auto w-full max-w-3xl px-6 pb-24 pt-20 sm:pb-32 sm:pt-28">
        <div className="fade-up mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--rule)] bg-paper/80 px-3 py-1 text-xs backdrop-blur">
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
          <span className="font-medium text-[var(--ink-soft)]">{profile.status}</span>
        </div>

        <h1 className="fade-up fade-up-delay-1 font-display text-[2.5rem] leading-[1.1] tracking-tight sm:text-6xl">
          {profile.tagline}
        </h1>

        <p className="fade-up fade-up-delay-2 font-jp mt-6 text-lg leading-relaxed text-[var(--ink-soft)] sm:text-xl">
          {profile.taglineJp}
        </p>

        <div className="fade-up fade-up-delay-3 mt-10 flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <span className="font-display text-2xl tracking-tight">{profile.name}</span>
          <span className="font-jp text-base text-[var(--ink-soft)]">「{profile.nameJp}」</span>
          <span className="text-[var(--rule)]">·</span>
          <span className="text-[var(--ink-soft)]">Senior Fullstack Engineer</span>
          <span className="text-[var(--rule)]">·</span>
          <span className="text-[var(--ink-soft)]">{profile.location}</span>
        </div>

        <div className="fade-up fade-up-delay-3 mt-10 flex flex-wrap gap-3 text-sm">
          <a
            href={`mailto:${profile.email}`}
            className="rounded-full bg-[var(--accent)] px-5 py-2.5 font-medium text-paper shadow-sm transition hover:bg-[var(--accent-soft)] hover:shadow-md"
          >
            Email me
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-[var(--rule)] bg-paper/80 px-5 py-2.5 font-medium backdrop-blur transition hover:border-[var(--accent)]/50 hover:text-[var(--accent)]"
          >
            LinkedIn ↗
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-[var(--rule)] bg-paper/80 px-5 py-2.5 font-medium backdrop-blur transition hover:border-[var(--accent)]/50 hover:text-[var(--accent)]"
          >
            GitHub ↗
          </a>
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-[var(--rule)] bg-paper/80 px-5 py-2.5 font-medium backdrop-blur transition hover:border-[var(--accent)]/50 hover:text-[var(--accent)]"
          >
            Resume ↗
          </a>
        </div>
      </div>

      <div className="absolute bottom-4 right-6 hidden text-[10px] uppercase tracking-[0.3em] text-[var(--ink-soft)] sm:block">
        scroll ↓
      </div>
    </header>
  );
}

function About() {
  return (
    <Section
      id="about"
      labelEn={profile.labels.about.en}
      labelJp={profile.labels.about.jp}
      title="What I do, and what I'm looking for"
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
      labelEn={profile.labels.skills.en}
      labelJp={profile.labels.skills.jp}
      title="The stack I reach for"
    >
      <div>
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
      labelEn={profile.labels.experience.en}
      labelJp={profile.labels.experience.jp}
      title="Where I've shipped production work"
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
      labelEn={profile.labels.education.en}
      labelJp={profile.labels.education.jp}
      title="Where I studied"
    >
      <div className="rounded-2xl border border-[var(--rule)] bg-paper/40 p-7 backdrop-blur-sm">
        <p className="font-display text-lg">{degree}</p>
        <p className="mt-2 text-[var(--ink-soft)]">
          {school} <span className="font-jp">「{schoolJp}」</span> · {location} · {year}
        </p>
      </div>
    </Section>
  );
}

function Contact() {
  return (
    <Section
      id="contact"
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
        <a
          href={`mailto:${profile.email}`}
          className="rounded-full bg-[var(--accent)] px-5 py-2.5 font-medium text-paper shadow-sm transition hover:bg-[var(--accent-soft)] hover:shadow-md"
        >
          {profile.email}
        </a>
        <a
          href={profile.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-[var(--rule)] bg-paper/80 px-5 py-2.5 font-medium backdrop-blur transition hover:border-[var(--accent)]/50 hover:text-[var(--accent)]"
        >
          LinkedIn ↗
        </a>
        <a
          href={profile.github}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-[var(--rule)] bg-paper/80 px-5 py-2.5 font-medium backdrop-blur transition hover:border-[var(--accent)]/50 hover:text-[var(--accent)]"
        >
          GitHub ↗
        </a>
      </div>
    </Section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[var(--rule)] px-6 py-10 text-center text-xs text-[var(--ink-soft)]">
      <p>
        © {new Date().getFullYear()} {profile.name}
        <span className="mx-2 text-[var(--rule)]">·</span>
        <span className="font-jp">大阪より、心を込めて</span>
        <span className="mx-2 text-[var(--rule)]">·</span>
        Made with Next.js
      </p>
    </footer>
  );
}
