const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { isAuthenticated } = require('../middleware/auth');

// Регистрация (POST) - без middleware, чтобы форма работала
router.post('/register', authController.register);

// Вход (POST) - без middleware, чтобы форма работала
router.post('/login', authController.login);

// Выход (GET)
router.get('/logout', isAuthenticated, authController.logout);

// API: Получить текущего пользователя
router.get('/api/user', authController.getCurrentUser);

module.exports = router;
