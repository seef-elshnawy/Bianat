'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'User',
      'Followers',
      Sequelize.ARRAY(Sequelize.STRING),
    );
    await queryInterface.addColumn(
      'User',
      'Followings',
      Sequelize.ARRAY(Sequelize.STRING),
    );
    await queryInterface.addColumn(
      'User',
      'Hobbies',
      Sequelize.ARRAY(Sequelize.STRING),
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('User', 'Follwers');
    await queryInterface.removeColumn('User', 'Followings');
    await queryInterface.removeColumn('User', 'Hobbies');
  },
};
