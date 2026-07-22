import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { bySlug, papers } from '@/content/papers';
import { loadBody } from '@/lib/papers';
import { unlockCookie } from '@/lib/gate';
import DownloadGate from '@/components/DownloadGate';
import CreditCalculator from '@/components/CreditCalculator';
import AttributionSimulator from '@/components/AttributionSimulator';
import '@/content/paper.css';

export const dynamicParams = false;

export function generateStaticParams() {
  return papers.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const paper = bySlug(slug);
  if (!paper) return { title: 'Not found' };
  return {
    title: paper.title,
    description: paper.deck,
    openGraph: { title: paper.title, description: paper.deck, type: 'article' },
  };
}

export default async function PaperPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ gate?: string }>;
}) {
  const { slug } = await params;
  const { gate } = await searchParams;
  const paper = bySlug(slug);
  if (!paper) notFound();

  const body = await loadBody(slug);
  if (!body) notFound();

  const jar = await cookies();
  const unlocked = jar.get(unlockCookie(slug))?.value === '1';

  return (
    <div className="container reader">
      <Link href="/#library" className="backlink">
        <span aria-hidden="true">←</span> All white papers
      </Link>

      <div className="paper">
        {/* Rendered from the RevOps HQ design-system markup in content/papers/<slug>.body.html */}
        <div dangerouslySetInnerHTML={{ __html: body }} />
        {slug === 'hubspot-credit-reference' && <CreditCalculator />}
        {slug === 'attribution-channel-economics' && <AttributionSimulator />}
      </div>

      <DownloadGate
        slug={paper.slug}
        title={paper.title}
        pages={paper.pages}
        unlocked={unlocked}
        autoOpen={gate === '1'}
      />
    </div>
  );
}
