// Eagerly import all MDX blog posts at build time via Vite's glob import.
// Each module exposes:
//   module.default    — the React component
//   module.frontmatter — YAML frontmatter parsed by remark-mdx-frontmatter
const modules = import.meta.glob('../content/blog/*.mdx', { eager: true });

function buildPost(path, mod) {
  const slug = path.split('/').pop().replace(/\.mdx$/, '');
  return {
    slug,
    ...mod.frontmatter,
    Component: mod.default,
  };
}

/** Returns all posts sorted newest-first. */
export function getAllPosts() {
  return Object.entries(modules)
    .map(([path, mod]) => buildPost(path, mod))
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
}

/** Returns a single post by slug, or null. */
export function getPost(slug) {
  const entry = Object.entries(modules).find(([path]) =>
    path.endsWith(`/${slug}.mdx`),
  );
  if (!entry) return null;
  return buildPost(entry[0], entry[1]);
}

/** Returns sorted unique category strings across all (or provided) posts. */
export function getAllCategories(posts) {
  const cats = new Set();
  (posts || getAllPosts()).forEach((p) =>
    (p.categories || []).forEach((c) => cats.add(c)),
  );
  return Array.from(cats).sort();
}

/** Returns up to `count` posts that share a category with `currentSlug`. */
export function getRelatedPosts(currentSlug, count = 3) {
  const all = getAllPosts();
  const current = all.find((p) => p.slug === currentSlug);
  if (!current) return [];
  return all
    .filter(
      (p) =>
        p.slug !== currentSlug &&
        (p.categories || []).some((c) => (current.categories || []).includes(c)),
    )
    .slice(0, count);
}
