import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogRepo } from '../utils/blogRepo';
import { Card, CardBody } from '../components/Card';
import { Button } from '../components/Button';
import { format } from 'date-fns';

export default function BlogDetail() {
  const { slug } = useParams();
  const post = slug ? blogRepo.getBySlug(slug) : undefined;

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card><CardBody>Post not found.</CardBody></Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{post.title}</h1>
        <Link to="/blog"><Button variant="ghost" size="sm">Back</Button></Link>
      </div>
      <p className="text-sm text-gray-600">{format(new Date(post.publishedAt), 'PPP')}</p>
      <Card>
        <CardBody>
          {/* Plain text render for now; you can swap to a markdown renderer later */}
          <div className="whitespace-pre-wrap leading-relaxed">{post.content}</div>
        </CardBody>
      </Card>
    </div>
  );
}