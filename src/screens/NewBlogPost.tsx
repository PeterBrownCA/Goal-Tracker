import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { blogRepo } from '../utils/blogRepo';
import type { BlogPost } from '../types/blog';
import { useAppContext } from '../context/AppContext';
import { Card, CardBody } from '../components/Card';
import { Button } from '../components/Button';

const BLOG_ADMINS = (import.meta.env.VITE_BLOG_ADMINS?.split(',') || []).map(e => e.trim().toLowerCase());

function slugify(title: string, date: Date) {
  const ym = date.toISOString().slice(0,7); // yyyy-mm
  return `${ym}-${title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')}`;
}

export default function NewBlogPost() {
  const nav = useNavigate();
  const { user } = useAppContext();
  const email = user?.email?.toLowerCase() || '';

  const isAdmin = BLOG_ADMINS.includes(email);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [publishedAt, setPublishedAt] = useState<string>(new Date().toISOString().slice(0,10));
  const [isDraft, setIsDraft] = useState(false);
  const [tags, setTags] = useState('');

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card><CardBody>You don't have access to create posts.</CardBody></Card>
      </div>
    );
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const date = new Date(publishedAt);
    const post: BlogPost = {
      id: crypto.randomUUID(),
      slug: slugify(title, date),
      title,
      content,
      publishedAt: date.toISOString(),
      authorName: user?.displayName || user?.email || 'Admin',
      authorEmail: user?.email,
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
      isDraft,
    };
    blogRepo.upsert(post);
    nav(`/blog/${post.slug}`);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">New Post</h1>
        <Link to="/blog"><Button variant="ghost" size="sm">Back</Button></Link>
      </div>

      <Card>
        <CardBody>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm">Title</label>
              <input className="w-full border rounded px-3 py-2" value={title} onChange={e=>setTitle(e.target.value)} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm">Publish date</label>
                <input type="date" className="w-full border rounded px-3 py-2" value={publishedAt} onChange={e=>setPublishedAt(e.target.value)} required />
              </div>
              <div className="flex items-end gap-2">
                <input id="draft" type="checkbox" className="w-4 h-4" checked={isDraft} onChange={e=>setIsDraft(e.target.checked)} />
                <label htmlFor="draft" className="text-sm">Draft</label>
              </div>
            </div>
            <div>
              <label className="block text-sm">Tags (comma separated)</label>
              <input className="w-full border rounded px-3 py-2" value={tags} onChange={e=>setTags(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm">Content</label>
              <textarea className="w-full border rounded px-3 py-2 h-60" value={content} onChange={e=>setContent(e.target.value)} placeholder="Write your post (markdown or text)..." />
            </div>
            <Button type="submit">Publish</Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}