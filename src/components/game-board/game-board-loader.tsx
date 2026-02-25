import { getRoundDataAction } from '@/lib/db/server-actions/server-actions';
import { LevelRoundData } from '@/types/types';
import GameBoard from './game-board';

interface GameBoardLoaderProps {
  levelId: string;
  roundId: string;
}

/**
 * Async Server Component — suspends while fetching round data.
 * Wrapped in <Suspense> in GamePage to enable streaming SSR.
 */
export default async function GameBoardLoader({ levelId, roundId }: GameBoardLoaderProps) {
  const result = await getRoundDataAction(levelId, roundId);
  const roundData = result.data as LevelRoundData;

  return (
    <GameBoard
      initialWords={result.isSuccess ? roundData : ({} as LevelRoundData)}
      level={levelId}
      round={roundId}
      error={!result.isSuccess ? result.message : undefined}
    />
  );
}
