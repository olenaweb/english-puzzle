'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useGameStore } from '@/lib/store/useGameStore';
import { LevelRoundData, FilteredWordsData, WordsData } from '@/types/types';
import Image from 'next/image';
import styles from './round-board.module.css';
import WordsModal from './words-modal';

interface RoundBoardProps {
  rounds: LevelRoundData[];
  levelId: number;
}

export function RoundBoard({ rounds, levelId }: RoundBoardProps) {
  const t = useTranslations('GameBoard');

  const router = useRouter();
  const locale = useLocale();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { roundId: savedRoundId, setGameProgress } = useGameStore();
  const [selectedWords, setSelectedWords] = useState<FilteredWordsData[] | null>(null);

  const handlePlayRound = (roundNumber: number) => {
    setGameProgress(levelId, roundNumber);
    router.push(`/puzzle/${levelId}/${roundNumber}`);
  };

  const openWordsModal = (e: React.MouseEvent<HTMLButtonElement>, words: WordsData[]) => {
    e.stopPropagation();
    const roundWords: FilteredWordsData[] = words.map((word) => ({
      locale,
      word: word.word,
      translate: word.wordTranslate,
      translateUa: word.wordTranslateUa,
    }));
    setSelectedWords(roundWords);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedWords(null);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.scrollContainer}>
        <div className={styles.gridList}>
          {rounds.map((round) => {
            const isCurrentRound = round.roundNumber === savedRoundId;

            // mock data
            const mockStars = Math.floor(Math.random() * 4);
            const isCompleted = mockStars > 0;

            return (
              <div
                key={round.id}
                className={`${styles.gridRow} ${isCurrentRound ? styles.activeRow : ''}`}
                onClick={() => handlePlayRound(round.roundNumber)}
              >
                <div className={styles.imageCol}>
                  <Image
                    src={`/${round.levelData.imageSrc}`}
                    alt='Art'
                    width={60}
                    height={60}
                    className={isCompleted ? styles.imgClear : styles.imgBlurred}
                  />
                </div>

                <div className={styles.infoCol}>
                  <span className={styles.roundTitle}>
                    {t('roundLabel', { roundNumber: round.roundNumber })}
                  </span>
                  <span className={styles.stars}>
                    {'⭐'.repeat(mockStars)}
                    {'☆'.repeat(3 - mockStars)}
                  </span>
                </div>

                <div className={styles.actionsCol}>
                  <button
                    onClick={(e) => openWordsModal(e, round.words)}
                    className={styles.btnWords}
                  >
                    {t('wordsBtn')}
                  </button>
                  <button
                    onClick={() => handlePlayRound(round.roundNumber)}
                    title={isCompleted ? t('roundRepeat') : t('roundGo')}
                    className={`${styles.btnPlay} ${isCurrentRound ? styles.btnPlayActive : styles.btnPlayNonActive}`}
                  >
                    {isCompleted ? '↻' : '▶'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <WordsModal isOpen={isModalOpen} roundWords={selectedWords} onClose={closeModal} />
    </div>
  );
}
