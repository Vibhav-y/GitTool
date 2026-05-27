import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Eye } from 'lucide-react';
import SEO from '../components/SEO';
import { getPost, getRelatedPosts } from '../lib/content';
import TableOfContents from '../components/blog/TableOfContents';
import RelatedPosts from '../components/blog/RelatedPosts';
import NewsletterSignup from '../components/blog/NewsletterSignup';

function formatDate(dateStr) {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export default function BlogArticle() {
  const { slug } = useParams();
  const post = getPost(slug);
  const related = getRelatedPosts(slug, 3);

  if (!post) {
    return (
      <main className="mx-auto w-full max-w-4xl px-6 py-16">
        <h1 className="text-2xl font-semibold">Article not found</h1>
        <p className="mt-2 text-muted-foreground">The blog article does not exist.</p>
        <Link to="/blog" className="mt-6 inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
          <ArrowLeft size={14} /> Back to Blog
        </Link>
      </main>
    );
  }

  return (
    <>
      <SEO
        title={post.title}
        description={post.excerpt}
        keywords={['git best practices', 'git tips', ...(post.categories || [])]}
        canonical={`/blog/${post.slug}`}
      />

      {/* scroll-mt so headings clear the sticky navbar */}
      <style>{`
        .article-prose h2[id],
        .article-prose h3[id],
        .article-prose h4[id] {
          scroll-margin-top: 5rem;
        }
        .article-prose table {
          width: 100%;
          border-collapse: collapse;
        }
        .article-prose table thead tr {
          border-bottom: 1px solid hsl(var(--border));
        }
        .article-prose table tbody tr {
          border-bottom: 1px solid hsl(var(--border) / 0.4);
        }
        .article-prose table tbody tr:last-child {
          border-bottom: none;
        }
      `}</style>

      {/* Main Page Layout */}
      <div className="mx-auto max-w-[90rem] px-4 sm:px-6">

        {/* ── Breadcrumb + Banner (full center column, no TOC yet) ── */}
        <div className="flex justify-center xl:grid xl:grid-cols-[14rem_1fr_14rem]">
          {/* Left spacer */}
          <div className="hidden xl:block" />

          {/* Center: breadcrumb + banner */}
          <div className="min-w-0 w-full border-x border-dashed border-border/80">
            {/* Breadcrumb */}
            <div className="px-6 md:px-10 pt-8">
              <Link
                to="/blog"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft size={13} />
                Blog
              </Link>
            </div>

            {/* Banner */}
            <div className="mt-6 px-6 md:px-10 pb-0">
              <div
                className={`relative overflow-hidden rounded-2xl bg-linear-to-br ${post.gradient || 'from-violet-600 to-indigo-700'}`}
              >
                {/* Diagonal crosshatch overlay */}
                <div
                  className="absolute inset-0 opacity-[0.07]"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)',
                    backgroundSize: '8px 8px',
                  }}
                />
                {/* Corner crosshairs */}
                <span className="absolute left-4 top-4 h-px w-4 bg-white/40" />
                <span className="absolute left-4 top-4 h-4 w-px bg-white/40" />
                <span className="absolute right-4 top-4 h-px w-4 bg-white/40" />
                <span className="absolute right-4 top-4 h-4 w-px bg-white/40" />
                <span className="absolute bottom-4 left-4 h-px w-4 bg-white/40" />
                <span className="absolute bottom-4 left-4 h-4 w-px bg-white/40" />
                <span className="absolute bottom-4 right-4 h-px w-4 bg-white/40" />
                <span className="absolute bottom-4 right-4 h-4 w-px bg-white/40" />
                {/* Content */}
                <div className="relative px-8 py-12 md:px-14 md:py-16">
                  <div className="mb-6 flex flex-wrap gap-2">
                    {(post.categories || []).map((cat) => (
                      <Link
                        key={cat}
                        to={`/blog/category/${cat}`}
                        className="inline-flex items-center rounded-full border border-white/30 px-3 py-0.5 text-[11px] font-semibold uppercase tracking-widest text-white/90 transition-colors hover:border-white/50 hover:bg-white/10"
                      >
                        #{cat}
                      </Link>
                    ))}
                  </div>
                  <h1 className="max-w-2xl text-2xl font-bold leading-tight tracking-tight text-white md:text-4xl md:leading-[1.15]">
                    {post.title}
                  </h1>
                  <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/70 md:text-[15px] md:leading-[1.75]">
                    {post.summary || post.excerpt}
                  </p>
                  <div className="mt-8 flex flex-wrap items-center gap-5 text-[13px] text-white/55">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} />
                      {formatDate(post.publishedAt)}
                    </span>
                    {post.readingTime && (
                      <span className="flex items-center gap-1.5">
                        <Clock size={13} />
                        {post.readingTime}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <Eye size={13} />
                      0 reads
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right spacer */}
          <div className="hidden xl:block" />
        </div>

        {/* ── Article body: TOC (left) + prose (center) + spacer (right) ── */}
        <div className="flex justify-center xl:grid xl:grid-cols-[14rem_1fr_14rem]">

          {/* Left Column: TOC – starts here, aligned with prose */}
          <div className="hidden xl:flex xl:flex-col pr-8 pt-10">
            <TableOfContents headings={post.headings} />
          </div>

          {/* Center Column: Article prose + footer */}
          <main className="min-w-0 w-full border-x border-dashed border-border/80">
            <article className="article-prose px-6 md:px-10 py-12 min-w-0 w-full max-w-none prose prose-invert
              prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground
              prose-h2:mt-12 prose-h2:mb-4 prose-h2:text-2xl prose-h2:border-b prose-h2:border-border prose-h2:pb-2
              prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-lg
              prose-h4:mt-6 prose-h4:mb-2 prose-h4:text-base
              prose-p:text-muted-foreground prose-p:leading-[1.85] prose-p:my-4
              prose-a:text-primary prose-a:no-underline prose-a:font-medium hover:prose-a:underline
              prose-code:rounded prose-code:bg-muted/70 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[0.8em] prose-code:text-foreground prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
              prose-pre:rounded-xl prose-pre:border prose-pre:border-border prose-pre:bg-muted/30 prose-pre:p-5 prose-pre:text-[0.8em] prose-pre:font-mono prose-pre:text-foreground prose-pre:overflow-x-auto prose-pre:leading-relaxed prose-pre:my-6
              prose-ul:text-muted-foreground prose-ul:leading-[1.85] prose-ul:my-4 prose-ul:pl-6
              prose-ol:text-muted-foreground prose-ol:leading-[1.85] prose-ol:my-4 prose-ol:pl-6
              prose-li:my-1.5 prose-li:marker:text-primary
              prose-strong:text-foreground prose-strong:font-semibold
              prose-em:text-muted-foreground
              prose-blockquote:border-l-4 prose-blockquote:border-primary/40 prose-blockquote:pl-4 prose-blockquote:text-muted-foreground prose-blockquote:not-italic prose-blockquote:my-6
              prose-hr:border-border prose-hr:my-10
              prose-table:text-sm prose-table:text-muted-foreground
              prose-thead:border-border prose-th:text-foreground prose-th:font-semibold prose-th:py-2 prose-th:px-3
              prose-td:py-2 prose-td:px-3 prose-td:border-border
              prose-img:rounded-xl prose-img:border prose-img:border-border">
              <post.Component />
            </article>

            <div className="px-6 md:px-10 pb-20">
              <hr className="mb-16 border-border" />
              {related.length > 0 && (
                <div className="mb-16">
                  <RelatedPosts posts={related} />
                </div>
              )}
              <NewsletterSignup />
            </div>
          </main>

          {/* Right spacer */}
          <div className="hidden xl:block" />
        </div>

      </div>
    </>
  );
}

