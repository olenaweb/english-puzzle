import { getTranslations } from 'next-intl/server';
import { requireAuthAction } from '@/lib/db/server-actions/server-actions';
import { Suspense } from 'react';
import Spinner from '@/components/spinner/spinner';
import RoundsLoader from '@/components/round-board/rounds-loader';

interface RoundPageProps {
  params: Promise<{
    levelId: string;
    locale: string;
  }>;
}

export default async function RoundPage({ params }: RoundPageProps) {
  const { levelId, locale } = await params;
  const t = await getTranslations('RoundPage');

  await requireAuthAction(locale);

  return (
    <div className='container'>
      <h1 className='title-round-page'>{t('title', { levelNumber: levelId })}</h1>
      <Suspense
        fallback={
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <Spinner />
          </div>
        }
      >
        <RoundsLoader levelId={levelId} />
      </Suspense>
    </div>
  );
}
