const { Theme, Lecture } = require('../models');

// Получить все темы
exports.getAllThemes = async (req, res) => {
  try {
    const themes = await Theme.findAll({
      where: { isActive: true },
      order: [['order', 'ASC']],
      include: [{
        model: Lecture,
        as: 'lectures',
        where: { isActive: true },
        required: false,
        order: [['order', 'ASC']]
      }]
    });
    
    res.json(themes);
  } catch (error) {
    console.error('❌ Error getting themes:', error);
    res.status(500).json({ error: 'Ошибка при получении тем' });
  }
};

// Получить тему по ID
exports.getThemeById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const theme = await Theme.findByPk(id, {
      include: [{
        model: Lecture,
        as: 'lectures',
        where: { isActive: true },
        required: false,
        order: [['order', 'ASC']]
      }]
    });
    
    if (!theme) {
      return res.status(404).json({ error: 'Тема не найдена' });
    }
    
    res.json(theme);
  } catch (error) {
    console.error('❌ Error getting theme:', error);
    res.status(500).json({ error: 'Ошибка при получении темы' });
  }
};

// Создать новую тему
exports.createTheme = async (req, res) => {
  try {
    const { title, description, image, order } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Название темы обязательно' });
    }
    
    const theme = await Theme.create({
      title,
      description,
      image,
      order: order || 0
    });
    
    console.log('✅ Theme created:', theme.title);
    res.status(201).json(theme);
  } catch (error) {
    console.error('❌ Error creating theme:', error);
    res.status(500).json({ error: 'Ошибка при создании темы' });
  }
};

// Обновить тему
exports.updateTheme = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image, order, isActive } = req.body;
    
    const theme = await Theme.findByPk(id);
    
    if (!theme) {
      return res.status(404).json({ error: 'Тема не найдена' });
    }
    
    await theme.update({
      title: title !== undefined ? title : theme.title,
      description: description !== undefined ? description : theme.description,
      image: image !== undefined ? image : theme.image,
      order: order !== undefined ? order : theme.order,
      isActive: isActive !== undefined ? isActive : theme.isActive
    });
    
    console.log('✅ Theme updated:', theme.title);
    res.json(theme);
  } catch (error) {
    console.error('❌ Error updating theme:', error);
    res.status(500).json({ error: 'Ошибка при обновлении темы' });
  }
};

// Удалить тему
exports.deleteTheme = async (req, res) => {
  try {
    const { id } = req.params;
    
    const theme = await Theme.findByPk(id);
    
    if (!theme) {
      return res.status(404).json({ error: 'Тема не найдена' });
    }
    
    await theme.destroy();
    
    console.log('✅ Theme deleted:', theme.title);
    res.json({ message: 'Тема успешно удалена' });
  } catch (error) {
    console.error('❌ Error deleting theme:', error);
    res.status(500).json({ error: 'Ошибка при удалении темы' });
  }
};
