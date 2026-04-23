import React from 'react';
import { Link, useParams } from 'react-router-dom';
import SEO from '../components/SEO';
import { blogPosts } from '../data/blogPosts';

export default function BlogArticle() {
  const { slug } = useParams();
  const post = blogPosts.find((entry) => entry.slug === slug);

  if (!post) {
    return (
      <main className="mx-auto w-full max-w-4xl px-6 py-16">
        <h1 className="text-2xl font-semibold">Article not found</h1>
        <p className="mt-2 text-muted-foreground">The blog article does not exist yet.</p>
        <Link to="/blog" className="mt-6 inline-block text-primary hover:underline">Back to Blog</Link>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-16 text-foreground">
      <SEO
        title={post.title}
        description={post.excerpt}
        keywords={['git best practices', 'git tips and tricks', 'github helper tools', 'git workflow tools']}
        canonical={`/blog/${post.slug}`}
      />

      <Link to="/blog" className="text-sm text-primary hover:underline">Back to Blog</Link>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight">{post.title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">Updated {post.updatedAt}</p>
      <p className="mt-8 leading-8 text-muted-foreground">
        This article route is now publicly crawlable and included in the sitemap so search engines can index this URL.
        Replace this placeholder copy with the full article content to rank for the target long-tail keyword.
      </p>
    </main>
  );
}
