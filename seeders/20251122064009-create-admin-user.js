'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('admin12345', 10);
    
    await queryInterface.bulkInsert('users', [{
      name: 'Администратор',
      email: 'admin@gmail.com',
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', {
      email: 'admin@gmail.com'
    }, {});
  }
};
