import { getRoundsByLevelAction } from '@/lib/db/server-actions/server-actions';
import { LevelRoundData } from '@/types/types';
import { getTranslations } from 'next-intl/server';
import { RoundBoard } from './round-board';

interface RoundsLoaderProps {
  levelId: string;
}

/**
 * Async Server Component — suspends while fetching rounds for a level.
 * Wrapped in <Suspense> in RoundPage to enable streaming SSR.
 */
export default async function RoundsLoader({ levelId }: RoundsLoaderProps) {
  const t = await getTranslations('RoundPage');
  const result = await getRoundsByLevelAction(levelId);
  const rounds = result.data as LevelRoundData[];

  if (!rounds || rounds.length === 0) {
    return <p className='card'>{t('noRoundsAvailable')}</p>;
  }

  return <RoundBoard rounds={rounds} levelId={parseInt(levelId)} />;
}
