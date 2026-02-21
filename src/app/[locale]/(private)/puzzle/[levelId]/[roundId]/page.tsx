import { getRoundDataAction } from '@/lib/db/server-actions/server-actions';
import GameBoard from '@/components/game-board/game-board';
import { LevelRoundData } from '@/types/types';
import { getTranslations } from 'next-intl/server';
import { getCurrentUserIdAction } from '@/lib/db/server-actions/server-actions';
import { redirect } from 'next/navigation';

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
  // Check authorization on the server
  const userId = await getCurrentUserIdAction();
  if (!userId) {
    redirect(`/${locale}/auth/signin`);
  }
  console.log('"GamePage levelId="', levelId);
  console.log('"GamePage roundId="', roundId);
  const result = await getRoundDataAction(levelId, roundId);

  // if (!result.isSuccess) {
  //   return <div>{result.message}</div>;
  // }
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
