export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  tags: readonly string[];
  readingMinutes: number;
};
