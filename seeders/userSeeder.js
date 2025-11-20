const bcrypt = require('bcrypt');
const User = require('../models/User');

const seedUsers = async () => {
    try {
        // Проверяем, есть ли уже пользователи
        const existingUsers = await User.count();
        
        if (existingUsers > 0) {
            console.log('Пользователи уже существуют, пропускаем seed');
            return;
        }

        // Хешируем пароли
        const password1 = await bcrypt.hash('password123', 10);
        const password2 = await bcrypt.hash('admin123', 10);
        const password3 = await bcrypt.hash('user123', 10);

        // Создаем тестовых пользователей
        const users = await User.bulkCreate([
            {
                name: 'Администратор',
                email: 'admin@bilimhub.com',
                password: password2
            },
            {
                name: 'Иван Иванов',
                email: 'ivan@example.com',
                password: password1
            },
            {
                name: 'Мария Петрова',
                email: 'maria@example.com',
                password: password1
            },
            {
                name: 'Алексей Сидоров',
                email: 'alex@example.com',
                password: password3
            },
            {
                name: 'Елена Смирнова',
                email: 'elena@example.com',
                password: password3
            }
        ]);

        console.log(`✅ Создано ${users.length} тестовых пользователей:`);
        console.log('   - admin@bilimhub.com (пароль: admin123)');
        console.log('   - ivan@example.com (пароль: password123)');
        console.log('   - maria@example.com (пароль: password123)');
        console.log('   - alex@example.com (пароль: user123)');
        console.log('   - elena@example.com (пароль: user123)');
    } catch (error) {
        console.error('❌ Ошибка при создании тестовых пользователей:', error);
    }
};

module.exports = seedUsers;
