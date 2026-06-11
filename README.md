# kenta-uneoka — Personal portfolio

Personal site for Kenta Uneoka, fullstack engineer based in Japan.

🌐 **Live:** _deployment pending_

## Stack

- Next.js 16 (App Router) · TypeScript · Tailwind CSS v4
- Deployed on Vercel (free tier)

## Develop

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Structure

```
src/
├── app/
│   ├── layout.tsx          # global layout + metadata
│   ├── page.tsx            # single-page portfolio
│   └── globals.css
├── components/
│   ├── Section.tsx         # reusable section wrapper
│   ├── ExperienceCard.tsx
│   ├── ProjectCard.tsx
│   └── SkillGroup.tsx
└── content/
    └── profile.ts          # single source of truth for site content
```

Edit `src/content/profile.ts` to update site content — everything else reads from it.
