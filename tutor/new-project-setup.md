# Инструкция по созданию нового Next.js проекта

Данная инструкция описывает процесс создания нового проекта на базе Next.js 15 с TypeScript, React 19, Firebase, next-intl и полным набором инструментов для линтинга и форматирования кода.

## Оглавление

- [Системные требования](#системные-требования)
- [Шаг 1: Создание базового проекта Next.js](#шаг-1-создание-базового-проекта-nextjs)
- [Шаг 2: Установка основных зависимостей](#шаг-2-установка-основных-зависимостей)
- [Шаг 3: Установка инструментов разработки](#шаг-3-установка-инструментов-разработки)
- [Шаг 4: Настройка TypeScript](#шаг-4-настройка-typescript)
- [Шаг 5: Настройка Next.js](#шаг-5-настройка-nextjs)
- [Шаг 6: Настройка ESLint](#шаг-6-настройка-eslint)
- [Шаг 7: Настройка Prettier](#шаг-7-настройка-prettier)
- [Шаг 8: Настройка Stylelint](#шаг-8-настройка-stylelint)
- [Шаг 9: Настройка npm-скриптов](#шаг-9-настройка-npm-скриптов)
- [Шаг 10: Настройка next-intl для интернационализации](#шаг-10-настройка-next-intl-для-интернационализации)
- [Шаг 11: Настройка Firebase](#шаг-11-настройка-firebase)
- [Дополнительная информация](#дополнительная-информация)

---

## Системные требования

- **Node.js**: версия 20.x или выше
- **npm**: версия 10.x или выше (поставляется с Node.js)
- **Git**: для контроля версий

Проверить установленные версии:

```bash
node --version
npm --version
git --version
```

---

## Шаг 1: Создание базового проекта Next.js

### Команда:

```bash
npx create-next-app@latest my-new-app
```

### Интерактивные опции при создании:

При запуске команды вам будут заданы следующие вопросы:

1. **Would you like to use TypeScript?** → **Yes** ✅
   - TypeScript обеспечивает статическую типизацию, что улучшает качество кода и облегчает разработку

2. **Would you like to use ESLint?** → **Yes** ✅
   - ESLint помогает находить и исправлять проблемы в JavaScript/TypeScript коде

3. **Would you like to use Tailwind CSS?** → **No** ❌
   - Мы используем CSS модули вместо Tailwind

4. **Would you like your code inside a `src/` directory?** → **Yes** ✅
   - Организация кода в папке src делает структуру проекта более чистой

5. **Would you like to use App Router?** → **Yes** ✅
   - App Router - это новая система маршрутизации Next.js 13+

6. **Would you like to use Turbopack for `next dev`?** → **Yes** ✅
   - Turbopack - это быстрая система сборки, замена Webpack

7. **Would you like to customize the import alias?** → **No** ❌
   - Используем стандартный алиас `@/*` для импортов из папки src

### Переход в созданную папку:

```bash
cd my-new-app
```

---

## Шаг 2: Установка основных зависимостей

Эти библиотеки необходимы для работы приложения в production.

### Команда:

```bash
npm install @hookform/resolvers firebase next-intl react-hook-form react-hot-toast uuid yup
```

### Описание зависимостей:

- **@hookform/resolvers** (^5.2.1) - интеграция популярных схем валидации (Yup, Zod и др.) с React Hook Form
- **firebase** (^12.2.1) - SDK для работы с Firebase (аутентификация, база данных, хранилище)
- **next-intl** (^4.3.5) - библиотека для интернационализации (i18n) в Next.js
- **react-hook-form** (^7.62.0) - производительная библиотека для работы с формами в React
- **react-hot-toast** (^2.6.0) - легковесная библиотека для отображения уведомлений/тостов
- **uuid** (^12.0.0) - генерация уникальных идентификаторов
- **yup** (^1.7.0) - схемы валидации для JavaScript объектов

### Версии React и Next.js:

Эти пакеты уже установлены при создании проекта:

- **next**: 15.5.2
- **react**: 19.1.0
- **react-dom**: 19.1.0

---

## Шаг 3: Установка инструментов разработки

Эти пакеты используются только в процессе разработки.

### Команда:

```bash
npm install -D @eslint/eslintrc @types/node @types/react @types/react-dom @types/strip-comments dotenv eslint-config-prettier eslint-plugin-prettier npm-run-all prettier strip-comments stylelint stylelint-config-clean-order stylelint-config-standard typescript-eslint
```

### Описание dev-зависимостей:

#### TypeScript и типы:

- **@types/node** (^20) - типы Node.js API
- **@types/react** (^19) - типы для React
- **@types/react-dom** (^19) - типы для ReactDOM
- **@types/strip-comments** (^2.0.4) - типы для библиотеки strip-comments

#### ESLint:

- **@eslint/eslintrc** (^3) - поддержка конфигурационных файлов ESLint
- **typescript-eslint** (^8.43.0) - ESLint плагин для TypeScript
- **eslint-config-prettier** (^10.1.8) - отключает правила ESLint, которые конфликтуют с Prettier
- **eslint-plugin-prettier** (^5.5.4) - запускает Prettier как правило ESLint

#### Форматирование и стилизация:

- **prettier** (^3.6.2) - форматтер кода
- **stylelint** (^16.23.1) - линтер для CSS/SCSS
- **stylelint-config-standard** (^39.0.0) - стандартная конфигурация для Stylelint
- **stylelint-config-clean-order** (^7.0.0) - автоматическая сортировка CSS свойств

#### Утилиты:

- **dotenv** (^17.2.1) - загрузка переменных окружения из файла .env
- **npm-run-all** (^4.1.5) - запуск нескольких npm-скриптов параллельно или последовательно
- **strip-comments** (^2.0.1) - удаление комментариев из кода

**Примечание:** Пакеты `eslint`, `eslint-config-next` и `typescript` уже установлены при создании проекта.

---

## Шаг 4: Настройка TypeScript

### Создание файла `tsconfig.json`:

Если файл не был создан автоматически, создайте его в корне проекта:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noImplicitAny": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Описание ключевых опций:

- **target**: "ES2017" - целевая версия JavaScript
- **strict**: true - включает все строгие проверки типов
- **noImplicitAny**: true - запрещает неявный тип `any`
- **noUnusedLocals**: true - ошибка при неиспользуемых локальных переменных
- **noUnusedParameters**: true - ошибка при неиспользуемых параметрах функций
- **noFallthroughCasesInSwitch**: true - требует `break` в каждом case блоке switch
- **paths**: настройка алиасов для импортов (`@/` указывает на `./src/`)

---

## Шаг 5: Настройка Next.js

### Создание файла `next.config.ts`:

Замените или создайте файл `next.config.ts` в корне проекта:

```typescript
import type { NextConfig } from 'next';
import { execSync } from 'child_process';
import createNextIntlPlugin from 'next-intl/plugin';

const logDisabled = process.env.NEXT_PUBLIC_LOGGING_ENABLED
  ? process.env.NEXT_PUBLIC_LOGGING_ENABLED !== 'true'
  : true;

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_GIT_COMMIT_SHA:
      process.env.VERCEL_GIT_COMMIT_SHA || execSync('git rev-parse HEAD').toString().trim(),
    NEXT_PUBLIC_BUILD_TIMESTAMP: new Date().toUTCString(),
  },
  compiler: {
    removeConsole: logDisabled,
  },
  turbopack: {
    root: __dirname,
  },
};

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
export default withNextIntl(nextConfig);
```

### Описание конфигурации:

- **env**: добавляет переменные окружения, доступные на клиенте
  - `NEXT_PUBLIC_GIT_COMMIT_SHA` - хеш текущего коммита Git
  - `NEXT_PUBLIC_BUILD_TIMESTAMP` - время сборки приложения
- **compiler.removeConsole**: удаляет `console.*` в production (если `logDisabled === true`)
- **turbopack**: настройки для Turbopack
- **withNextIntl**: плагин для интернационализации

---

## Шаг 6: Настройка ESLint

### Создание файла `eslint.config.mjs`:

Создайте файл `eslint.config.mjs` в корне проекта:

```javascript
import prettierConfig from 'eslint-config-prettier';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const strictConfig = tseslint.config({
  files: ['**/*.{ts,tsx}'],
  extends: [...tseslint.configs.strict],
  plugins: {
    'react-hooks': reactHooks,
  },
  rules: {
    ...reactHooks.configs.recommended.rules,
    eqeqeq: 'error',
    'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
  },
});

const isStrictMode = process.env.ESLINT_STRICT_MODE
  ? process.env.ESLINT_STRICT_MODE !== 'false'
  : true;

const eslintConfig = [
  ...compat.extends('next/core-web-vitals'),
  {
    ignores: ['node_modules/**', '.next/**', 'out/**', 'build/**', 'next-env.d.ts'],
  },
  {
    files: ['**/*.test.{js,jsx,ts,tsx}', '**/*.spec.{js,jsx,ts,tsx}'],
    rules: {
      '@next/next/no-img-element': 'off',
    },
  },
  ...(isStrictMode ? strictConfig : []),
  prettierConfig,
];

export default eslintConfig;
```

### Описание конфигурации:

- **next/core-web-vitals**: базовые правила Next.js
- **typescript-eslint/strict**: строгие правила для TypeScript
- **react-hooks**: правила для React Hooks
- **eqeqeq**: требует использования `===` вместо `==`
- **no-console**: предупреждение при использовании console (кроме warn, error, info)
- **prettierConfig**: отключает конфликтующие с Prettier правила
- **ESLINT_STRICT_MODE**: переменная окружения для включения/отключения строгого режима

---

## Шаг 7: Настройка Prettier

### Создание файла `.prettierrc.json`:

Создайте файл `.prettierrc.json` в корне проекта:

```json
{
  "singleQuote": true,
  "jsxSingleQuote": true,
  "trailingComma": "all",
  "semi": true,
  "tabWidth": 2,
  "printWidth": 100
}
```

### Описание опций:

- **singleQuote**: использовать одинарные кавычки вместо двойных
- **jsxSingleQuote**: использовать одинарные кавычки в JSX
- **trailingComma**: "all" - добавлять trailing запятые везде, где возможно
- **semi**: добавлять точку с запятой в конце выражений
- **tabWidth**: размер отступа - 2 пробела
- **printWidth**: максимальная длина строки - 100 символов

### Создание файла `.prettierignore`:

Создайте файл `.prettierignore` в корне проекта:

```
node_modules
.next
out
build
dist
coverage
.git
package-lock.json
pnpm-lock.yaml
yarn.lock
```

---

## Шаг 8: Настройка Stylelint

### Создание файла `.stylelintrc.cjs`:

Создайте файл `.stylelintrc.cjs` в корне проекта:

```javascript
module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-clean-order'],
  rules: {
    'at-rule-no-unknown': null,
  },
};
```

### Описание конфигурации:

- **stylelint-config-standard**: стандартные правила Stylelint
- **stylelint-config-clean-order**: автоматическая сортировка CSS свойств для лучшей читаемости
- **at-rule-no-unknown**: отключено, чтобы не вызывать ошибки на @layer и других директивах

---

## Шаг 9: Настройка npm-скриптов

### Добавление скриптов в `package.json`:

Откройте `package.json` и добавьте/обновите секцию `scripts`:

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "lint:fix": "eslint --fix .",
    "format:fix": "prettier --write .",
    "format:check": "prettier --check .",
    "stylelint": "stylelint \"**/*.css\"",
    "stylelint:fix": "stylelint \"**/*.css\" --fix",
    "type:check": "tsc --noEmit",
    "fix": "npm-run-all --parallel --continue-on-error format:fix lint:fix stylelint:fix type:check",
    "docs": "npx tsx scripts/doc-source.ts",
    "strip-comments": "npx tsx scripts/strip-comments.ts `git ls-files`"
  }
}
```

### Описание скриптов:

- **dev**: запуск development сервера с Turbopack
- **build**: создание production сборки
- **start**: запуск production сервера
- **lint**: проверка кода ESLint
- **lint:fix**: автоматическое исправление проблем ESLint
- **format:fix**: форматирование кода Prettier
- **format:check**: проверка форматирования без изменений
- **stylelint**: проверка CSS файлов
- **stylelint:fix**: автоматическое исправление CSS
- **type:check**: проверка типов TypeScript без компиляции
- **fix**: запуск всех исправлений параллельно
- **docs**: генерация документации (требует создания скрипта)
- **strip-comments**: удаление комментариев из файлов

---

## Шаг 10: Настройка next-intl для интернационализации

### 10.1. Создание структуры папок для i18n

```bash
mkdir src\i18n
mkdir messages
```

### 10.2. Создание файла `src/i18n/request.ts`:

```typescript
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
```

### 10.3. Создание файла `src/i18n/routing.ts`:

```typescript
import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['en', 'ru'],
  defaultLocale: 'en',
});

export type Locale = (typeof routing.locales)[number];

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
```

### 10.4. Создание файла `src/middleware.ts`:

```typescript
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: ['/', '/(ru|en)/:path*'],
};
```

### 10.5. Создание файлов перевода:

**messages/en.json:**

```json
{
  "HomePage": {
    "title": "Welcome",
    "description": "This is the home page"
  }
}
```

**messages/ru.json:**

```json
{
  "HomePage": {
    "title": "Добро пожаловать",
    "description": "Это главная страница"
  }
}
```

### 10.6. Обновление layout:

Создайте `src/app/[locale]/layout.tsx`:

```typescript
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

---

## Шаг 11: Настройка Firebase

### 11.1. Создание проекта Firebase:

1. Перейдите на [Firebase Console](https://console.firebase.google.com/)
2. Создайте новый проект
3. Добавьте веб-приложение в проект
4. Скопируйте конфигурацию Firebase

### 11.2. Создание файла `.env.local`:

Создайте файл `.env.local` в корне проекта:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_LOGGING_ENABLED=false
```

**Важно:** Добавьте `.env.local` в `.gitignore`!

### 11.3. Создание Firebase конфигурации:

Создайте папку и файл `src/lib/firebase/config.ts`:

```typescript
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Инициализация Firebase только если еще не инициализирован
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
```

---

## Дополнительная информация

### Запуск проекта:

```bash
# Development режим
npm run dev

# Production сборка
npm run build
npm start
```

### Проверка кода:

```bash
# Полная проверка и автоисправление
npm run fix

# Отдельные проверки
npm run lint
npm run format:check
npm run stylelint
npm run type:check
```

### Структура проекта:

```
my-new-app/
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   └── layout.tsx (root)
│   ├── components/
│   ├── i18n/
│   │   ├── routing.ts
│   │   └── request.ts
│   ├── lib/
│   │   └── firebase/
│   │       └── config.ts
│   └── middleware.ts
├── messages/
│   ├── en.json
│   └── ru.json
├── public/
├── .env.local
├── .prettierrc.json
├── .prettierignore
├── .stylelintrc.cjs
├── eslint.config.mjs
├── next.config.ts
├── tsconfig.json
└── package.json
```

### Полезные ссылки:

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [React Hook Form](https://react-hook-form.com/)
- [Yup Validation](https://github.com/jquense/yup)

### Примечания:

1. **Версии пакетов**: Указаны актуальные версии на момент создания документа. При установке npm может установить более новые версии.

2. **Git**: Не забудьте инициализировать Git репозиторий:

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

3. **Исключенные библиотеки**: В данной конфигурации намеренно исключены:
   - vitest - фреймворк для тестирования
   - husky - Git hooks
   - lint-staged - линтинг staged файлов
   - postman-code-generators - генерация кода из Postman

4. **Переменные окружения**: Всегда используйте `.env.local` для хранения секретных ключей и не коммитьте этот файл в Git.

5. **CSS модули**: Для стилизации компонентов используйте CSS модули (`component.module.css`).

---

**Дата создания документа:** 7 февраля 2026 г.
**Версия:** 1.0


### Add Firebase to your web app
Completed
Register app
2
Add Firebase SDK

Use npm

Use a <script> tag
If you're already using npm and a module bundler such as webpack or Rollup, you can run the following command to install the latest SDK (Learn more):

```bash
npm install firebase
```
Then, initialize Firebase and begin using the SDKs for the products you'd like to use.

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAtsA6DdUP5CpxpwL3O--KcXfIS2SOnT7U",
  authDomain: "english-puzzle-f0b48.firebaseapp.com",
  projectId: "english-puzzle-f0b48",
  storageBucket: "english-puzzle-f0b48.firebasestorage.app",
  messagingSenderId: "560933486702",
  appId: "1:560933486702:web:ff4374f972c934ae36667f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
Note: This option uses the modular JavaScript SDK, which provides reduced SDK size.

Learn more about Firebase for web: Get Started, Web SDK API Reference, Samples

