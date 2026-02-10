# Объяснение файла globals.d.ts и объявления модулей TypeScript

## Что такое globals.d.ts?

`globals.d.ts` — это файл деклараций типов TypeScript (ambient declarations file), который содержит глобальные определения типов для вашего проекта. Расширение `.d.ts` означает "declaration" (объявление).

## Зачем он нужен?

TypeScript — это строго типизированный язык. Когда вы пишете:

```typescript
import "./index.css";
```

TypeScript не знает, что делать с файлом `.css`, потому что это не TypeScript/JavaScript файл. По умолчанию TypeScript понимает только импорты `.ts`, `.tsx`, `.js`, `.jsx` файлов.

### Проблема без globals.d.ts:

```
❌ Ошибка: Не удается найти объявления модуля или типа для импорта с побочным эффектом "./index.css"
```

TypeScript говорит: "Я не знаю, что такое `.css` файл и как с ним работать!"

## Как работает declare module?

### Синтаксис:

```typescript
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}
```

### Разбор по частям:

#### 1. `declare module`
Это ключевое слово TypeScript для создания ambient module declaration (объявление внешнего модуля). Мы говорим TypeScript: "Вот правило для импорта определенных файлов".

#### 2. `'*.css'`
Это паттерн (pattern matching). Звездочка `*` — это wildcard (подстановочный символ).
- `'*.css'` означает "любой файл, заканчивающийся на `.css`"
- `'*.module.css'` означает "любой файл, заканчивающийся на `.module.css`"

**Примеры совпадений:**
- `'*.css'` совпадет с: `index.css`, `styles.css`, `app.css`
- `'*.module.css'` совпадет с: `Button.module.css`, `Header.module.css`

#### 3. Тело объявления

```typescript
const content: { [className: string]: string };
export default content;
```

Здесь мы определяем, какой тип будет у импортированного CSS модуля.

## Два типа CSS импортов

### 1. Обычные CSS файлы (глобальные стили)

```typescript
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}
```

**Использование:**
```typescript
import "./index.css";  // Импорт для побочного эффекта (применение стилей)
// или
import styles from "./styles.css";
```

- **Назначение:** Для глобальных стилей, которые применяются ко всему приложению
- **Тип:** Объект, где ключи — имена классов, значения — строки
- **Побочный эффект:** Стили добавляются в DOM

### 2. CSS Modules (изолированные стили)

```typescript
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}
```

**Использование:**
```typescript
import styles from "./Button.module.css";

function Button() {
  return <button className={styles.primary}>Click me</button>;
}
```

- **Назначение:** Для локальных стилей компонентов (CSS Modules)
- **Тип:** Объект с ключами-классами
- **Особенность:** Имена классов автоматически хэшируются для изоляции

## Как TypeScript использует эти декларации?

### Шаг 1: Встреча с импортом
```typescript
import "./index.css";
```

### Шаг 2: Поиск соответствия
TypeScript смотрит: "Есть ли декларация для файлов `*.css`?"
- Находит: `declare module '*.css' { ... }`

### Шаг 3: Применение типа
TypeScript говорит: "Окей, я знаю этот тип! Это валидный импорт."
- ✅ Ошибки нет!

## Почему { [className: string]: string }?

Это индексная сигнатура (index signature) в TypeScript.

```typescript
{ [className: string]: string }
```

**Читается как:** "Объект, где любой ключ (с типом string) имеет значение типа string"

**Пример:**
```typescript
const styles = {
  container: "container_a1b2c3",
  button: "button_d4e5f6",
  header: "header_g7h8i9"
}
```

Каждый ключ (`container`, `button`, `header`) — это string, и каждое значение — тоже string.

## Где должен находиться globals.d.ts?

**Вариант 1: В корне проекта** (рекомендуется)
```
my-project/
├── globals.d.ts        ← Здесь
├── tsconfig.json
├── package.json
└── src/
```

**Вариант 2: В папке src/**
```
my-project/
├── tsconfig.json
├── package.json
└── src/
    ├── globals.d.ts    ← Здесь
    └── ...
```

**Важно:** Файл должен быть включен в `tsconfig.json`:

```json
{
  "include": [
    "**/*.ts",
    "**/*.tsx",
    "globals.d.ts"  // Явно или через паттерн
  ]
}
```

## Ambient Declarations (Внешние объявления)

`globals.d.ts` — это файл с ambient declarations. "Ambient" означает, что:

1. **Не содержит реализации** — только декларации типов
2. **Доступны глобально** — не нужно импортировать
3. **Описывают внешние ресурсы** — файлы, библиотеки, API

## Другие примеры declare module

### Для изображений:
```typescript
declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.jpg' {
  const value: string;
  export default value;
}

declare module '*.svg' {
  const value: any;
  export default value;
}
```

**Использование:**
```typescript
import logo from './logo.png';
// logo имеет тип string (путь к изображению)
```

### Для JSON:
```typescript
declare module '*.json' {
  const value: any;
  export default value;
}
```

### Для WebAssembly:
```typescript
declare module '*.wasm' {
  const value: any;
  export default value;
}
```

## Почему это необходимо в Next.js + TypeScript?

Next.js использует webpack для сборки, который умеет обрабатывать CSS импорты:

1. **Webpack** видит `import "./index.css"` → обрабатывает CSS
2. **TypeScript** видит `import "./index.css"` → не знает, что делать

**Решение:** `globals.d.ts` говорит TypeScript: "Не волнуйся, webpack обработает это!"

## Практический пример работы

### Без globals.d.ts:
```typescript
import "./styles.css";  // ❌ Ошибка TypeScript!
```

### С globals.d.ts:
```typescript
// globals.d.ts
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}
```

```typescript
import "./styles.css";  // ✅ Работает!
```

## Ключевые моменты

1. **globals.d.ts** — файл деклараций типов для проекта
2. **declare module** — объявление типа для внешних модулей
3. **'*.css'** — паттерн для всех CSS файлов
4. **Необходим**, потому что TypeScript не знает о не-JS/TS файлах
5. **Сообщает** TypeScript, как типизировать импорты ресурсов
6. **Не влияет** на runtime — только для проверки типов

## Резюме

`globals.d.ts` — это "переводчик" между TypeScript и файлами-ресурсами (CSS, изображения и т.д.). Он говорит TypeScript: "Доверься мне, эти импорты валидны, а сборщик (webpack/Vite) знает, как их обработать".
