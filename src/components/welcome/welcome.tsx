'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Level } from '@/types/types';
import styles from './welcome.module.css';

interface WelcomeProps {
  levels: Level[];
  error?: string;
  roundId?: number; // Optional, can be used for dynamic round selection
}

/**
 * Client Component for displaying the list of levels
 * Shows level cards or an error message
 */
export default function Welcome({ levels, error, roundId = 1 }: WelcomeProps) {
  const t = useTranslations('WelcomePage');

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
      <h3 className={styles.levelsTitle}>{t('chooseLevelTitle')}</h3>
      <div className={styles.levelsGrid}>
        {levels.map((level: Level) => (
          <Link
            key={level.id}
            // href={`/puzzle?level=${level.levelNumber}`}
            href={`/puzzle/${level.levelNumber}/${roundId}`}
            className={styles.levelCardLink}
          >
            <div className={styles.levelCard}>
              <div className={styles.levelHeader}>
                <span className={styles.levelNumber}>{level.levelNumber}</span>
                <h3 className={styles.levelName}>{level.name}</h3>
              </div>
              <p className={styles.levelDescription}>{level.description}</p>
              <div className={styles.levelFooter}>
                <span className={styles.levelRounds}>
                  {t('rounds', { count: level.totalRounds })}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
