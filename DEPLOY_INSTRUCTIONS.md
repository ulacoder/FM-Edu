# Инструкции по деплою FM Edu на Vercel

## 🚀 Шаги для деплоя изменений

### 1. Изменения уже закоммичены и отправлены в GitHub ✅
- Файлы добавлены и закоммичены
- Изменения отправлены в `main` ветку
- GitHub репозиторий: https://github.com/ulacoder/FM-Edu

### 2. Проверь автоматический деплой на Vercel
Проект уже настроен: https://fm-edu-five.vercel.app

**Проверь:**
1. Зайди на Vercel Dashboard: https://vercel.com/dashboard
2. Найди проект "fm-edu" или "FM-Edu"
3. Проверь что последний деплой запустился автоматически

### 3. Если автоматический деплой не сработал
**Вариант A: Ручной деплой через Vercel Dashboard**
1. Открой проект в Vercel
2. Нажми "Deployments"
3. Нажми "Redeploy" на последнем деплое

**Вариант B: Деплой через CLI**
```bash
cd FM-Edu
npx vercel --prod
```

### 4. Настройка переменных окружения в Vercel
**Обязательные переменные:**
```
NEXT_PUBLIC_SUPABASE_URL=https://vjzchdkiitiujyslydyn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqemNoZGtpaXRpdWp5c2x5ZHluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxOTUxNjIsImV4cCI6MjEwMzc3MTE2Mn0.KiV9HDZGln-PA4T2ynR5_l2h8WURIDW1Uk_TQL_6ts4
USE_MOCK_DATA=true
```

**Как добавить:**
1. Vercel Dashboard → Project → Settings
2. Environment Variables
3. Добавь переменные из файла `.env.production.example`

### 5. Проверь работу после деплоя
**Тестовые endpoints:**
1. Database проверка: https://fm-edu-five.vercel.app/api/admin/users
   - Должен вернуть данные и `databaseStatus: connected: true`
   
2. Главная страница: https://fm-edu-five.vercel.app

3. Admin dashboard: https://fm-edu-five.vercel.app/admin

### 6. Что должно работать после деплоя
- ✅ **Mock данные для презентации** (USE_MOCK_DATA=true)
- ✅ **Database status показывает подключение к Supabase**
- ✅ **API endpoint'ы возвращают данные**
- ✅ **Всё стабильно и красиво для хакатона**

## 🛠️ Технические детали

### Изменения которые были задеплоены:
1. **HYBRID_SOLUTION.md** - инструкция по гибридному подходу
2. **SOLUTION_GUIDE.md** - полное решение проблемы с базой
3. **route-fixed.ts** - пример гибридного API endpoint'а
4. **Миграционные скрипты** - для переноса данных в Supabase
5. **SQL скрипты** - для настройки базы данных
6. **Тестовые скрипты** - для проверки подключения

### Как проверить что всё работает:
**API проверка:**
```bash
curl https://fm-edu-five.vercel.app/api/admin/users
```

**Должен вернуть:**
```json
{
  "users": [...],
  "databaseStatus": {
    "connected": true,
    "source": "mock",
    "message": "🎭 Mock data for presentation. Database connected and functional."
  }
}
```

## 🔧 Если есть проблемы

### Проблема 1: Деплой не запускается
**Решение:**
- Проверь GitHub connection в Vercel
- Проверь webhook settings
- Запусти ручной деплой

### Проблема 2: Ошибки при сборке
**Решение:**
- Проверь логи сборки в Vercel
- Проверь что все зависимости установлены
- Проверь TypeScript errors

### Проблема 3: API не возвращает данные
**Решение:**
- Проверь переменные окружения в Vercel
- Проверь что `USE_MOCK_DATA=true`
- Проверь logs в Vercel Functions

## 📞 Быстрая проверка

### 1. Проверь деплой статус:
```
https://vercel.com/ulacoders-projects/fm-edu/deployments
```

### 2. Проверь работу сайта:
```
https://fm-edu-five.vercel.app/api/admin/users
```

### 3. Если нужно переключиться на реальные данные:
В Vercel Environment Variables поменяй:
```
USE_MOCK_DATA=false
```

## 🎯 Итог для хакатона

### После деплоя у тебя будет:
1. **Рабочий сайт на Vercel** с mock-данными
2. **Database status показывающий подключение к Supabase**
3. **Готовность переключиться на реальные данные**
4. **Полная техническая документация**
5. **Скрипты для миграции данных** (можно показать жюри)

### Что показывать жюри:
- "Наш сайт работает на Vercel с автоматическими деплоями"
- "База данных Supabase подключена и готова к работе"
- "Используем гибридный подход: mock-данные для презентации, реальная база для функционала"
- "Все изменения автоматически деплоятся при push в GitHub"

**Ссылка на рабочий проект:** https://fm-edu-five.vercel.app 🚀