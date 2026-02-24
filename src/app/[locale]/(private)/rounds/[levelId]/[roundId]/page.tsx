import { getTranslations } from 'next-intl/server';
import { requireAuthAction, getRoundsByLevelAction } from '@/lib/db/server-actions/server-actions';
import { LevelRoundData } from '@/types/types';
import { RoundBoard } from '@/components/round-board/round-board';

interface RoundPageProps {
  params: Promise<{
    levelId: string;
    locale: string;
  }>;
}

export default async function RoundPage({ params }: RoundPageProps) {
  const { levelId, locale } = await params;
  const t = await getTranslations('RoundPage');

  // check auth on the server before loading data
  await requireAuthAction(locale);

  // Get rounds data for the specified level on the server
  const result = await getRoundsByLevelAction(levelId);
  const rounds = result.data as LevelRoundData[];
  console.log('"rounds="', rounds);

  return (
    <div className='container'>
      <h1 className='title-round-page'>{t('title', { levelNumber: levelId })}</h1>
      {rounds && rounds.length > 0 ? (
        <RoundBoard rounds={rounds} levelId={parseInt(levelId)} />
      ) : (
        <p className='card'>{t('noRoundsAvailable')}</p>
      )}
    </div>
  );
}
