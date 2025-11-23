const express = require('express');
const router = express.Router();
const { uploadVideo, uploadImage } = require('../config/upload');
const { isAdminAPI } = require('../middleware/auth');

router.post('/upload/video', isAdminAPI, uploadVideo.single('video'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Файл не загружен' });
        }

        const videoPath = '/uploads/videos/' + req.file.filename;
        
        res.json({
            success: true,
            videoPath: videoPath,
            message: 'Видео успешно загружено'
        });
    } catch (error) {
        console.error('Ошибка загрузки видео:', error);
        res.status(500).json({ error: 'Ошибка загрузки видео' });
    }
});

router.post('/upload/image', isAdminAPI, uploadImage.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Файл не загружен' });
        }

        const imagePath = '/uploads/images/' + req.file.filename;
        
        res.json({
            success: true,
            imagePath: imagePath,
            message: 'Изображение успешно загружено'
        });
    } catch (error) {
        console.error('Ошибка загрузки изображения:', error);
        res.status(500).json({ error: 'Ошибка загрузки изображения' });
    }
});

module.exports = router;
