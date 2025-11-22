const express = require('express');
const router = express.Router();
const themeController = require('../controllers/themeController');
const lectureController = require('../controllers/lectureController');
const testController = require('../controllers/testController');
const { isAuthenticatedAPI, isAdminAPI } = require('../middleware/auth');

// Темы (чтение доступно всем, изменение только админу)
router.get('/themes', themeController.getAllThemes);
router.get('/themes/:id', themeController.getThemeById);
router.post('/themes', isAdminAPI, themeController.createTheme);
router.put('/themes/:id', isAdminAPI, themeController.updateTheme);
router.delete('/themes/:id', isAdminAPI, themeController.deleteTheme);

// Лекции (чтение для авторизованных, изменение только админу)
router.get('/themes/:themeId/lectures', lectureController.getLecturesByTheme);
router.get('/lectures/:id', isAuthenticatedAPI, lectureController.getLectureById);
router.post('/themes/:themeId/lectures', isAdminAPI, lectureController.createLecture);
router.put('/lectures/:id', isAdminAPI, lectureController.updateLecture);
router.delete('/lectures/:id', isAdminAPI, lectureController.deleteLecture);

// Тесты (чтение и прохождение для авторизованных, создание только админу)
router.get('/tests/:id', isAuthenticatedAPI, testController.getTestById);
router.post('/tests/:id/submit', isAuthenticatedAPI, testController.submitTest);
router.post('/lectures/:lectureId/tests', isAdminAPI, testController.createTest);

// Рейтинг
router.get('/ratings', testController.getRatings);

module.exports = router;
