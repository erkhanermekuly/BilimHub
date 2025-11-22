const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Question = sequelize.define('Question', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    testId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'tests',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    question: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('single', 'multiple'),
        defaultValue: 'single'
    },
    points: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    order: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    tableName: 'questions',
    timestamps: true
});

module.exports = Question;
