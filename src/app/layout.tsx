import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kenta Uneoka — Senior Fullstack Engineer",
  description:
    "Fullstack engineer based in Japan with 10+ years building production B2B SaaS and e-commerce platforms. Go, Next.js, TypeScript, Postgres. Open to remote roles worldwide.",
  openGraph: {
    title: "Kenta Uneoka — Senior Fullstack Engineer",
    description:
      "Fullstack engineer based in Japan with 10+ years building production B2B SaaS and e-commerce platforms.",
    type: "website",
    locale: "en_US",
  },
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
