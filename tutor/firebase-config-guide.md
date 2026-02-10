# Руководство по настройке Firebase в Next.js приложении

## Обзор

Этот документ описывает правильную настройку Firebase в Next.js приложении с использованием TypeScript на примере модуля `config.ts`.

## Структура конфигурации

### 1. Полный пример модуля config.ts

```typescript
import toast from 'react-hot-toast';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Конфигурация Firebase из переменных окружения
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Инициализация Firebase App
let app: FirebaseApp;

try {
  // Проверяем, не инициализировано ли приложение уже
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
} catch (error) {
  // Создаем пустой объект в случае ошибки
  app = {} as FirebaseApp;
  toast.error(
    `Firebase config error: ${error instanceof Error ? error.message : String(error)}`,
    {
      duration: 5000,
      style: {
        background: '#EF4444',
        color: 'white',
      },
    }
  );
}

// Инициализация сервисов Firebase
let auth: Auth;
let db: Firestore;

try {
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  auth = {} as Auth;
  db = {} as Firestore;
  toast.error(
    `Firebase config error: ${error instanceof Error ? error.message : String(error)}`,
    {
      duration: 5000,
      style: {
        background: '#EF4444',
        color: 'white',
      },
    }
  );
}

// Экспорт инстансов
export { app, auth, db };

// Утилитная функция для получения ID текущего пользователя
export const getCurrentUserId = (): string | null => {
  try {
    return auth.currentUser?.uid || null;
  } catch {
    return null;
  }
};
```

## Детальный разбор компонентов

### 1. Импорты

```typescript
import toast from 'react-hot-toast';
```
- Импорт для отображения уведомлений об ошибках

```typescript
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
```
- `initializeApp`: Инициализирует новый экземпляр Firebase
- `getApps`: Возвращает массив всех инициализированных приложений
- `getApp`: Получает существующий экземпляр приложения
- `FirebaseApp`: TypeScript тип для приложения Firebase

```typescript
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
```
- Импорт сервисов аутентификации и базы данных

### 2. Конфигурация из переменных окружения

```typescript
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
```

**Важно**: В Next.js переменные окружения, которые должны быть доступны в браузере, должны начинаться с `NEXT_PUBLIC_`.

### 3. Файл .env.local

Создайте файл `.env.local` в корне проекта:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

**Безопасность**: Добавьте `.env.local` в `.gitignore`!

### 4. Инициализация приложения с предотвращением дублирования

```typescript
let app: FirebaseApp;

try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
} catch (error) {
  app = {} as FirebaseApp;
  toast.error(
    `Firebase config error: ${error instanceof Error ? error.message : String(error)}`,
    {
      duration: 5000,
      style: {
        background: '#EF4444',
        color: 'white',
      },
    }
  );
}
```

**Зачем проверка `!getApps().length`?**
- В Next.js при горячей перезагрузке (Hot Module Replacement) модуль может выполняться несколько раз
- Повторная инициализация вызовет ошибку
- Проверка предотвращает создание дубликатов

**Обработка ошибок:**
- Создаем пустой объект с типом `FirebaseApp` для предотвращения падения приложения
- Показываем пользователю уведомление об ошибке через toast
- Правильно форматируем сообщение ошибки

### 5. Инициализация сервисов

```typescript
let auth: Auth;
let db: Firestore;

try {
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  auth = {} as Auth;
  db = {} as Firestore;
  toast.error(/* ... */);
}
```

**Важные моменты:**
- Сервисы инициализируются после создания app
- Каждый сервис обернут в try-catch
- В случае ошибки создаются заглушки для предотвращения runtime ошибок

### 6. Экспорт

```typescript
export { app, auth, db };
```

Экспортируем инстансы для использования в других частях приложения.

### 7. Вспомогательные функции

```typescript
export const getCurrentUserId = (): string | null => {
  try {
    return auth.currentUser?.uid || null;
  } catch {
    return null;
  }
};
```

Безопасная функция для получения ID текущего пользователя.

## Исправления и улучшения

### Проблема 1: Тип для Firestore

**Было:**
```typescript
let db: ReturnType<typeof getFirestore>;
```

**Должно быть:**
```typescript
import { Firestore } from 'firebase/firestore';
let db: Firestore;
```

`Firestore` - это правильный экспортируемый тип из Firebase SDK.

### Проблема 2: Отсутствие функции err

**Было:**
```typescript
err('Firebase config error:', error);
```

**Исправлено:**
```typescript
toast.error(
  `Firebase config error: ${error instanceof Error ? error.message : String(error)}`,
  {
    duration: 5000,
    style: {
      background: '#EF4444',
      color: 'white',
    },
  }
);
```

Использование toast для уведомлений пользователя вместо консольного логирования.

## Использование Firebase в компонентах

### Аутентификация

