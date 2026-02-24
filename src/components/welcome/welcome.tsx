'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { Level } from '@/types/types';
import styles from './welcome.module.css';
import LevelStatsModal from './level-stats-modal';
import { useGameStore } from '@/lib/store/useGameStore';

interface WelcomeProps {
  levels: Level[];
  error?: string;
}

export default function Welcome({ levels, error }: WelcomeProps) {
  const t = useTranslations('WelcomePage');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);

  const router = useRouter();
  const setLevel = useGameStore((state) => state.setLevel);
  const setRound = useGameStore((state) => state.setRound);

  const handleLevelSelect = (_e: React.MouseEvent, levelNumber: number) => {
    setLevel(levelNumber);
    setRound(1);
    router.push(`/rounds/${levelNumber}/1`);
  };

  const handleStatsClick = (e: React.MouseEvent, level: Level) => {
    e.stopPropagation(); // Prevent click from bubbling up to the card's onClick
    setSelectedLevel(level);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedLevel(null);
  };

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>{error}</p>
        <p>{t('tryAgainLater')}</p>
      </div>
    );
  }

  if (!levels || levels.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <p>{t('noLevelsAvailable')}</p>
      </div>
    );
  }

  return (
    <div className={styles.levelsContainer}>
      <h1 className={styles.levelsTitle}>{t('chooseLevelTitle')}</h1>
      <div className={styles.levelsGrid}>
        {levels.map((level) => (
          <div
            key={level.id}
            className={styles.levelCardLink}
            onClick={(e) => handleLevelSelect(e, level.levelNumber)}
          >
            <div className={styles.levelCard}>
              <div className={styles.levelHeader}>
                <span className={styles.levelNumber}>{level.levelNumber}</span>
                <h3 className={styles.levelName}>{level.name}</h3>

                <button
                  className={styles.statsButton}
                  onClick={(e) => handleStatsClick(e, level)}
                  title={t('viewStats')}
                >
                  📊
                </button>
              </div>

              <p className={styles.levelDescription}>{level.description}</p>

              <div className={styles.levelFooter}>
                <span className={styles.levelRounds}>
                  {t('rounds', { count: level.totalRounds })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <LevelStatsModal isOpen={isModalOpen} level={selectedLevel} onClose={closeModal} />
    </div>
  );
}
