import type { MetadataRoute } from "next";
import { allPosts } from "@/content/posts";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://kenta-uneoka.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...allPosts.map((p) => ({
      url: `${SITE_URL}/blog/${p.meta.slug}`,
      lastModified: new Date(p.meta.date),
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}
