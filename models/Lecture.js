const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Lecture = sequelize.define('Lecture', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    themeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'themes',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    videoUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },
    order: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    duration: {
        type: DataTypes.INTEGER, // в минутах
        defaultValue: 0
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'lectures',
    timestamps: true
});

module.exports = Lecture;
