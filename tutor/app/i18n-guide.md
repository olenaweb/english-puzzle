# Руководство по интернационализации (i18n) в Next.js приложении

## Содержание

1. [Введение](#введение)
2. [Архитектура i18n](#архитектура-i18n)
3. [Установка и настройка](#установка-и-настройка)
4. [Структура файлов переводов](#структура-файлов-переводов)
5. [Использование переводов в компонентах](#использование-переводов-в-компонентах)
6. [Routing и навигация](#routing-и-навигация)
7. [Server Components vs Client Components](#server-components-vs-client-components)
8. [Динамические значения и интерполяция](#динамические-значения-и-интерполяция)
9. [Middleware и автоопределение языка](#middleware-и-автоопределение-языка)
10. [Лучшие практики](#лучшие-практики)
11. [Типичные ошибки и их решения](#типичные-ошибки-и-их-решения)
12. [Примеры из приложения](#примеры-из-приложения)

---

## Введение

В данном приложении используется библиотека **next-intl** для интернационализации (i18n). Она обеспечивает:

- ✅ Поддержку нескольких языков (английский, русский)
- ✅ Автоматический routing на основе локали
- ✅ Server-side и Client-side переводы
- ✅ Типобезопасность (TypeScript)
- ✅ SEO-оптимизацию для многоязычного контента

**Текущие поддерживаемые языки:**
- `en` - английский (по умолчанию)
- `ru` - русский

---

## Архитектура i18n

### Структура папок

```
english-puzzle/
├── messages/                  # Файлы переводов
│   ├── en.json               # Английские переводы
│   └── ru.json               # Русские переводы
├── src/
│   ├── i18n/                 # Конфигурация i18n
│   │   ├── routing.ts        # Настройки роутинга и локалей
│   │   ├── navigation.ts     # Утилиты навигации
│   │   └── request.ts        # Конфигурация для Server Components
│   ├── middleware.ts         # Middleware для определения языка
│   └── app/
│       └── [locale]/         # Динамический сегмент для языка
│           ├── layout.tsx    # Layout с провайдером переводов
│           └── page.tsx      # Главная страница
```

### Ключевые концепции

1. **Динамический routing**: URL содержит код языка (`/en/...`, `/ru/...`)
2. **Провайдер контекста**: `NextIntlClientProvider` оборачивает приложение
3. **Разделение переводов**: JSON файлы в папке `messages/`
4. **Type-safe**: TypeScript обеспечивает типобезопасность ключей переводов

---

## Установка и настройка

### 1. Установка библиотеки

```bash
npm install next-intl
```

**Из package.json:**
```json
{
  "dependencies": {
    "next-intl": "^4.8.2"
  }
}
```

### 2. Конфигурация routing

**Файл: `src/i18n/routing.ts`**

```typescript
import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

// Определяем поддерживаемые языки и язык по умолчанию
export const routing = defineRouting({
  locales: ['en', 'ru'],        // Список поддерживаемых языков
  defaultLocale: 'en',          // Язык по умолчанию
});

// Тип для TypeScript
export type Locale = (typeof routing.locales)[number];

// Экспортируем навигационные утилиты
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
```

**📌 Замечания:**
- `locales` - массив всех поддерживаемых языков
- `defaultLocale` - язык, который будет использоваться, если язык не определен
- `Locale` - TypeScript тип для валидации локали

### 3. Конфигурация для Server Components

**Файл: `src/i18n/request.ts`**

```typescript
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // Проверяем, что локаль поддерживается
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    // Динамически загружаем файл переводов
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
```

**📌 Замечания:**
- `requestLocale` - локаль из текущего запроса
- Происходит автоматическая загрузка соответствующего JSON файла
- Если локаль не поддерживается, используется язык по умолчанию

### 4. Настройка Next.js

**Файл: `next.config.ts`**

```typescript
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // ваши настройки
};

export default withNextIntl(nextConfig);
```

**📌 Замечания:**
- Плагин `createNextIntlPlugin` интегрирует next-intl в сборку Next.js
- Путь указывает на файл конфигурации запросов

### 5. Middleware для роутинга

**Файл: `src/middleware.ts`**

```typescript
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// Создаем middleware для обработки локалей
export default createMiddleware(routing);

// Определяем, на какие маршруты будет действовать middleware
export const config = {
  matcher: ['/', '/(ru|en)/:path*'],
};
```

**📌 Замечания:**
- Middleware автоматически перенаправляет `/` на `/en` или `/ru`
- `matcher` определяет, какие URL обрабатываются
- Поддерживается автоопределение языка браузера

---

## Структура файлов переводов

### Формат JSON

Файлы переводов организованы по пространствам имен (namespaces) для лучшей структуризации.

**Файл: `messages/en.json`**

```json
{
  "HomePage": {
    "title": "English Puzzle",
    "SignInLabel": "Sign In",
    "SignUpLabel": "Sign Up",
    "welcomeAuth": "Welcome back, {user}!",
    "defaultUser": "user"
  },
  "AuthForm": {
    "email": "Email",
    "password": "Password",
    "validation": {
      "emailRequired": "Email is required",
      "passwordMinLength": "At least 8 characters"
    }
  },
  "LocaleSwitcher": {
    "en": "EN",
    "ru": "RU",
    "label": "Language"
  }
}
```

**Файл: `messages/ru.json`**

```json
{
  "HomePage": {
    "title": "Английская Головоломка",
    "SignInLabel": "Войти",
    "SignUpLabel": "Зарегистрироваться",
    "welcomeAuth": "С возвращением, {user}!",
    "defaultUser": "пользователь"
  },
  "AuthForm": {
    "email": "Почта",
    "password": "Пароль",
    "validation": {
      "emailRequired": "Почта обязательна",
      "passwordMinLength": "Не менее 8 символов"
    }
  },
  "LocaleSwitcher": {
    "en": "EN",
    "ru": "RU",
    "label": "Язык"
  }
}
```

### Организация переводов

**1. Группировка по функциональности**

```json
{
  "ComponentName": {
    "key1": "value1",
    "key2": "value2"
  }
}
```

**2. Вложенные объекты**

```json
{
  "AuthForm": {
    "validation": {
      "emailRequired": "Email is required",
      "passwordRequired": "Password is required"
    }
  }
}
```

**3. Плюрализация (если нужна)**

```json
{
  "items": "{count, plural, =0 {No items} =1 {One item} other {# items}}"
}
```

**📌 Рекомендации:**
- ✅ Используйте понятные ключи (`signIn`, а не `btn1`)
- ✅ Группируйте переводы по компонентам или страницам
- ✅ Держите структуру одинаковой во всех языковых файлах
- ❌ Не дублируйте переводы (используйте повторно)
- ❌ Не храните в переводах HTML код

---

## Использование переводов в компонентах

### Client Components

Для клиентских компонентов используется хук `useTranslations`.

**Пример из приложения: `src/components/footer/footer.tsx`**

```tsx
'use client';  // ← Обязательная директива для Client Component

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import styles from './footer.module.css';

export default function Footer() {
  // Загружаем пространство имен 'Footer'
  const t = useTranslations('Footer');
  
  return (
    <div className={styles.footer}>
      <div className={styles.line}>
        {/* Использование перевода */}
        <p className={`${styles.dev} bold`}>
          {t('developedBy')}
        </p>
        <Link 
          href='https://github.com/olenaweb' 
          className={`${styles.dev} bold`}
          target='_blank' 
          rel='noopener noreferrer'
        >
          - Github olenaweb
        </Link>
      </div>
      <div className={styles.line2}>
        <p className={`${styles.school} bold`}>RS School</p>
        <p className={`${styles.year} bold`}>2026</p>
      </div>
    </div>
  );
}
```

**Как это работает:**
1. `useTranslations('Footer')` загружает все ключи из `messages/[lang].json` в разделе `Footer`
2. `t('developedBy')` возвращает значение для текущего языка
3. При смене языка компонент автоматически обновляется

### Server Components

Для серверных компонентов используется асинхронная функция `useTranslations` из `next-intl/server`.

**Пример: Server Component**

```tsx
import { useTranslations } from 'next-intl/server';

export default async function ServerComponent() {
  const t = await useTranslations('HomePage');
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  );
}
```

**📌 Различия:**

| Тип компонента | Импорт | Async | Директива |
|----------------|--------|-------|-----------|
| Client Component | `'next-intl'` | Нет | `'use client'` |
| Server Component | `'next-intl/server'` | Да | Нет |

---

## Routing и навигация

### Использование Link

**❌ Неправильно:**
```tsx
import Link from 'next/link';

<Link href="/puzzle">Go to Puzzle</Link>
```

**✅ Правильно:**
```tsx
import { Link } from '@/i18n/navigation';

<Link href="/puzzle">Go to Puzzle</Link>
```

**Пример из приложения: `src/components/Header/Header.tsx`**

```tsx
import { Link, useRouter } from '@/i18n/navigation';

export default function Header() {
  const router = useRouter();
  
  return (
    <>
      {/* Link автоматически добавляет префикс локали */}
      <Link href='/' className={classes['logo-wrapper']}>
        <Image src='/logo.png' alt={t('logoAlt')} width={60} height={60} />
      </Link>
      
      {user ? (
        <>
          <Link href='/auth/signin' className={classes.button}>
            {t('SignInLabel')}
          </Link>
          <Link href='/auth/signup' className={classes.button}>
            {t('SignUpLabel')}
          </Link>
        </>
      ) : null}
    </>
  );
}
```

**Что происходит:**
- `/` → `/en/` или `/ru/`
- `/puzzle` → `/en/puzzle` или `/ru/puzzle`
- Локаль определяется автоматически из контекста

### Программная навигация

**Пример из приложения: `src/components/Header/Header.tsx`**

```tsx
import { useRouter } from '@/i18n/navigation';

export default function Header() {
  const router = useRouter();
  
  const handleSignOut = async () => {
    try {
      await signOut();
      // Перенаправление с учетом текущей локали
      router.push('/');
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <button onClick={handleSignOut}>
      {t('SignOutLabel')}
    </button>
  );
}
```

### Переключение языка

**Пример из приложения: `src/components/LocaleSwitcher/LocaleSwitcher.tsx`**

```tsx
'use client';

import { Locale, useLocale, useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { ChangeEvent, useTransition } from 'react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import classes from './LocaleSwitcher.module.css';

export default function LocaleSwitcher() {
  const t = useTranslations('LocaleSwitcher');
  const defaultValue = useLocale();         // Текущая локаль
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();           // Текущий путь без локали
  const params = useParams();               // Параметры маршрута

  function onSelectChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value as Locale;
    
    // Переход с сохранением текущего пути
    startTransition(() => {
      router.replace(
        { pathname, params } as Parameters<typeof router.replace>[0], 
        { locale: nextLocale }
      );
    });
  }

  return (
    <label>
      <p className='sr-only'>{t('label')}</p>
      <select
        id='locale-switcher'
        defaultValue={defaultValue}
        disabled={isPending}
        onChange={onSelectChange}
        className={classes.select}
      >
        {routing.locales.map((locale) => (
          <option key={locale} value={locale}>
            {t(locale)}  {/* 'EN' или 'RU' из переводов */}
          </option>
        ))}
      </select>
    </label>
  );
}
```

**Как это работает:**

1. **useLocale()** - получаем текущий язык (`en` или `ru`)
2. **usePathname()** - получаем путь без префикса локали (`/puzzle` вместо `/en/puzzle`)
3. **useParams()** - сохраняем все параметры маршрута
4. **router.replace()** - переходим на тот же путь с новой локалью
5. **useTransition()** - обеспечивает плавный переход без блокировки UI

**Результат:**
- Находясь на `/en/puzzle`, при выборе "RU" переходим на `/ru/puzzle`
- Все данные страницы сохраняются
- Все переводы обновляются автоматически

---

## Server Components vs Client Components

### Когда использовать Server Components

**✅ Используйте Server Components:**
- Когда не нужна интерактивность
- Для статического контента
- Для SEO-оптимизации
- Когда нужен доступ к серверным данным

**Пример: `src/app/[locale]/page.tsx`**

```tsx
import { use } from 'react';
import { setRequestLocale } from 'next-intl/server';
import MainPage from '@/components/main-page/main-page';

type Props = {
  params: Promise<{ locale: string }>;
};

export default function Home({ params }: Props) {
  const { locale } = use(params);
  
  // Устанавливаем локаль для серверного рендеринга
  setRequestLocale(locale);

  return <MainPage />;
}
```

**📌 Особенности:**
- `setRequestLocale(locale)` - обязательно для статической генерации
- `params` теперь Promise в Next.js 15+
- Используйте `use()` для распаковки Promise

### Когда использовать Client Components

**✅ Используйте Client Components:**
- Когда нужны хуки React (useState, useEffect)
- Для обработки событий (onClick, onChange)
- Когда нужен доступ к browser API
- Для анимаций и интерактивности

**Пример: `src/components/LocaleSwitcher/LocaleSwitcher.tsx`**

```tsx
'use client';  // ← Обязательно!

import { useTranslations } from 'next-intl';
import { useTransition } from 'react';

export default function LocaleSwitcher() {
  const t = useTranslations('LocaleSwitcher');
  const [isPending, startTransition] = useTransition();
  
  // ... интерактивная логика
}
```

### Layout с провайдером

**Пример из приложения: `src/app/[locale]/layout.tsx`**

```tsx
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  
  // Проверяем, что локаль поддерживается
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);

  // Загружаем переводы для текущей локали
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Header />
      <main className='container'>{children}</main>
      <Footer />
    </NextIntlClientProvider>
  );
}
```

**📌 Ключевые моменты:**
1. **NextIntlClientProvider** - делает переводы доступными всем дочерним компонентам
2. **getMessages()** - загружает JSON файл переводов
3. **setRequestLocale()** - необходимо для статической генерации
4. **notFound()** - перенаправляет на 404 если локаль не поддерживается

---

## Динамические значения и интерполяция

### Простая интерполяция

**JSON:**
```json
{
  "HomePage": {
    "welcomeAuth": "Welcome back, {user}!"
  }
}
```

**Компонент:**
```tsx
const t = useTranslations('HomePage');

// Вариант 1: Объект с параметрами
<p>{t('welcomeAuth', { user: 'John' })}</p>
// Результат: "Welcome back, John!"

// Вариант 2: Значение по умолчанию из переводов
<p>{t('welcomeAuth', { user: t('defaultUser') })}</p>
// Результат EN: "Welcome back, user!"
// Результат RU: "С возвращением, пользователь!"
```

**Пример из приложения: `src/context/auth-context.tsx`**

```tsx
const t = useTranslations('AuthForm');

// Динамическое сообщение об ошибке
let translatedError: AuthError = new Error(
  t ? t('signInFailed') + (error as Error)?.message : 'Sign in failed. Please try again.'
);
```

### Rich Text и HTML

**❌ Не храните HTML в переводах:**
```json
{
  "text": "<strong>Bold text</strong>"  // Плохо!
}
```

**✅ Используйте Rich Text API:**
```tsx
import { useTranslations } from 'next-intl';

const t = useTranslations('HomePage');

<p>{t.rich('welcomeMessage', {
  strong: (chunks) => <strong>{chunks}</strong>,
  user: userName
})}</p>
```

**JSON:**
```json
{
  "welcomeMessage": "Welcome, <strong>{user}</strong>!"
}
```

### Условные переводы

**JSON:**
```json
{
  "AuthForm": {
    "showPassword": "Show password",
    "hidePassword": "Hide password"
  }
}
```

**Компонент:**
```tsx
const [showPassword, setShowPassword] = useState(false);
const t = useTranslations('AuthForm');

<button onClick={() => setShowPassword(!showPassword)}>
  {showPassword ? t('hidePassword') : t('showPassword')}
</button>
```

---

## Middleware и автоопределение языка

### Автоопределение языка браузера

**Файл: `src/middleware.ts`**

```typescript
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: ['/', '/(ru|en)/:path*'],
};
```

**Как работает автоопределение:**

1. Пользователь заходит на `/`
2. Middleware читает заголовок `Accept-Language` браузера
3. Если язык браузера `ru-RU`, перенаправляет на `/ru`
4. Если язык браузера `en-US`, перенаправляет на `/en`
5. Если язык не поддерживается, использует `defaultLocale` (`en`)

### Настройка matcher

**Основные паттерны:**

```typescript
export const config = {
  matcher: [
    '/',                      // Только корень
    '/(ru|en)/:path*',        // Все страницы с локалью
    '/((?!api|_next|.*\\.).*)', // Исключаем API и статику
  ],
};
```

**📌 Замечания:**
- Middleware не применяется к `/api/*` роутам
- Middleware не применяется к статическим файлам (`/images/*`, `/*.png`)
- `_next/` исключается автоматически

---

## Лучшие практики

### 1. Структура ключей

**✅ Хорошо:**
```json
{
  "AuthForm": {
    "email": "Email",
    "password": "Password",
    "signIn": "Sign In"
  }
}
```

**❌ Плохо:**
```json
{
  "btn1": "Click me",
  "text_field_1": "Enter data",
  "label_003": "Submit"
}
```

### 2. Переиспользование переводов

**✅ Хорошо:**
```json
{
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete"
  },
  "UserProfile": {
    "saveButton": "Save"  // Или используйте общий ключ
  }
}
```

```tsx
const t = useTranslations('common');
<button>{t('save')}</button>
```

### 3. Организация больших файлов

**Для больших приложений разбивайте на модули:**

```
messages/
├── en/
│   ├── common.json
│   ├── auth.json
│   ├── profile.json
│   └── index.ts
└── ru/
    ├── common.json
    ├── auth.json
    ├── profile.json
    └── index.ts
```

**index.ts:**
```typescript
import common from './common.json';
import auth from './auth.json';
import profile from './profile.json';

export default {
  ...common,
  ...auth,
  ...profile,
};
```

### 4. TypeScript типобезопасность

**Создайте типы для переводов:**

```typescript
// types/i18n.ts
type Messages = typeof import('../messages/en.json');

declare global {
  interface IntlMessages extends Messages {}
}
```

**Теперь будет автодополнение:**
```tsx
const t = useTranslations('HomePage');
t('title');  // ✅ TypeScript знает все ключи
t('unknown');  // ❌ TypeScript покажет ошибку
```

### 5. Fallback значения

```tsx
const t = useTranslations('HomePage');

// Если ключ не найден, вернется сам ключ
<p>{t('missingKey')}</p>  // Выведет: "missingKey"

// Используйте опциональное значение
<p>{t('title') || 'Default Title'}</p>
```

### 6. Тестирование переводов

**Проверьте, что все ключи существуют в обоих языках:**

```typescript
// scripts/check-translations.ts
import en from '../messages/en.json';
import ru from '../messages/ru.json';

function compareKeys(obj1: any, obj2: any, path = '') {
  for (const key in obj1) {
    const newPath = path ? `${path}.${key}` : key;
    if (!(key in obj2)) {
      console.error(`Missing key in RU: ${newPath}`);
    }
    if (typeof obj1[key] === 'object') {
      compareKeys(obj1[key], obj2[key], newPath);
    }
  }
}

compareKeys(en, ru);
compareKeys(ru, en);
```

---

## Типичные ошибки и их решения

### Ошибка 1: "useTranslations can only be called from Client Components"

**❌ Проблема:**
```tsx
// Server Component
export default function ServerComponent() {
  const t = useTranslations('HomePage');  // Ошибка!
  return <div>{t('title')}</div>;
}
```

**✅ Решение:**
```tsx
// Вариант 1: Сделать Client Component
'use client';

export default function ClientComponent() {
  const t = useTranslations('HomePage');
  return <div>{t('title')}</div>;
}

// Вариант 2: Использовать серверную версию
import { useTranslations } from 'next-intl/server';

export default async function ServerComponent() {
  const t = await useTranslations('HomePage');
  return <div>{t('title')}</div>;
}
```

### Ошибка 2: Link не добавляет префикс локали

**❌ Проблема:**
```tsx
import Link from 'next/link';  // Неправильный импорт

<Link href="/puzzle">Go to Puzzle</Link>
// Результат: /puzzle (без /en/ или /ru/)
```

**✅ Решение:**
```tsx
import { Link } from '@/i18n/navigation';  // Правильный импорт

<Link href="/puzzle">Go to Puzzle</Link>
// Результат: /en/puzzle или /ru/puzzle
```

### Ошибка 3: Переводы не обновляются

**❌ Проблема:**
```tsx
'use client';

const translations = useTranslations('HomePage');

// Кешированное значение
const title = translations('title');

export default function Component() {
  return <div>{title}</div>;  // Не обновится при смене языка
}
```

**✅ Решение:**
```tsx
'use client';

export default function Component() {
  const t = useTranslations('HomePage');
  
  return <div>{t('title')}</div>;  // Обновится при смене языка
}
```

### Ошибка 4: Отсутствует setRequestLocale

**❌ Проблема:**
```tsx
// src/app/[locale]/page.tsx
export default function Page({ params }) {
  return <div>Content</div>;
}
// Warning: setRequestLocale missing
```

**✅ Решение:**
```tsx
import { setRequestLocale } from 'next-intl/server';

export default function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  setRequestLocale(locale);  // ← Добавить это
  return <div>Content</div>;
}
```

### Ошибка 5: Неправильная структура JSON

**❌ Проблема:**
```json
{
  "HomePage.title": "English Puzzle",  // Плоская структура
  "HomePage.subtitle": "Learn English"
}
```

**✅ Решение:**
```json
{
  "HomePage": {
    "title": "English Puzzle",  // Вложенная структура
    "subtitle": "Learn English"
  }
}
```

---

## Примеры из приложения

### Пример 1: Футер с переводами

**Файл: `src/components/footer/footer.tsx`**

```tsx
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import styles from './footer.module.css';

export default function Footer() {
  const t = useTranslations('Footer');
  
  return (
    <div className={styles.footer}>
      <div className={styles.line}>
        <p className={`${styles.dev} bold`}>
          {t('developedBy')}  {/* "Developed with ❤️ by Olena Nevzorova" */}
        </p>
        <Link 
          href='https://github.com/olenaweb' 
          target='_blank'
        >
          - Github olenaweb
        </Link>
      </div>
      <div className={styles.line2}>
        <p>RS School</p>
        <p>2026</p>
      </div>
    </div>
  );
}
```

**Переводы:**
```json
// en.json
{
  "Footer": {
    "developedBy": "Developed with ❤️ by Olena Nevzorova",
    "githubLink": "GitHub"
  }
}

// ru.json
{
  "Footer": {
    "developedBy": "Разработано с ❤️ by Olena Nevzorova",
    "githubLink": "GitHub"
  }
}
```

### Пример 2: Хедер с условными переводами

**Файл: `src/components/Header/Header.tsx`**

```tsx
'use client';

import { useTranslations } from 'next-intl';
import { useAuth } from '@/context/auth-context';
import { Link, useRouter } from '@/i18n/navigation';

export default function Header() {
  const t = useTranslations('HomePage');
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      successToast(t('goodbye'));  // "Goodbye!" или "До свидания!"
      router.push('/');
    } catch (error) {
      errorToast(t('signOutError'));  // "Failed to sign out"
    }
  };

  return (
    <header>
      <Link href='/'>
        <img src='/logo.png' alt={t('logoAlt')} />
      </Link>
      
      {user ? (
        <>
          <button onClick={() => router.replace('/')}>
            {t('MainPage')}  {/* "Main Page" или "Главная Страница" */}
          </button>
          <button onClick={handleSignOut}>
            {t('SignOutLabel')}  {/* "Sign Out" или "Выйти" */}
          </button>
        </>
      ) : (
        <>
          <Link href='/auth/signin'>
            {t('SignInLabel')}  {/* "Sign In" или "Войти" */}
          </Link>
          <Link href='/auth/signup'>
            {t('SignUpLabel')}  {/* "Sign Up" или "Зарегистрироваться" */}
          </Link>
        </>
      )}
    </header>
  );
}
```

### Пример 3: Контекст с переводами ошибок

**Файл: `src/context/auth-context.tsx`**

```tsx
'use client';

import { useTranslations } from 'next-intl';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { errorToast } from '@/lib/utils/toast-helpers';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const t = useTranslations('AuthForm');
  
  // Подготовка переведенных сообщений
  const tAuthFailed = t ? t('AuthFailed') : 'Auth failed. Please try again.';
  const tFirebaseConfigError = t ? t('firebaseConfigError') : 'Firebase config error.';

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User signed in successfully:', userCredential.user);
    } catch (error) {
      console.error('Error signing in:', error);
      
      // Формирование переведенной ошибки
      let translatedError: AuthError = new Error(
        t 
          ? t('signInFailed') + (error as Error)?.message 
          : 'Sign in failed. Please try again.'
      );
      
      if ((error as Error)?.message.includes('is not a function')) {
        console.error(tFirebaseConfigError, (error as Error)?.message);
        translatedError = new Error(tFirebaseConfigError);
      }
      
      throw translatedError;
    }
  };

  return (
    <AuthContext.Provider value={{ signIn, /* ... */ }}>
      {children}
    </AuthContext.Provider>
  );
};
```

**Переводы:**
```json
// en.json
{
  "AuthForm": {
    "signInFailed": "Sign in failed. Please try again.",
    "firebaseConfigError": "Firebase configuration is not correct",
    "AuthFailed": "Auth failed. Please try again."
  }
}

// ru.json
{
  "AuthForm": {
    "signInFailed": "Не удалось войти. Пожалуйста, попробуйте снова.",
    "firebaseConfigError": "Конфигурация Firebase некорректна.",
    "AuthFailed": "Не удалось аутентифицироваться. Пожалуйста, попробуйте снова."
  }
}
```

### Пример 4: Переключатель языка

**Полный пример: `src/components/LocaleSwitcher/LocaleSwitcher.tsx`**

```tsx
'use client';

import { Locale, useLocale, useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { ChangeEvent, useTransition } from 'react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import classes from './LocaleSwitcher.module.css';

export default function LocaleSwitcher() {
  // Загрузка переводов для переключателя
  const t = useTranslations('LocaleSwitcher');
  
  // Получение текущей локали
  const defaultValue = useLocale();
  
  // Навигация с учетом i18n
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  
  // Переход без блокировки UI
  const [isPending, startTransition] = useTransition();

  function onSelectChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value as Locale;
    
    // Меняем язык с сохранением текущего пути
    startTransition(() => {
      router.replace(
        { pathname, params } as Parameters<typeof router.replace>[0],
        { locale: nextLocale }
      );
    });
  }

  return (
    <label>
      <p className='sr-only'>{t('label')}</p>  {/* "Language" или "Язык" */}
      <select
        id='locale-switcher'
        defaultValue={defaultValue}
        disabled={isPending}
        onChange={onSelectChange}
        className={classes.select}
      >
        {routing.locales.map((locale) => (
          <option key={locale} value={locale}>
            {t(locale)}  {/* "EN" или "RU" */}
          </option>
        ))}
      </select>
    </label>
  );
}
```

**Переводы:**
```json
// en.json и ru.json (одинаковые)
{
  "LocaleSwitcher": {
    "en": "EN",
    "ru": "RU",
    "label": "Language"  // "Language" в en.json, "Язык" в ru.json
  }
}
```

---

## Заключение

### Контрольный список для нового компонента с i18n

- [ ] Определите, Client или Server Component
- [ ] Импортируйте `useTranslations` из правильного модуля
- [ ] Создайте namespace в файлах переводов (`en.json`, `ru.json`)
- [ ] Добавьте все необходимые ключи в оба файла
- [ ] Используйте `Link` и `useRouter` из `@/i18n/navigation`
- [ ] Добавьте `setRequestLocale` если это страница
- [ ] Проверьте работу на обоих языках

### Полезные ссылки

- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [Next.js Internationalization](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- [ICU Message Format](https://unicode-org.github.io/icu/userguide/format_parse/messages/)

### Поддержка

Если у вас возникли вопросы:
1. Проверьте эту документацию
2. Изучите примеры в приложении
3. Проверьте консоль браузера на ошибки
4. Убедитесь, что все файлы переводов синхронизированы

---

**Автор:** Olena Nevzorova  
**Дата:** 10 февраля 2026 г.  
**Версия:** 1.0
