const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const { connectDB, sequelize } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const learningRoutes = require('./routes/learningRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const { isAuthenticated } = require('./middleware/auth');

const app = express();

// Middleware
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Настройка сессий
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-this',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 24 часа
    }
}));

// Middleware для передачи пользователя во все шаблоны
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

app.set('view engine', 'ejs');


app.get('/', (req, res) => {
    res.render('layouts/main');
});

app.get('/login', (req, res) => {
    res.render('pages/login', { error: null });
});

app.get('/register', (req, res) => {
    res.render('pages/register', { error: null });
});

// Страница профиля (требует авторизации)
app.get('/profile', isAuthenticated, (req, res) => {
    res.render('pages/profile');
});

// Страница курсов
app.get('/themes', (req, res) => {
    res.render('pages/themes');
});

// Страница деталей темы
app.get('/themes/:id', (req, res) => {
    res.render('pages/theme-detail');
});

// Страница лекции
app.get('/lectures/:id', isAuthenticated, (req, res) => {
    res.render('pages/lecture');
});

// Страница рейтинга
app.get('/rating', (req, res) => {
    res.render('pages/rating');
});

// Страница контактов
app.get('/contacts', (req, res) => {
    res.render('pages/contacts');
});

// Админ-панель (только для администраторов)
const { isAdmin } = require('./middleware/auth');
app.get('/admin', isAdmin, (req, res) => {
    res.render('pages/admin');
});

// Подключение роутов
app.use('/', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api', learningRoutes);
app.use('/api', uploadRoutes);

const PORT = process.env.PORT || 5000;

// Старт сервера
const startServer = async () => {
    await connectDB(); // подключение к Postgres 
    
    // Синхронизация отключена - используем миграции
    // await sequelize.sync(); 
    
    app.listen(PORT, () => {
        console.log(`Сервер запущен на http://localhost:${PORT}`);
    });
};

startServer();


