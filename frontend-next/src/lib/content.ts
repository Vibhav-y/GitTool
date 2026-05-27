import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  summary?: string;
  categories?: string[];
  publishedAt: string;
  updatedAt?: string;
  readingTime?: string;
  gradient?: string;
  headings?: Array<{ id: string; text: string; level: number }>;
  rawContent?: string;
};

const BLOG_DIR = path.join(process.cwd(), 'src/content/blog');

export function getAllPosts(): BlogPost[] {
  const files = fs.readdirSync(BLOG_DIR).filter((file) => file.endsWith('.mdx'));

  return files
    .map((file) => {
      const slug = file.replace(/\.mdx$/, '');
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8');
      const { data } = matter(raw);
      return { slug, ...(data as Omit<BlogPost, 'slug'>) };
    })
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getPost(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);
  return { slug, ...(data as Omit<BlogPost, 'slug'>), rawContent: content };
}

export function getAllCategories(posts: BlogPost[] = getAllPosts()) {
  const categories = new Set<string>();
  posts.forEach((post) => {
    (post.categories || []).forEach((category) => categories.add(category));
  });
  return Array.from(categories).sort();
}

export function getRelatedPosts(currentSlug: string, count = 3) {
  const posts = getAllPosts();
  const currentPost = posts.find((post) => post.slug === currentSlug);
  if (!currentPost) return [];

  return posts
    .filter(
      (post) =>
        post.slug !== currentSlug &&
        (post.categories || []).some((category) => (currentPost.categories || []).includes(category)),
    )
    .slice(0, count);
}
