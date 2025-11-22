'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tests', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      lectureId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'lectures',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      testNumber: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      passingScore: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 70
      },
      timeLimit: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tests');
  }
};
