import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';
import { getAllPosts, getAllCategories } from '../lib/content';
import BlogPostList from '../components/blog/BlogPostList';
import CategorySelect from '../components/blog/CategorySelect';
import NewsletterSignup from '../components/blog/NewsletterSignup';

export default function BlogCategory() {
  const { category } = useParams();
  const normalizedCategory = category?.toLowerCase() || '';
  const blogPosts = getAllPosts();
  const categories = getAllCategories(blogPosts);

  const filteredPosts = blogPosts.filter((post) =>
    (post.categories || []).some((c) => c.toLowerCase() === normalizedCategory),
  );

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16 text-foreground">
      <SEO
        title={`${normalizedCategory} Articles — Git Blog`}
        description={`Browse all GitTool blog articles about ${normalizedCategory}. Practical guides, tips, and best practices.`}
        keywords={[normalizedCategory, 'git', 'git best practices', 'developer workflow']}
        canonical={`/blog/category/${normalizedCategory}`}
      />

      {/* Back */}
      <Link
        to="/blog"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={14} /> All Articles
      </Link>

      {/* Heading */}
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-semibold capitalize tracking-tight text-foreground md:text-4xl">
          Articles about{' '}
          <span className="text-primary">{normalizedCategory}</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'} found
        </p>
      </div>

      {/* Category tabs */}
      <div className="mt-8">
        <CategorySelect categories={categories} currentCategory={normalizedCategory} />
      </div>

      {/* Posts */}
      <div className="mt-4">
        <BlogPostList posts={filteredPosts} />
      </div>

      {/* Newsletter */}
      <section className="mt-16">
        <NewsletterSignup
          title={`Stay updated on ${normalizedCategory} articles`}
          description="New articles, Git tips, and workflow guides delivered to your inbox."
        />
      </section>
    </main>
  );
}
