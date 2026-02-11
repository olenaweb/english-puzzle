# React-Select: Руководство по использованию

## Оглавление

- [Введение](#введение)
- [Установка](#установка)
- [Базовое использование](#базовое-использование)
- [Кастомная стилизация](#кастомная-стилизация)
- [Интеграция в проект](#интеграция-в-проект)
- [Пример: LocaleSwitcher](#пример-localeswitcher)
- [Полезные советы](#полезные-советы)

## Введение

**React-Select** — это мощная и гибкая библиотека для создания кастомизированных выпадающих списков (select) в React приложениях. В отличие от нативного HTML `<select>`, React-Select предоставляет полный контроль над внешним видом и поведением компонента.

### Почему React-Select?

- ✅ Полная кастомизация стилей
- ✅ Поддержка поиска и фильтрации
- ✅ Мультивыбор
- ✅ Асинхронная загрузка опций
- ✅ Доступность (ARIA-атрибуты)
- ✅ TypeScript поддержка

## Установка

```bash
npm install react-select
```

## Базовое использование

### 1. Простой пример

```tsx
import Select from 'react-select';

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
];

function MyComponent() {
  const [selectedOption, setSelectedOption] = useState(null);

  return (
    <Select
      value={selectedOption}
      onChange={setSelectedOption}
      options={options}
    />
  );
}
```

### 2. Типизация TypeScript

```tsx
type OptionType = {
  value: string;
  label: string;
};

const options: OptionType[] = [
  { value: 'en', label: 'English' },
  { value: 'ru', label: 'Русский' }
];

function MyComponent() {
  const [selected, setSelected] = useState<OptionType | null>(null);

  return (
    <Select<OptionType>
      value={selected}
      onChange={(option) => setSelected(option)}
      options={options}
    />
  );
}
```

## Кастомная стилизация

React-Select использует объект `styles` для кастомизации каждой части компонента.

### Структура объекта styles

```tsx
import { StylesConfig } from 'react-select';

const customStyles: StylesConfig<OptionType, false> = {
  // Контейнер самого select
  control: (provided, state) => ({
    ...provided,
    // Ваши стили
  }),
  
  // Контейнер для выбранного значения
  valueContainer: (provided) => ({
    ...provided,
    // Ваши стили
  }),
  
  // Поле ввода для поиска
  input: (provided) => ({
    ...provided,
    // Ваши стили
  }),
  
  // Выбранное значение
  singleValue: (provided) => ({
    ...provided,
    // Ваши стили
  }),
  
  // Разделитель между значением и стрелкой
  indicatorSeparator: () => ({
    display: 'none', // Скрыть разделитель
  }),
  
  // Стрелка выпадающего списка
  dropdownIndicator: (provided) => ({
    ...provided,
    // Ваши стили
  }),
  
  // Контейнер выпадающего меню
  menu: (provided) => ({
    ...provided,
    // Ваши стили
  }),
  
  // Список опций
  menuList: (provided) => ({
    ...provided,
    // Ваши стили
  }),
  
  // Каждая опция в списке
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? 'blue' : state.isFocused ? 'lightblue' : 'white',
    // Другие стили
  }),
};
```

### Использование CSS переменных

```tsx
const customStyles: StylesConfig<OptionType, false> = {
  control: (provided, state) => ({
    ...provided,
    border: `2px solid var(--detail-color)`,
    backgroundColor: 'var(--outline-color)',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected 
      ? 'var(--detail-color)' 
      : state.isFocused 
        ? 'rgba(104, 109, 4, 0.1)' 
        : 'var(--white-color)',
  }),
};
```

## Интеграция в проект

### Создание утилиты для переиспользования стилей

**src/lib/utils/select-styles.ts**

```typescript
import { StylesConfig } from 'react-select';

export function getCustomSelectStyles<T>(): StylesConfig<T, false> {
  return {
    control: (provided, state) => ({
      ...provided,
      height: '30px',
      minHeight: '30px',
      border: `2px solid var(--detail-color)`,
      borderRadius: '6px',
      backgroundColor: 'var(--outline-color)',
      cursor: 'pointer',
      boxShadow: state.isFocused ? '0 0 0 1px var(--detail-color)' : 'none',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? 'var(--detail-color)'
        : state.isFocused
          ? 'rgba(104, 109, 4, 0.1)'
          : 'var(--white-color)',
      color: state.isSelected ? 'var(--white-color)' : 'rgb(75, 79, 2)',
      cursor: 'pointer',
    }),
    // ... другие стили
  };
}
```

### Использование в компонентах

```tsx
import Select from 'react-select';
import { getCustomSelectStyles } from '@/lib/utils/select-styles';

function MyComponent() {
  return (
    <Select
      options={options}
      styles={getCustomSelectStyles<OptionType>()}
    />
  );
}
```

## Пример: LocaleSwitcher

Полный пример компонента переключателя языков.

**src/components/locale-switcher/locale-switcher.tsx**

```tsx
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

  // Создание массива опций
  const options: OptionType[] = routing.locales.map((locale) => ({
    value: locale,
    label: t(locale),
  }));

  // Определение текущего значения
  const currentValue = options.find((option) => option.value === currentLocale);

  // Обработчик изменения
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
```

### Ключевые моменты:

1. **Типизация**: `Select<OptionType>` указывает тип данных опций
2. **instanceId**: Уникальный идентификатор для SSR (Server-Side Rendering)
3. **isSearchable={false}**: Отключает поиск в списке
4. **isDisabled={isPending}**: Блокирует компонент во время перехода
5. **styles**: Применяет кастомные стили из утилиты

## Полезные советы

### 1. Работа с состоянием загрузки

```tsx
<Select
  isLoading={isLoading}
  isDisabled={isPending}
  options={options}
/>
```

### 2. Плейсхолдер

```tsx
<Select
  placeholder="Выберите опцию..."
  options={options}
/>
```

### 3. Очищаемый select

```tsx
<Select
  isClearable
  value={selected}
  onChange={setSelected}
  options={options}
/>
```

### 4. Мультивыбор

```tsx
type OptionType = {
  value: string;
  label: string;
};

const [selected, setSelected] = useState<OptionType[]>([]);

<Select<OptionType, true>  // true = multi
  isMulti
  value={selected}
  onChange={(options) => setSelected(options as OptionType[])}
  options={options}
/>
```

### 5. Асинхронная загрузка

```tsx
import AsyncSelect from 'react-select/async';

const loadOptions = async (inputValue: string) => {
  const response = await fetch(`/api/search?q=${inputValue}`);
  const data = await response.json();
  return data.map(item => ({ value: item.id, label: item.name }));
};

<AsyncSelect
  cacheOptions
  defaultOptions
  loadOptions={loadOptions}
/>
```

### 6. Кастомные компоненты

```tsx
import Select, { components } from 'react-select';

const CustomOption = (props) => (
  <components.Option {...props}>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <span>{props.data.label}</span>
      <span style={{ marginLeft: 'auto', color: 'gray' }}>
        {props.data.description}
      </span>
    </div>
  </components.Option>
);

<Select
  components={{ Option: CustomOption }}
  options={options}
/>
```

### 7. Управление фокусом

```tsx
const selectRef = useRef(null);

// Установить фокус программно
selectRef.current?.focus();

<Select
  ref={selectRef}
  options={options}
/>
```

## Документация

Официальная документация: [https://react-select.com](https://react-select.com)

## Заключение

React-Select — это мощный инструмент для создания красивых и функциональных выпадающих списков. Используйте утилиту `getCustomSelectStyles` для единообразия дизайна во всем приложении и легко расширяйте функциональность по мере необходимости.

Что сделано:

Создана утилита select-styles.ts с функцией getCustomSelectStyles() для переиспользования стилей
Обновлён компонент locale-switcher.tsx — теперь использует утилиту вместо локальных стилей
Создана инструкция react-select-usage-guide.md с полным руководством
Как использовать в других компонентах:
```tsx

import Select from 'react-select';
import { getCustomSelectStyles } from '@/lib/utils/select-styles';

type MyOptionType = {
  value: string;
  label: string;
};

function MyComponent() {
  return (
    <Select<MyOptionType>
      options={myOptions}
      styles={getCustomSelectStyles<MyOptionType>()}
    />
  );
}

```
Инструкция содержит примеры базового и продвинутого использования, включая мультивыбор, асинхронную загрузку, кастомные компоненты и все возможности библиотеки!

```tsx

// src\lib\utils\select-styles.ts
import { StylesConfig } from 'react-select';

/**
 * Custom styles for react-select, matching the application's design system
 * Uses CSS variables for colors: --detail-color, --dark-detail-color, --outline-color, --white-color
 */
export function getCustomSelectStyles<T>(): StylesConfig<T, false> {
  return {
    control: (provided, state) => ({
      ...provided,
      height: '30px',
      minHeight: '30px',
      padding: '0 0.5rem',
      border: `2px solid ${state.isFocused ? 'var(--detail-color)' : 'var(--detail-color)'}`,
      borderRadius: '6px',
      backgroundColor: 'var(--outline-color)',
      fontSize: 'clamp(0.875rem, 0.7788rem + 0.3846vw, 1.125rem)',
      fontWeight: 600,
      color: 'rgb(75, 79, 2)',
      cursor: 'pointer',
      boxShadow: state.isFocused ? '0 0 0 1px var(--detail-color)' : 'none',
      '&:hover': {
        borderColor: 'var(--detail-color)',
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: '0',
      height: '26px',
    }),
    input: (provided) => ({
      ...provided,
      margin: '0',
      padding: '0',
      color: 'rgb(75, 79, 2)',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'rgb(75, 79, 2)',
      fontWeight: 600,
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      padding: '0 4px',
      color: 'var(--detail-color)',
      '&:hover': {
        color: 'var(--dark-detail-color)',
      },
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '6px',
      overflow: 'hidden',
      border: '2px solid var(--detail-color)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    }),
    menuList: (provided) => ({
      ...provided,
      padding: '0',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? 'var(--detail-color)'
        : state.isFocused
          ? 'rgba(104, 109, 4, 0.1)'
          : 'var(--white-color)',
      color: state.isSelected ? 'var(--white-color)' : 'rgb(75, 79, 2)',
      fontWeight: state.isSelected ? 700 : 600,
      cursor: 'pointer',
      padding: '8px 12px',
      fontSize: 'clamp(0.875rem, 0.7788rem + 0.3846vw, 1.125rem)',
      '&:active': {
        backgroundColor: 'var(--detail-color)',
      },
    }),
  };
}
```
```tsx

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
```