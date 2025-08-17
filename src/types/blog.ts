export type BlogID = string;

export interface BlogPost {
  id: BlogID;
  slug: string;           // e.g., "2025-08-august-update"
  title: string;
  content: string;        // markdown or plain text
  publishedAt: string;    // ISO date
  authorName?: string;
  authorEmail?: string;
  tags?: string[];
  isDraft?: boolean;
}