import React from 'react';
import { Link } from 'react-router-dom';
import { blogRepo } from '../utils/blogRepo';
import type { BlogPost } from '../types/blog';
import { Card, CardBody } from '../components/Card';
import { Button } from '../components/Button';
import { format } from 'date-fns';

function groupByMonth(posts: BlogPost[]) {
  const map: Record<string, BlogPost[]> = {};
  for (const p of posts) {
    const key = format(new Date(p.publishedAt), 'yyyy MMMM'); // "2025 August"
    (map[key] ||= []).push(p);
  }
  return map;
}

export default function Blog() {
  const posts = blogRepo.list();
  const byMonth = groupByMonth(posts);
  const months = Object.keys(byMonth);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Updates & Advice</h1>
        <Link to="/blog/new"><Button size="sm">New Post</Button></Link>
      </div>

      {months.length === 0 ? (
        <Card><CardBody>No posts yet.</CardBody></Card>
      ) : months.map(month => (
        <section key={month} className="space-y-3">
          <h2 className="text-lg font-semibold">{month}</h2>
          {byMonth[month].map(p => (
            <Link to={`/blog/${p.slug}`} key={p.id}>
              <Card hover>
                <CardBody>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{p.title}</h3>
                      <p className="text-sm text-gray-600">{format(new Date(p.publishedAt), 'PPP')}</p>
                    </div>
                    {p.tags?.length ? (
                      <div className="text-xs text-gray-500">{p.tags.join(' • ')}</div>
                    ) : null}
                  </div>
                </CardBody>
              </Card>
            </Link>
          ))}
        </section>
      ))}
    </div>
  );
}