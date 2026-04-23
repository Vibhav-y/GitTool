import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { blogPosts } from '../data/blogPosts';

export default function Blog() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16 text-foreground">
      <SEO
        title="Git Blog: Best Practices, Tips, and Workflow Guides"
        description="Read GitTool blog guides on git best practices, common git mistakes, workflow strategies, commit messages, CI/CD, and developer productivity."
        keywords={[
          'git best practices',
          'git tips and tricks',
          'common git mistakes to avoid',
          'git workflow for teams best practices',
          'how to write better git commit messages',
          'gitflow vs trunk based development',
          'git hooks tutorial and use cases',
          'monorepo vs multirepo git strategy',
          'git for solo developers best practices',
          'how to undo a git commit',
          'git aliases to speed up workflow',
          'git submodules explained',
          'github actions vs gitlab ci comparison',
          'how to set up git for the first time',
          'git large file storage lfs tutorial',
          'protecting main branch in github',
        ]}
        canonical="/blog"
      />

      <h1 className="text-4xl font-semibold tracking-tight">Git Blog</h1>
      <p className="mt-3 max-w-3xl text-muted-foreground">
        Practical guides for teams and solo developers working with Git and GitHub.
      </p>

      <section className="mt-10 grid gap-4">
        {blogPosts.map((post) => (
          <article key={post.slug} className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Updated {post.updatedAt}</p>
            <h2 className="mt-2 text-xl font-semibold">
              <Link to={`/blog/${post.slug}`} className="hover:text-primary">
                {post.title}
              </Link>
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{post.excerpt}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
