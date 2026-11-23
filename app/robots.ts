import type { MetadataRoute } from 'next';

const AI_BOTS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'CCBot',
  'anthropic-ai',
  'ClaudeBot',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // AI search crawlers (ChatGPT, Perplexity, Google AI, Claude, Common Crawl)
      // may read the public site, but never the admin panel or the API.
      { userAgent: AI_BOTS, allow: '/', disallow: ['/admin/', '/api/'] },
      { userAgent: '*', allow: '/', disallow: ['/admin/', '/api/'] },
    ],
    sitemap: 'https://zaypick.vercel.app/sitemap.xml',
  };
}
