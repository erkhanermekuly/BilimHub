# BilimHub - Система аутентификации

## Реализованная функциональность

### ✅ JWT токены
- Генерация JWT токенов при регистрации и входе
- Токены хранятся в HTTP-only cookies (безопасно)
- Срок действия токена: 7 дней
- Middleware для проверки токенов

### ✅ Контроллеры
- **authController.js** - контроллер аутентификации
  - `register()` - регистрация пользователя
  - `login()` - вход пользователя
  - `logout()` - выход пользователя
  - `getCurrentUser()` - получение текущего пользователя (API)

### ✅ Middleware
- **auth.js** - middleware для защиты роутов
  - `isAuthenticated` - проверка авторизации (для web-страниц)
  - `isGuest` - проверка, что пользователь не авторизован
  - `isAuthenticatedAPI` - проверка авторизации (для API)

### ✅ Seed данные
- Тестовые пользователи для разработки
- Автоматическое создание пользователей при первом запуске

## Установка и запуск

### 1. Установка зависимостей
```bash
npm install
```

### 2. Настройка .env
Файл уже настроен с тестовыми данными:
```env
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=123
DB_NAME=test
DB_DIALECT=postgres
DB_PORT=5432

PORT=5000
SESSION_SECRET=bilimhub-secret-key-2025-change-this-in-production
JWT_SECRET=bilimhub-jwt-secret-key-2025-change-this-in-production
```

### 3. Создание базы данных
```sql
CREATE DATABASE test;
```

### 4. Заполнение тестовыми данными
```bash
npm run seed
```

### 5. Запуск сервера
```bash
npm start
```

Сервер запустится на `http://localhost:5000`

## Тестовые пользователи

После выполнения `npm run seed` доступны следующие пользователи:

| Email | Пароль | Имя |
|-------|--------|-----|
| admin@bilimhub.com | admin123 | Администратор |
| ivan@example.com | password123 | Иван Иванов |
| maria@example.com | password123 | Мария Петрова |
| alex@example.com | user123 | Алексей Сидоров |
| elena@example.com | user123 | Елена Смирнова |

## Роуты

### Веб-страницы
- `GET /` - главная страница
- `GET /login` - страница входа
- `GET /register` - страница регистрации
- `GET /logout` - выход (требует авторизации)

### API
- `POST /register` - регистрация пользователя
  ```json
  {
    "name": "Имя",
    "email": "email@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }
  ```

- `POST /login` - вход пользователя
  ```json
  {
    "email": "email@example.com",
    "password": "password123"
  }
  ```

- `GET /api/user` - получить текущего пользователя (требует токен)

## Структура проекта

```
BilimHub/
├── config/
│   └── db.js              # Конфигурация базы данных
├── controllers/
│   └── authController.js  # Контроллер аутентификации
├── middleware/
│   └── auth.js            # Middleware для защиты роутов
├── models/
│   └── User.js            # Модель пользователя
├── routes/
│   └── authRoutes.js      # Роуты аутентификации
├── seeders/
│   ├── index.js           # Главный файл seeders
│   └── userSeeder.js      # Seeder для пользователей
├── views/
│   ├── layouts/
│   ├── pages/
│   └── partials/
├── public/
├── .env                   # Переменные окружения
├── server.js              # Главный файл сервера
└── package.json

```

## Технологии

- **Express.js** - веб-фреймворк
- **Sequelize** - ORM для работы с БД
- **PostgreSQL** - база данных
- **JWT** - токены аутентификации
- **bcrypt** - хеширование паролей
- **express-session** - сессии
- **cookie-parser** - работа с cookies
- **EJS** - шаблонизатор

## Безопасность

✅ Пароли хешируются с помощью bcrypt (10 раундов)
✅ JWT токены хранятся в HTTP-only cookies
✅ Защита от несанкционированного доступа через middleware
✅ Валидация всех входных данных
✅ Проверка email на уникальность
✅ Минимальная длина пароля: 6 символов