```typescript
// src/hooks/useAuth.ts
import { auth } from '@/lib/firebase/config';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const [user, setUser] = useState(auth.currentUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      toast.success('Успешный вход!');
      return result;
    } catch (error) {
      toast.error(
        `Ошибка входа: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`
      );
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      toast.success('Аккаунт создан успешно!');
      return result;
    } catch (error) {
      toast.error(
        `Ошибка регистрации: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`
      );
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success('Вы вышли из системы');
    } catch (error) {
      toast.error('Ошибка при выходе');
      throw error;
    }
  };

  return { user, loading, login, register, logout };
};
```

### Работа с Firestore

```typescript
// src/services/user-service.ts
import { db } from '@/lib/firebase/config';
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs 
} from 'firebase/firestore';
import toast from 'react-hot-toast';

// Создание документа
export const createUser = async (userId: string, userData: any) => {
  try {
    await setDoc(doc(db, 'users', userId), userData);
    toast.success('Пользователь создан');
  } catch (error) {
    toast.error('Ошибка создания пользователя');
    throw error;
  }
};

// Чтение документа
export const getUser = async (userId: string) => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      toast.error('Пользователь не найден');
      return null;
    }
  } catch (error) {
    toast.error('Ошибка получения данных пользователя');
    throw error;
  }
};

// Обновление документа
export const updateUser = async (userId: string, updates: any) => {
  try {
    const docRef = doc(db, 'users', userId);
    await updateDoc(docRef, updates);
    toast.success('Данные обновлены');
  } catch (error) {
    toast.error('Ошибка обновления данных');
    throw error;
  }
};

// Удаление документа
export const deleteUser = async (userId: string) => {
  try {
    await deleteDoc(doc(db, 'users', userId));
    toast.success('Пользователь удален');
  } catch (error) {
    toast.error('Ошибка удаления пользователя');
    throw error;
  }
};

// Запрос коллекции
export const getUsersByRole = async (role: string) => {
  try {
    const q = query(collection(db, 'users'), where('role', '==', role));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    toast.error('Ошибка получения пользователей');
    throw error;
  }
};
```

## Лучшие практики

### 1. Проверка инициализации

Всегда проверяйте, инициализирован ли Firebase перед использованием:

```typescript
export const isFirebaseInitialized = (): boolean => {
  return getApps().length > 0;
};
```

### 2. Обработка ошибок

Всегда оборачивайте операции Firebase в try-catch:

```typescript
const safeOperation = async () => {
  try {
    // Firebase операция
  } catch (error) {
    if (error instanceof Error) {
      toast.error(`Ошибка: ${error.message}`);
    }
    // Логирование для разработчиков
    console.error('Firebase error:', error);
  }
};
```

### 3. TypeScript типизация

Создайте типы для ваших данных:

```typescript
// src/types/user.ts
export interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

// Использование
import { User } from '@/types/user';

export const getUser = async (userId: string): Promise<User | null> => {
  // ...
};
```

### 4. Переменные окружения

Создайте файл `.env.example` для документации:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### 5. Безопасность

- Никогда не коммитьте `.env.local` в git
- Используйте Firebase Security Rules для защиты данных
- Валидируйте данные перед отправкой в Firestore
- Используйте Firebase Admin SDK для серверных операций

## Структура проекта

```
src/
├── lib/
│   └── firebase/
│       ├── config.ts          # Конфигурация Firebase
│       ├── auth.ts            # Утилиты аутентификации
│       └── firestore.ts       # Утилиты Firestore
├── hooks/
│   └── useAuth.ts             # Hook для аутентификации
├── services/
│   ├── user-service.ts        # Сервис для работы с пользователями
│   └── data-service.ts        # Другие сервисы
└── types/
    └── user.ts                # TypeScript типы
```

## Тестирование

### Unit тесты для Firebase

```typescript
// __tests__/firebase-config.test.ts
import { getApps } from 'firebase/app';

describe('Firebase Configuration', () => {
  it('should initialize Firebase app', () => {
    expect(getApps().length).toBeGreaterThan(0);
  });

  it('should have auth instance', () => {
    const { auth } = require('@/lib/firebase/config');
    expect(auth).toBeDefined();
  });

  it('should have db instance', () => {
    const { db } = require('@/lib/firebase/config');
    expect(db).toBeDefined();
  });
});
```

## Заключение

Правильная настройка Firebase - это основа надежного приложения. Следуйте этим рекомендациям:

1. ✅ Используйте переменные окружения для конфигурации
2. ✅ Предотвращайте повторную инициализацию с помощью `getApps()`
3. ✅ Обрабатывайте все ошибки и показывайте понятные сообщения
4. ✅ Используйте правильные TypeScript типы
5. ✅ Создавайте утилиты и сервисы для переиспользования кода
6. ✅ Документируйте конфигурацию и примеры использования
7. ✅ Тестируйте критичные части

Этот подход обеспечит стабильную работу Firebase в вашем Next.js приложении.
