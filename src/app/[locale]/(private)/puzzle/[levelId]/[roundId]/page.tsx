import { requireAuthAction, getRoundDataAction } from '@/lib/db/server-actions/server-actions';
import GameBoard from '@/components/game-board/game-board';
import { LevelRoundData } from '@/types/types';
import { getTranslations } from 'next-intl/server';

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

  const result = await getRoundDataAction(levelId, roundId);

  const roundData: LevelRoundData = result.data as LevelRoundData;
  return (
    <div className='container'>
      <h1>{t('title', { levelNumber: levelId })}</h1>
      <GameBoard
        initialWords={result.isSuccess ? roundData : ({} as LevelRoundData)}
        level={levelId}
        round={roundId}
        error={!result.isSuccess ? result.message : undefined}
      />
    </div>
  );
}
