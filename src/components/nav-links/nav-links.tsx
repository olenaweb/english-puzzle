'use client';
import { useGameStore } from '@/lib/store/useGameStore';
import { Link, usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import classes from './nav-links.module.css';

export default function NavLinks() {
  const t = useTranslations('HomePage');
  const levelId = useGameStore((state) => state.levelId);
  const roundId = useGameStore((state) => state.roundId);

  const links = [
    { href: '/welcome', label: t('welcomeClientLink') },
    { href: `/rounds/${levelId}/${roundId}`, label: t('roundLink') },
    { href: `/puzzle/${levelId}/${roundId}`, label: t('puzzleLink') },
    { href: '/statistics', label: t('statisticsLink') },
  ];

  const pathname = usePathname();
  const isActive = (href: string) => {
    return pathname.includes(href);
  };

  return (
    <div className={classes.links}>
      {links.map((link) => {
        return (
          <Link
            key={link.href}
            href={link.href}
            className={isActive(link.href) ? 'active-link underline' : 'underline'}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}
