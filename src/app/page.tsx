import { profile } from "@/content/profile";
import { Section } from "@/components/Section";
import { ExperienceCard } from "@/components/ExperienceCard";
import { ProjectCard } from "@/components/ProjectCard";
import { SkillGroup } from "@/components/SkillGroup";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 bg-zinc-50 font-sans text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
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
    <nav className="sticky top-0 z-20 border-b border-zinc-200/60 bg-zinc-50/80 backdrop-blur dark:border-zinc-800/60 dark:bg-zinc-950/80">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-3">
        <a href="#top" className="text-sm font-semibold tracking-tight">
          {profile.name}
        </a>
        <div className="hidden gap-5 text-sm text-zinc-600 sm:flex dark:text-zinc-400">
          <a href="#about" className="hover:text-zinc-900 dark:hover:text-zinc-100">About</a>
          <a href="#skills" className="hover:text-zinc-900 dark:hover:text-zinc-100">Skills</a>
          <a href="#experience" className="hover:text-zinc-900 dark:hover:text-zinc-100">Experience</a>
          <a href="#projects" className="hover:text-zinc-900 dark:hover:text-zinc-100">Projects</a>
          <a href="#contact" className="hover:text-zinc-900 dark:hover:text-zinc-100">Contact</a>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <header id="top" className="mx-auto w-full max-w-3xl px-6 pb-12 pt-16 sm:pt-24">
      <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
        <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
        {profile.status}
      </div>
      <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
        {profile.tagline}
      </h1>
      <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
        {profile.name} · {profile.location}
      </p>
      <div className="mt-8 flex flex-wrap gap-3 text-sm">
        <a
          href={`mailto:${profile.email}`}
          className="rounded-full bg-zinc-900 px-4 py-2 font-medium text-zinc-50 transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Email me
        </a>
        <a
          href={profile.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-zinc-300 px-4 py-2 font-medium transition hover:border-zinc-500 dark:border-zinc-700 dark:hover:border-zinc-500"
        >
          LinkedIn
        </a>
        <a
          href={profile.github}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-zinc-300 px-4 py-2 font-medium transition hover:border-zinc-500 dark:border-zinc-700 dark:hover:border-zinc-500"
        >
          GitHub
        </a>
        <a
          href={profile.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-zinc-300 px-4 py-2 font-medium transition hover:border-zinc-500 dark:border-zinc-700 dark:hover:border-zinc-500"
        >
          Resume
        </a>
      </div>
    </header>
  );
}

function About() {
  return (
    <Section id="about" eyebrow="About" title="What I do, and what I'm looking for">
      <div className="space-y-4 text-zinc-700 dark:text-zinc-300">
        {profile.about.map((p) => (
          <p key={p} className="leading-relaxed">
            {p}
          </p>
        ))}
      </div>
    </Section>
  );
}

function Skills() {
  return (
    <Section id="skills" eyebrow="Skills" title="Stack I work with">
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
    <Section id="experience" eyebrow="Experience" title="Where I've shipped">
      <div className="space-y-4">
        {profile.experience.map((role) => (
          <ExperienceCard key={role.company} {...role} />
        ))}
      </div>
    </Section>
  );
}

function Projects() {
  return (
    <Section id="projects" eyebrow="Projects" title="What I'm building">
      <div className="space-y-4">
        {profile.projects.map((project) => (
          <ProjectCard key={project.title} {...project} />
        ))}
      </div>
    </Section>
  );
}

function Education() {
  const { school, location, degree, year } = profile.education;
  return (
    <Section id="education" eyebrow="Education" title="Where I studied">
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="font-semibold">{degree}</p>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">
          {school} · {location} · {year}
        </p>
      </div>
    </Section>
  );
}

function Contact() {
  return (
    <Section id="contact" eyebrow="Contact" title="Get in touch">
      <p className="mb-6 text-zinc-700 dark:text-zinc-300">
        Best way to reach me is email. I reply within a day, usually faster.
      </p>
      <div className="flex flex-wrap gap-3 text-sm">
        <a
          href={`mailto:${profile.email}`}
          className="rounded-full bg-zinc-900 px-4 py-2 font-medium text-zinc-50 transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          {profile.email}
        </a>
        <a
          href={profile.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-zinc-300 px-4 py-2 font-medium transition hover:border-zinc-500 dark:border-zinc-700 dark:hover:border-zinc-500"
        >
          LinkedIn
        </a>
        <a
          href={profile.github}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-zinc-300 px-4 py-2 font-medium transition hover:border-zinc-500 dark:border-zinc-700 dark:hover:border-zinc-500"
        >
          GitHub
        </a>
      </div>
    </Section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-zinc-200 px-6 py-10 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-500">
      © {new Date().getFullYear()} {profile.name}
    </footer>
  );
}
