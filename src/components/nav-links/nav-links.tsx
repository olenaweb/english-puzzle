'use client';

import { Link, usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import classes from './nav-links.module.css';

export default function NavLinks() {
  const t = useTranslations('HomePage');

  const links = [
    { href: '/welcome', label: t('welcomeClientLink') },
    { href: '/puzzle/1/1', label: t('puzzleLink') },
    { href: '/statistics', label: t('statisticsLink') },
  ];

  const pathname = usePathname();

  return (
    <div className={classes.links}>
      {links.map((link, index) => {
        const isActive = pathname === link.href;
        return (
          <Link key={index} href={link.href} className={isActive ? 'active-link' : ''}>
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}
