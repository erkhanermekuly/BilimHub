const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAuthenticatedAPI, isAdminAPI } = require('../middleware/auth');

// Получить профиль
router.get('/profile', isAuthenticatedAPI, userController.getProfile);

// Обновить профиль
router.put('/update', isAuthenticatedAPI, userController.updateProfile);

// Изменить пароль
router.put('/change-password', isAuthenticatedAPI, userController.changePassword);

// Удалить аккаунт
router.delete('/delete', isAuthenticatedAPI, userController.deleteAccount);

// Получить всех пользователей (только админ)
router.get('/all', isAdminAPI, userController.getAllUsers);

// Удалить пользователя (только админ)
router.delete('/:id', isAdminAPI, userController.deleteUser);

module.exports = router;
