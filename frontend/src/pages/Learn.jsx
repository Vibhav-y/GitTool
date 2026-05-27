import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { learnGuides } from '../data/learnGuides';

export default function Learn() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16 text-foreground">
      <SEO
        title="Learn Git Online Free: Tutorials for Beginners"
        description="Learn Git with beginner-friendly tutorials: git commands, merge conflicts, rebase vs merge, stash, branching strategy, and workflow fundamentals."
        keywords={[
          'learn git',
          'git tutorial',
          'git commands',
          'git for beginners',
          'learn git online free',
          'interactive git tutorial for beginners',
          'git commands cheat sheet with examples',
          'how does git work explained simply',
          'git rebase vs merge when to use',
          'how to resolve git merge conflicts step by step',
          'git branching strategy for beginners',
          'what is git and how to use it',
          'git push pull explained for beginners',
          'git workflow tutorial step by step',
          'git stash explained with examples',
          'git cherry pick tutorial',
          'understanding git history and logs',
          'git reset vs revert vs checkout difference',
          'best way to learn git for developers',
        ]}
        canonical="/learn"
      />

      <h1 className="text-4xl font-semibold tracking-tight">Learn Git</h1>
      <p className="mt-3 max-w-3xl text-muted-foreground">
        Step-by-step Git learning paths for beginners and intermediate developers.
      </p>

      <section className="mt-10 grid gap-4">
        {learnGuides.map((guide) => (
          <article key={guide.slug} className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Updated {guide.updatedAt}</p>
            <h2 className="mt-2 text-xl font-semibold">
              <Link to={`/learn/${guide.slug}`} className="hover:text-primary">
                {guide.title}
              </Link>
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{guide.excerpt}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
