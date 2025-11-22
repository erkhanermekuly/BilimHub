'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_progress', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
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
      testNumber: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      isCompleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      test1Score: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      test2Score: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      attempts: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      completedAt: {
        type: Sequelize.DATE,
        allowNull: true
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
    await queryInterface.dropTable('user_progress');
  }
};
