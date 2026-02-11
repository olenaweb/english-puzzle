import { Link } from '@/i18n/navigation';
import styles from './footer.module.css';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('Footer');
  return (
    <div className={styles.footer}>
      <div className={styles.line}>
        <p className={`${styles.dev} bold `}>{t('developedBy')}</p>
      </div>
      <div className={styles.line2}>
        <p className={`${styles.link} bold `}>2026</p>
        <Link
          href='https://github.com/olenaweb'
          className={`${styles.link} bold `}
          target='_blank'
          rel='noopener noreferrer'
        >
          Olenaweb
        </Link>
      </div>
    </div>
  );
}
