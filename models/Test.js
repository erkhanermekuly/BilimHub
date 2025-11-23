const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Test = sequelize.define('Test', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    testNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 2
        }
    },
    passingScore: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 70 
    },
    timeLimit: {
        type: DataTypes.INTEGER, 
        allowNull: true
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'tests',
    timestamps: true
});

module.exports = Test;
