'use client';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

import classes from './main-page.module.css';

import { useAuth } from '@/context/auth-context';

export default function MainPage() {
  const t = useTranslations('HomePage');
  const { user } = useAuth();
  const isLoggedIn = user !== null;
  return (
    <section className={`card ${classes['main-card']}`}>
      {!isLoggedIn && (
        <>
          <h1>{t('welcomeUnauth')}</h1>
          <div className={classes.info}>{t('generalInformation')}</div>
          <div className={classes.controls}>
            <Link href='/auth/signin' className={classes.button}>
              {t('SignInLabel')}
            </Link>
            <Link href='/auth/signup' className={classes.button}>
              {t('SignUpLabel')}
            </Link>
          </div>
        </>
      )}
      {isLoggedIn && (
        <>
          <h1>{t('title')}</h1>
          <h3>
            {t('welcomeAuth', {
              user: user?.displayName ?? user.email?.split('@').at(0) ?? t('defaultUser'),
            })}
          </h3>
          <div className={classes.info}>{t('generalInformation')}</div>
          <div className={classes.controls}>
            <Link href='/welcome' className={classes.button}>
              {t('welcomeClientLink')}
            </Link>
            <Link href='/puzzle' className={classes.button}>
              {t('puzzleLink')}
            </Link>
            <Link href='/statistics' className={classes.button}>
              {t('statisticsLink')}
            </Link>
          </div>
        </>
      )}
    </section>
  );
}
