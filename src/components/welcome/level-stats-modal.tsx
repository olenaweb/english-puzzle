'use client';

import { useTranslations } from 'next-intl';
import { Level } from '@/types/types';
import styles from './welcome.module.css';

interface LevelStatsModalProps {
  isOpen: boolean;
  level: Level | null;
  onClose: () => void;
}

export default function LevelStatsModal({ isOpen, level, onClose }: LevelStatsModalProps) {
  const t = useTranslations('LevelStatsModal');

  if (!isOpen || !level) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={`animate-popup ${styles.modalContent}`} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{t('title', { name: level.name })}</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label={t('close')}>
            ✕
          </button>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.statsTable}>
            <thead>
              <tr>
                <th>{t('colRound')}</th>
                <th>{t('colScore')}</th>
                <th>{t('colErrors')}</th>
                <th>{t('colStars')}</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((round) => (
                <tr key={round}>
                  <td>{t('round', { number: round })}</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
