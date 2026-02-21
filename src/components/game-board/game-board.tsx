'use client';

import { useTranslations } from 'next-intl';
import { LevelRoundData } from '@/types/types';
import styles from './game-board.module.css';

// import { Link } from '@/i18n/navigation';
// import { Level } from '@/types/types';

/**
 * Client Component for Game Board
 */
interface GameBoardProps {
  initialWords: LevelRoundData;
  level: string;
  round: string;
  error?: string;
}
export default function GameBoard({ initialWords, level, round, error }: GameBoardProps) {
  const t = useTranslations('GameBoard');

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>{error}</p>
        <p>{t('tryAgainLater')}</p>
      </div>
    );
  }

  if (!initialWords.words || initialWords.words.length === 0) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>{t('noWordsAvailable')}</p>
        <p>{t('tryAgainLater')}</p>
      </div>
    );
  }

  return (
    <div className={styles.gameBoardContainer}>
      <h3>{t('roundTitle', { levelNumber: level, roundNumber: round })}</h3>
      <div>
        <h4>Level Data:</h4>
        <p>Name: {initialWords.levelData.name}</p>
        <p>Author: {initialWords.levelData.author}</p>
        <p>Year: {initialWords.levelData.year}</p>
      </div>
      <div>
        <h4>Words ({initialWords.totalWords}):</h4>
        <ul>
          {initialWords.words.map((word) => (
            <li key={word.id}>
              <strong>{word.word}</strong> - {word.wordTranslate}
              <br />
              <small>{word.textExample}</small>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
