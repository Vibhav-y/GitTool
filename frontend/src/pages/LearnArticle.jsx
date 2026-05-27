import React from 'react';
import { Link, useParams } from 'react-router-dom';
import SEO from '../components/SEO';
import { learnGuides } from '../data/learnGuides';

export default function LearnArticle() {
  const { slug } = useParams();
  const guide = learnGuides.find((entry) => entry.slug === slug);

  if (!guide) {
    return (
      <main className="mx-auto w-full max-w-4xl px-6 py-16">
        <h1 className="text-2xl font-semibold">Guide not found</h1>
        <p className="mt-2 text-muted-foreground">The learning guide does not exist yet.</p>
        <Link to="/learn" className="mt-6 inline-block text-primary hover:underline">Back to Learn</Link>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-16 text-foreground">
      <SEO
        title={guide.title}
        description={guide.excerpt}
        keywords={['learn git', 'git tutorial', 'git commands', 'git for beginners', 'git workflow tutorial step by step']}
        canonical={`/learn/${guide.slug}`}
      />

      <Link to="/learn" className="text-sm text-primary hover:underline">Back to Learn</Link>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight">{guide.title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">Updated {guide.updatedAt}</p>
      <p className="mt-8 leading-8 text-muted-foreground">
        This guide route is publicly crawlable and included in the sitemap for indexing.
        Replace this placeholder section with complete tutorial content and examples to rank for the target query.
      </p>
    </main>
  );
}
