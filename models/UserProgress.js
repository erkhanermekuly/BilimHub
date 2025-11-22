const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const UserProgress = sequelize.define('UserProgress', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    lectureId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'lectures',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    testNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    isCompleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    test1Score: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    test2Score: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    attempts: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    completedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'user_progress',
    timestamps: true
});

module.exports = UserProgress;
