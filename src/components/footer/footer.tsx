import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import styles from './footer.module.css';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('Footer');
  return (
    <div className={styles.footer}>
      <div className={styles.line}>
        <p className={`${styles.dev} bold `}>{t('developedBy')}</p>
        <Link href='https://github.com/olenaweb' className={`${styles.dev} bold `}target='_blank' rel='noopener noreferrer'>
          - Github olenaweb
        </Link>
      </div>
      <div className={styles.line2}>
        <p className={`${styles.school} bold `}>RS School</p>
        <Link
          className={styles.rss}
          href='https://rs.school/courses/reactjs'
          target='_blank'
          rel='noopener noreferrer'
        >
          <Image src='/rss-logo.svg' alt='rss-logo' width={30} height={30} />
        </Link>
        <p className={`${styles.year} bold `}>2026</p>
      </div>
    </div>
  );
}
