import type { ComponentType } from "react";
import type { PostMeta } from "./types";
import Freshness, { meta as freshnessMeta } from "./freshness-architecture";

export type LoadedPost = {
  meta: PostMeta;
  Component: ComponentType;
};

const posts: LoadedPost[] = [
  { meta: freshnessMeta, Component: Freshness },
];

// Newest first
posts.sort((a, b) => b.meta.date.localeCompare(a.meta.date));

export const allPosts = posts;

export function getPostBySlug(slug: string): LoadedPost | undefined {
  return posts.find((p) => p.meta.slug === slug);
}
