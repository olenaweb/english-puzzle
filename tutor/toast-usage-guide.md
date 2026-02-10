# Руководство по использованию React Hot Toast

## Введение

React Hot Toast - это легковесная библиотека для отображения уведомлений (toast notifications) в React приложениях. Она предоставляет простой и гибкий API для создания различных типов уведомлений.

## Установка

```bash
npm install react-hot-toast
```

## Базовая настройка

### 1. Добавление Toaster компонента

Добавьте компонент `<Toaster />` в корневой компонент вашего приложения (обычно в `layout.tsx`):

```tsx
import { Toaster } from 'react-hot-toast';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
```

### 2. Импорт toast

```typescript
import toast from 'react-hot-toast';
```

## Типы уведомлений

### 1. Успешное уведомление (Success)

Используется для отображения успешных операций:

```typescript
toast.success('Операция выполнена успешно!', {
  duration: 4000,
  style: {
    background: '#10B981',
    color: 'white',
  },
});
```

**Примеры использования:**
- Успешная авторизация
- Сохранение данных
- Успешная отправка формы

### 2. Ошибка (Error)

Используется для отображения ошибок:

```typescript
toast.error('Произошла ошибка при выполнении операции', {
  duration: 5000,
  style: {
    background: '#EF4444',
    color: 'white',
  },
});
```

**С деталями ошибки:**

```typescript
const handleError = (message: string, error: unknown) => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  toast.error(`${message}\nError: ${errorMessage}`, {
    duration: 5000,
    style: {
      background: '#EF4444',
      color: 'white',
    },
  });
};
```

**Примеры использования:**
- Ошибка сети
- Ошибка валидации
- Ошибка при выполнении запроса

### 3. Информационное уведомление (Info)

Используется для общей информации:

```typescript
toast('Это информационное сообщение', {
  icon: 'ℹ️',
  duration: 3000,
  style: {
    background: '#3B82F6',
    color: 'white',
  },
});
```

**Примеры использования:**
- Напоминания
- Подсказки
- Общая информация

### 4. Предупреждение (Warning)

Для предупреждающих сообщений:

```typescript
toast('Внимание! Проверьте введенные данные', {
  icon: '⚠️',
  duration: 4000,
  style: {
    background: '#F59E0B',
    color: 'white',
  },
});
```

**Примеры использования:**
- Предупреждения о потере данных
- Уведомления о лимитах
- Предупреждения о безопасности

### 5. Загрузка (Loading)

Для отображения процесса загрузки:

```typescript
const toastId = toast.loading('Загрузка данных...');

// После завершения операции:
toast.success('Данные загружены!', { id: toastId });
// или
toast.error('Ошибка загрузки', { id: toastId });
```

### 6. Promise уведомления

Автоматическое управление состояниями для промисов:

```typescript
const myPromise = fetchData();

toast.promise(
  myPromise,
  {
    loading: 'Загрузка...',
    success: 'Данные успешно загружены!',
    error: 'Не удалось загрузить данные',
  },
  {
    style: {
      minWidth: '250px',
    },
    success: {
      duration: 3000,
      style: {
        background: '#10B981',
        color: 'white',
      },
    },
    error: {
      duration: 5000,
      style: {
        background: '#EF4444',
        color: 'white',
      },
    },
  }
);
```

## Продвинутые опции

### Управление длительностью

```typescript
toast.success('Быстрое сообщение', { duration: 2000 }); // 2 секунды
toast.error('Долгое сообщение', { duration: 10000 }); // 10 секунд
toast('Бесконечное', { duration: Infinity }); // Не исчезает автоматически
```

### Позиционирование

```typescript
toast.success('Сообщение', { position: 'top-center' });
// Варианты: 'top-left', 'top-center', 'top-right', 
//           'bottom-left', 'bottom-center', 'bottom-right'
```

### Пользовательские стили

```typescript
toast.success('Стилизованное сообщение', {
  style: {
    border: '1px solid #713200',
    padding: '16px',
    color: '#713200',
    background: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  iconTheme: {
    primary: '#713200',
    secondary: '#FFFAEE',
  },
});
```

### Управление отдельными уведомлениями

