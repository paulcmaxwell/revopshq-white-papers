import type { MetadataRoute } from 'next';
import { papers } from '@/content/papers';

const BASE = 'https://revenuefoundations.com';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, changeFrequency: 'weekly', priority: 1 },
    ...papers.map((p) => ({
      url: `${BASE}/papers/${p.slug}`,
      lastModified: new Date(`${p.date}T00:00:00Z`),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
