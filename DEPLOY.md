# Деплой на Vercel

## Быстрый деплой (1 клик)

1. Закоммитьте код в GitHub:
```bash
git init
git add .
git commit -m "Initial commit: EduAI.kz MVP"
git branch -M main
git remote add origin <ваш-репозиторий>
git push -u origin main
```

2. Зайдите на [vercel.com](https://vercel.com)

3. Нажмите "Add New Project" → выберите ваш GitHub репозиторий

4. Добавьте переменные окружения в Vercel:
   - `DASHSCOPE_API_KEY`
   - `QWEN_BASE_URL`
   - `JWT_SECRET`

5. Нажмите "Deploy"

## После деплоя

1. Инициализируйте БД на production:
```bash
vercel env pull .env.production.local
npx tsx lib/init-db.ts
```

2. Или подключите Supabase/PostgreSQL для production (рекомендуется)

---

## Альтернатива: Деплой с CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

Vercel автоматически определит Next.js и настроит деплой.

---

**Готово!** Ваша платформа доступна по ссылке от Vercel.