```typescript
// Создание с ID
const toastId = toast.loading('Обработка...');

// Обновление
toast.success('Готово!', { id: toastId });

// Закрытие конкретного уведомления
toast.dismiss(toastId);

// Закрытие всех уведомлений
toast.dismiss();
```

### Кастомное содержимое

```typescript
toast.custom((t) => (
  <div
    style={{
      background: 'white',
      padding: '16px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    }}
  >
    <h3>Пользовательское уведомление</h3>
    <p>Это полностью кастомный компонент</p>
    <button onClick={() => toast.dismiss(t.id)}>Закрыть</button>
  </div>
));
```

## Лучшие практики

### 1. Создайте утилиты для повторяющихся уведомлений

```typescript
// src/utils/toast-helpers.ts
import toast from 'react-hot-toast';

export const showSuccessToast = (message: string) => {
  toast.success(message, {
    duration: 4000,
    style: {
      background: '#10B981',
      color: 'white',
    },
  });
};

export const showErrorToast = (message: string, error?: unknown) => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  toast.error(
    error ? `${message}\nError: ${errorMessage}` : message,
    {
      duration: 5000,
      style: {
        background: '#EF4444',
        color: 'white',
      },
    }
  );
};

export const showLoadingToast = (message: string) => {
  return toast.loading(message);
};
```

### 2. Используйте с async/await

```typescript
const handleSubmit = async () => {
  const toastId = toast.loading('Сохранение...');
  
  try {
    await saveData();
    toast.success('Данные сохранены!', { id: toastId });
  } catch (error) {
    toast.error('Ошибка сохранения', { id: toastId });
  }
};
```

### 3. Избегайте дублирования

```typescript
// Предотвращение множественных одинаковых уведомлений
const showUniqueError = (message: string) => {
  toast.error(message, { id: 'unique-error-id' });
};
```

## Примеры реальных сценариев

### Авторизация

```typescript
const handleLogin = async (email: string, password: string) => {
  const toastId = toast.loading('Вход в систему...');
  
  try {
    await signIn(email, password);
    toast.success('Добро пожаловать!', {
      id: toastId,
      duration: 3000,
      style: {
        background: '#10B981',
        color: 'white',
      },
    });
  } catch (error) {
    toast.error(
      `Ошибка авторизации: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`,
      {
        id: toastId,
        duration: 5000,
        style: {
          background: '#EF4444',
          color: 'white',
        },
      }
    );
  }
};
```

### Загрузка файла

```typescript
const handleFileUpload = async (file: File) => {
  const uploadPromise = uploadFile(file);
  
  toast.promise(
    uploadPromise,
    {
      loading: `Загрузка ${file.name}...`,
      success: `${file.name} успешно загружен!`,
      error: `Ошибка при загрузке ${file.name}`,
    }
  );
};
```

### Валидация формы

```typescript
const validateAndSubmit = (data: FormData) => {
  if (!data.email) {
    toast.error('Email обязателен для заполнения', {
      icon: '📧',
      duration: 3000,
    });
    return;
  }
  
  if (!data.password || data.password.length < 6) {
    toast.error('Пароль должен содержать минимум 6 символов', {
      icon: '🔒',
      duration: 3000,
    });
    return;
  }
  
  // Продолжить с отправкой
  submitForm(data);
};
```

## Глобальная конфигурация

```typescript
// В компоненте Toaster
<Toaster
  position="top-right"
  reverseOrder={false}
  gutter={8}
  containerClassName=""
  containerStyle={{}}
  toastOptions={{
    // Настройки по умолчанию для всех уведомлений
    duration: 4000,
    style: {
      background: '#363636',
      color: '#fff',
    },
    // Настройки для конкретных типов
    success: {
      duration: 3000,
      style: {
        background: '#10B981',
      },
    },
    error: {
      duration: 5000,
      style: {
        background: '#EF4444',
      },
    },
  }}
/>
```

## Заключение

React Hot Toast - это мощная и гибкая библиотека для управления уведомлениями. Используйте соответствующие типы уведомлений для разных ситуаций, настраивайте стили под ваш дизайн и создавайте утилиты для повторяющихся паттернов.
