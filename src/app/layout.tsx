import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { profile } from "@/content/profile";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://kenta-uneoka.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${profile.name} — Senior Fullstack Engineer`,
    template: `%s — ${profile.name}`,
  },
  description:
    "Fullstack engineer based in Japan with 10+ years building production B2B SaaS and e-commerce platforms. Go, Next.js, TypeScript, PostgreSQL. Open to remote roles worldwide.",
  keywords: [
    "Kenta Uneoka",
    "Senior Fullstack Engineer",
    "Remote Software Engineer Japan",
    "Go Engineer",
    "Next.js Engineer",
    "TypeScript Engineer",
    "React Engineer",
    "Hire Fullstack Developer Japan",
    "Remote Engineer JST",
    "Japan-based Engineer Open to Remote",
  ],
  authors: [{ name: profile.name, url: SITE_URL }],
  creator: profile.name,
  publisher: profile.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: `${profile.name} — Portfolio`,
    title: `${profile.name} — Senior Fullstack Engineer`,
    description:
      "10+ yrs shipping B2B SaaS and e-commerce in Japan. Go, Next.js, TypeScript, PostgreSQL. Open to remote roles worldwide.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — Senior Fullstack Engineer`,
    description:
      "10+ yrs shipping B2B SaaS and e-commerce in Japan. Go, Next.js, TypeScript, PostgreSQL. Open to remote roles worldwide.",
    creator: "@u-kenta8",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">{children}</body>
    </html>
  );
}
