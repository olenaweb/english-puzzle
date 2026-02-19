'use client';

import LocaleSwitcher from '@/components/locale-switcher';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import Image from 'next/image';

import { Link, useRouter } from '@/i18n/navigation';

import classes from './header.module.css';

import { useAuth } from '@/context/auth-context';
import toast from 'react-hot-toast';
import { successToast, errorToast } from '@/lib/utils/toast-helpers';
import NavLinks from '../nav-links/nav-links';

export default function Header() {
  const t = useTranslations('HomePage');

  const [scrolled, setScrolled] = useState(false);

  const { user, signOut, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSignOut = async () => {
    const toastId = toast.loading(t('signingOut'));
    try {
      await signOut();
      toast.dismiss(toastId);
      successToast(t('goodbye'));
      router.push('/');
    } catch (error) {
      const errorMessage = (error as Error)?.message || t('signOutError');
      console.error(errorMessage);
      toast.dismiss(toastId);
      errorToast(errorMessage);
    }
  };

  return (
    <header className={`${classes.header} ${scrolled ? classes.scrolled : ''}`}>
      <nav className={`container ${classes['flex-wrapper']}`}>
        <Link href='/' className={classes['logo-wrapper'] + ' active-link'}>
          <Image src='/logo.jpg' alt={t('logoAlt')} width={80} height={60} priority={true} />
        </Link>

        {user && (
          <div className={classes.links}>
            <NavLinks />
          </div>
        )}

        <div className={classes.controls}>
          {!loading && (
            <>
              {user ? (
                <>
                  <button onClick={() => router.replace('/')}>{t('MainPage')}</button>
                  <button onClick={handleSignOut}>{t('SignOutLabel')}</button>
                </>
              ) : (
                <>
                  <Link href='/auth/signin' className={classes.link}>
                    {t('SignInLabel')}
                  </Link>
                  <Link href='/auth/signup' className={classes.link}>
                    {t('SignUpLabel')}
                  </Link>
                </>
              )}
            </>
          )}
          <LocaleSwitcher />
        </div>
      </nav>
    </header>
  );
}
