const { connectDB } = require('../config/db');
const seedUsers = require('./userSeeder');

const runSeeders = async () => {
    try {
        console.log('🌱 Начало заполнения базы данных тестовыми данными...\n');

        // Подключаемся к базе данных
        await connectDB();

        // Запускаем seeders
        await seedUsers();

        console.log('\n✅ Заполнение базы данных завершено успешно!');
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Ошибка при заполнении базы данных:', error);
        process.exit(1);
    }
};

runSeeders();
