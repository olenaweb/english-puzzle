'use client';

import { Locale, useLocale, useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useTransition } from 'react';
import Select from 'react-select';

import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { getCustomSelectStyles } from '@/lib/utils/select-styles';

import classes from './locale-switcher.module.css';

type OptionType = {
  value: string;
  label: string;
};

export default function LocaleSwitcher() {
  const t = useTranslations('LocaleSwitcher');
  const currentLocale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();

  const options: OptionType[] = routing.locales.map((locale) => ({
    value: locale,
    label: t(locale),
  }));

  const currentValue = options.find((option) => option.value === currentLocale);

  function onSelectChange(option: OptionType | null) {
    if (!option) return;
    const nextLocale = option.value as Locale;
    startTransition(() => {
      router.replace({ pathname, params } as Parameters<typeof router.replace>[0], {
        locale: nextLocale,
      });
    });
  }

  return (
    <div className={classes.container}>
      <label htmlFor='locale-switcher' className='sr-only'>
        {t('label')}
      </label>
      <Select<OptionType>
        id='locale-switcher'
        instanceId='locale-switcher'
        value={currentValue}
        options={options}
        onChange={onSelectChange}
        isDisabled={isPending}
        isSearchable={false}
        styles={getCustomSelectStyles<OptionType>()}
        className={classes.select}
      />
    </div>
  );
}
