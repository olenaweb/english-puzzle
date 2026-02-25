import { requireAuthAction } from '@/lib/db/server-actions/server-actions';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import Spinner from '@/components/spinner/spinner';
import GameBoardLoader from '@/components/game-board/game-board-loader';

interface GamePageProps {
  params: Promise<{
    levelId: string;
    roundId: string;
    locale: string;
  }>;
}

export default async function GamePage({ params }: GamePageProps) {
  const { levelId, roundId, locale } = await params;
  const t = await getTranslations('GamePage');
  await requireAuthAction(locale);

  return (
    <div className='container'>
      <h1>{t('title', { levelNumber: levelId })}</h1>
      <Suspense
        fallback={
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <Spinner />
          </div>
        }
      >
        <GameBoardLoader levelId={levelId} roundId={roundId} />
      </Suspense>
    </div>
  );
}
