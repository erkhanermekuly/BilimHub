const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const UserRating = sequelize.define('UserRating', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    totalScore: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    completedLectures: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    completedTests: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    rank: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    level: {
        type: DataTypes.STRING,
        defaultValue: 'Новичок'
    }
}, {
    tableName: 'user_ratings',
    timestamps: true
});

module.exports = UserRating;
