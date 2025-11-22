'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'role', {
      type: Sequelize.ENUM('user', 'admin'),
      defaultValue: 'user',
      allowNull: false
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'role');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_users_role";');
  }
};
