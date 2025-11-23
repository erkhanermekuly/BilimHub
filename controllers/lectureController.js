const { Lecture, Theme, Test, UserProgress } = require('../models');

// Получить все лекции темы
exports.getLecturesByTheme = async (req, res) => {
  try {
    const { themeId } = req.params;
    
    const lectures = await Lecture.findAll({
      where: { 
        themeId,
        isActive: true 
      },
      order: [['order', 'ASC']],
      include: [{
        model: Test,
        as: 'tests',
        where: { isActive: true },
        required: false
      }]
    });
    
    res.json(lectures);
  } catch (error) {
    console.error('❌ Error getting lectures:', error);
    res.status(500).json({ error: 'Ошибка при получении лекций' });
  }
};

// Получить лекцию по ID
exports.getLectureById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.session.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'Не авторизован' });
    }
    
    const lecture = await Lecture.findByPk(id, {
      include: [
        {
          model: Theme,
          as: 'theme'
        },
        {
          model: Test,
          as: 'tests',
          where: { isActive: true },
          required: false
        }
      ]
    });
    
    if (!lecture) {
      return res.status(404).json({ error: 'Лекция не найдена' });
    }
    
    // Проверяем доступ к лекции
    const hasAccess = await checkLectureAccess(userId, lecture);
    
    if (!hasAccess) {
      return res.status(403).json({ error: 'Доступ к лекции закрыт. Завершите предыдущую лекцию.' });
    }
    
    // Получаем прогресс пользователя
    const progress = await UserProgress.findOne({
      where: {
        userId,
        lectureId: id
      }
    });
    
    res.json({
      lecture,
      progress: progress || { isCompleted: false, test1Score: null, test2Score: null }
    });
  } catch (error) {
    console.error('❌ Error getting lecture:', error);
    res.status(500).json({ error: 'Ошибка при получении лекции' });
  }
};

// Проверка доступа к лекции
async function checkLectureAccess(userId, lecture) {
  // Находим все лекции темы
  const lectures = await Lecture.findAll({
    where: { 
      themeId: lecture.themeId,
      isActive: true 
    },
    order: [['order', 'ASC']]
  });
  
  // Первая лекция всегда доступна
  if (lectures[0].id === lecture.id) {
    return true;
  }
  
  // Находим предыдущую лекцию
  const currentIndex = lectures.findIndex(l => l.id === lecture.id);
  if (currentIndex === -1) return false;
  
  const previousLecture = lectures[currentIndex - 1];
  
  // Проверяем, завершена ли предыдущая лекция
  const previousProgress = await UserProgress.findOne({
    where: {
      userId,
      lectureId: previousLecture.id,
      isCompleted: true
    }
  });
  
  return !!previousProgress;
}

// Создать новую лекцию
exports.createLecture = async (req, res) => {
  try {
    const { themeId } = req.params;
    const { title, content, videoUrl, order, duration } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Название и содержание лекции обязательны' });
    }
    
    const theme = await Theme.findByPk(themeId);
    if (!theme) {
      return res.status(404).json({ error: 'Тема не найдена' });
    }
    
    const lecture = await Lecture.create({
      themeId,
      title,
      content,
      videoUrl,
      order: order || 0,
      duration
    });
    
    console.log('✅ Lecture created:', lecture.title);
    res.status(201).json(lecture);
  } catch (error) {
    console.error('❌ Error creating lecture:', error);
    res.status(500).json({ error: 'Ошибка при создании лекции' });
  }
};

// Обновить лекцию
exports.updateLecture = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, videoUrl, order, duration, isActive } = req.body;
    
    const lecture = await Lecture.findByPk(id);
    
    if (!lecture) {
      return res.status(404).json({ error: 'Лекция не найдена' });
    }
    
    await lecture.update({
      title: title !== undefined ? title : lecture.title,
      content: content !== undefined ? content : lecture.content,
      videoUrl: videoUrl !== undefined ? videoUrl : lecture.videoUrl,
      order: order !== undefined ? order : lecture.order,
      duration: duration !== undefined ? duration : lecture.duration,
      isActive: isActive !== undefined ? isActive : lecture.isActive
    });
    
    console.log('✅ Lecture updated:', lecture.title);
    res.json(lecture);
  } catch (error) {
    console.error('❌ Error updating lecture:', error);
    res.status(500).json({ error: 'Ошибка при обновлении лекции' });
  }
};

// Удалить лекцию
exports.deleteLecture = async (req, res) => {
  try {
    const { id } = req.params;
    
    const lecture = await Lecture.findByPk(id);
    
    if (!lecture) {
      return res.status(404).json({ error: 'Лекция не найдена' });
    }
    
    await lecture.destroy();
    
    console.log('✅ Lecture deleted:', lecture.title);
    res.json({ message: 'Лекция успешно удалена' });
  } catch (error) {
    console.error('❌ Error deleting lecture:', error);
    res.status(500).json({ error: 'Ошибка при удалении лекции' });
  }
};
