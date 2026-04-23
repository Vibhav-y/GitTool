import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://gittool.dev';
const SITE_NAME = 'GitTool';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

/**
 * SEO component for per-page meta tags.
 *
 * Props:
 *   title       – page title (appended with " | GitTool")
 *   description – meta description (≤160 chars)
 *   keywords    – array of keyword strings
 *   canonical   – canonical path e.g. "/tools/readme-generator"
 *   image       – absolute OG image URL (optional, falls back to default)
 *   noIndex     – true to noindex/nofollow the page
 *   schema      – additional JSON-LD object (optional)
 */
export default function SEO({
  title,
  description,
  keywords = [],
  canonical,
  image = DEFAULT_IMAGE,
  noIndex = false,
  schema,
}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} – AI-Powered Git Tools for Developers`;
  const canonicalUrl = canonical ? `${SITE_URL}${canonical}` : null;

  const defaultSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: SITE_NAME,
    url: SITE_URL,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: description,
  };

  const jsonLd = schema || defaultSchema;

  return (
    <Helmet>
      {/* Core */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      {!noIndex && <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />}

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>
    </Helmet>
  );
}
