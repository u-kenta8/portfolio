export const profile = {
  name: "Kenta Uneoka",
  tagline: "I build production-grade web platforms with Go, Next.js, and TypeScript.",
  location: "Osaka, Japan (UTC+9)",
  status: "Open to fully remote roles worldwide",
  email: "higasitora415@gmail.com",
  github: "https://github.com/u-kenta8",
  linkedin: "https://www.linkedin.com/in/uneoka-kenta-b138263a0/",
  resumeUrl: "https://github.com/u-kenta8/remote-compass/blob/main/docs/resume.md",

  about: [
    "Senior fullstack engineer with 10+ years shipping production B2B SaaS and e-commerce platforms in Japan. Comfortable owning features end-to-end across Go, Node.js, TypeScript, React, and Next.js — from database schema and API design through to the UI.",
    "Looking for remote roles where I can ship at a senior level and collaborate async-first with a global team. Available 4–6 hours overlap with EU afternoons or US early mornings.",
    "Open to employment via contractor (gyōmu itaku) or Employer of Record (Deel, Remote.com, Oyster) arrangements — happy to work with whichever a team prefers.",
  ],

  skills: [
    { group: "Languages", items: ["Go", "TypeScript", "JavaScript", "PHP", "Python", "Java"] },
    { group: "Frontend", items: ["React", "Next.js", "Vue", "Nuxt", "Tailwind CSS"] },
    { group: "Backend", items: ["Go", "Node.js", "PHP"] },
    { group: "Data", items: ["PostgreSQL", "MySQL", "REST API design", "Data pipelines"] },
    { group: "Cloud / DevOps", items: ["AWS", "Docker", "GitHub Actions", "CI/CD"] },
    { group: "Practices", items: ["System design", "Code review", "Mentoring", "Agile delivery"] },
  ],

  experience: [
    {
      role: "Senior Software Engineer",
      company: "Knowns Inc.",
      companyUrl: "https://knowns.jp/",
      period: "2022 – Present",
      location: "Osaka, Japan",
      lede:
        "B2B SaaS consumer-research and marketing-intelligence platform helping brands collect real-time consumer insights, brand perception data, and influencer analytics across Japan and Asia.",
      bullets: [
        "Built and maintained Go backend services powering the consumer research platform; owned API design and data modeling for survey delivery and analytics.",
        "Developed data collection and analysis pipelines processing high volumes of survey and consumer-behavior data, focusing on throughput, correctness, and production observability.",
        "Shipped Next.js + React frontend features for research dashboards and data-visualization UIs used by marketing and enterprise customers.",
        "Designed and maintained REST API layers consumed by enterprise marketing customers and partner integrations.",
        "Delivered features end-to-end across web and API in a 10-engineer agile team.",
      ],
      stack: ["Go", "Next.js", "React", "Node.js", "PostgreSQL", "REST APIs"],
    },
    {
      role: "Senior Software Engineer",
      company: "Smaregi Inc. (EC Division)",
      companyUrl: "https://smaregi.jp/",
      period: "2015 – 2022 (7 years)",
      location: "Osaka, Japan",
      lede:
        "Cloud POS and omnichannel commerce platform connecting physical retail with Rakuten, Yahoo Shopping, and Amazon marketplaces.",
      bullets: [
        "Designed and shipped backend services for order management, inventory sync, and multi-channel listing across major Japanese e-commerce marketplaces.",
        "Built B2B e-commerce features automating wholesale ordering workflows, replacing manual operations with self-service web tools.",
        "Developed a subscription / repeat-commerce shopping cart with embedded CRM functionality.",
        "Implemented REST API integrations with Rakuten, Yahoo Shopping, Amazon, and partner POS systems — hardening idempotency and retry behavior against unreliable upstream APIs.",
        "Contributed across the stack — PHP services on the backend, React on the frontend — and mentored junior engineers on code review practices.",
      ],
      stack: ["PHP", "Node.js", "React", "JavaScript", "MySQL", "REST APIs"],
    },
  ],

  education: {
    school: "Tsinghua University",
    location: "Beijing",
    degree: "Master of Science, Computer Science",
    year: "2013",
  },

  projects: [
    {
      title: "Remote Compass",
      summary:
        "A remote-job aggregator that ranks listings by working-hour overlap with the candidate's timezone. Parses geographic restrictions hidden in job descriptions and scores each role against the user's working window.",
      tech: ["Next.js 16", "TypeScript", "Server Components", "Go API", "Tailwind"],
      liveUrl: "https://remote-compass-beta.vercel.app/",
      repoUrl: "https://github.com/u-kenta8/remote-compass",
    },
  ],
} as const;

export type Profile = typeof profile;
