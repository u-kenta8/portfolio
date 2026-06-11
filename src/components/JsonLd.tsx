import { profile } from "@/content/profile";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://kenta-uneoka.vercel.app";

export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: profile.name,
        givenName: "Kenta",
        familyName: "Uneoka",
        jobTitle: "Senior Fullstack Engineer",
        description:
          "Senior fullstack engineer with 10+ years shipping production B2B SaaS and e-commerce platforms in Japan. Open to fully remote roles worldwide.",
        url: SITE_URL,
        email: `mailto:${profile.email}`,
        image: `${SITE_URL}/og.png`,
        sameAs: [profile.github, profile.linkedin],
        knowsLanguage: ["Japanese", "English"],
        knowsAbout: [
          "Go (programming language)",
          "TypeScript",
          "JavaScript",
          "React",
          "Next.js",
          "Vue",
          "Nuxt",
          "Node.js",
          "PHP",
          "PostgreSQL",
          "MySQL",
          "REST API design",
          "Data pipelines",
          "AWS",
          "Docker",
          "System design",
        ],
        address: {
          "@type": "PostalAddress",
          addressLocality: "Osaka",
          addressCountry: "JP",
        },
        alumniOf: {
          "@type": "CollegeOrUniversity",
          name: profile.education.school,
          sameAs: "https://www.tsinghua.edu.cn/en/",
        },
        worksFor: {
          "@type": "Organization",
          name: profile.experience[0].company,
          url: profile.experience[0].companyUrl,
        },
        seeks: {
          "@type": "Demand",
          itemOffered: {
            "@type": "JobPosting",
            jobLocationType: "TELECOMMUTE",
            title: "Senior Fullstack Engineer (remote)",
          },
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: `${profile.name} — Portfolio`,
        description: profile.tagline,
        publisher: { "@id": `${SITE_URL}/#person` },
        inLanguage: "en-US",
      },
      {
        "@type": "ProfilePage",
        "@id": `${SITE_URL}/#profile`,
        url: SITE_URL,
        about: { "@id": `${SITE_URL}/#person` },
        mainEntity: { "@id": `${SITE_URL}/#person` },
        inLanguage: "en-US",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
