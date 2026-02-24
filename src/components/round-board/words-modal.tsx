'use client';

import { useTranslations, useLocale } from 'next-intl';
import styles from './round-board.module.css';
import { FilteredWordsData } from '@/types/types';

interface WordsModalProps {
  isOpen: boolean;
  roundWords: FilteredWordsData[] | null;
  onClose: () => void;
}

export default function WordsModal({ isOpen, roundWords, onClose }: WordsModalProps) {
  const t = useTranslations('WordsModal');
  const locale = useLocale();

  if (!isOpen || !roundWords) return null;

  const showTranslation = locale === 'ru' || locale === 'ua';

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={`animate-popup ${styles.modalContent}`} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{t('title')}</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label={t('close')}>
            ✕
          </button>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.wordTable}>
            <thead>
              <tr>
                <th>{t('colWord')}</th>
                {showTranslation && <th>{t('colTranslate')}</th>}
              </tr>
            </thead>
            <tbody>
              {roundWords.map((word, index) => (
                <tr key={`${word.word}-${index}`}>
                  <td>{word.word}</td>
                  {locale === 'ru' && <td>{word.translate}</td>}
                  {locale === 'ua' && <td>{word.translateUa}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
