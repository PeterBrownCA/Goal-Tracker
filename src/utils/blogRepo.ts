import type { BlogPost } from '../types/blog';

const VERSION = 'v1';
const BLOG_KEY = `gpp:${VERSION}:blog`;

function loadAll(): BlogPost[] {
  try { return JSON.parse(localStorage.getItem(BLOG_KEY) || '[]') as BlogPost[]; }
  catch { return []; }
}
function saveAll(posts: BlogPost[]) { localStorage.setItem(BLOG_KEY, JSON.stringify(posts)); }

export const blogRepo = {
  list(options?: { includeDrafts?: boolean; now?: Date }): BlogPost[] {
    const now = options?.now ?? new Date();
    const all = loadAll();
    return all
      .filter(p => options?.includeDrafts ? true : (!p.isDraft && new Date(p.publishedAt) <= now))
      .sort((a,b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
  },
  getBySlug(slug: string): BlogPost | undefined {
    return loadAll().find(p => p.slug === slug);
  },
  upsert(post: BlogPost) {
    const all = loadAll();
    const i = all.findIndex(p => p.id === post.id || p.slug === post.slug);
    if (i >= 0) all[i] = post; else all.unshift(post);
    saveAll(all);
    return post;
  }
}