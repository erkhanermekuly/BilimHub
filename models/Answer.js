const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Answer = sequelize.define('Answer', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    questionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'questions',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    answer: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    isCorrect: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    order: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    tableName: 'answers',
    timestamps: true
});

module.exports = Answer;
