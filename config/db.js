const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT, // postgres
        port: process.env.DB_PORT,
        logging: false,
        dialectModule: require('pg'), // важно для PostgreSQL
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

// Проверка подключения к базе данных
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Подключение к базе данных PostgreSQL установлено успешно');
        
        // Синхронизация отключена - используем миграции
        // await sequelize.sync({ alter: true });
        // console.log('Модели синхронизированы с базой данных');
    } catch (error) {
        console.error('❌ Ошибка подключения к базе данных:', error.message);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };
