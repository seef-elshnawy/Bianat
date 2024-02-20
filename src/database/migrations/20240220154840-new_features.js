'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'Tweets',
      'Tweet_Images',
      Sequelize.ARRAY(Sequelize.STRING),
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('User', 'Follwers');
    await queryInterface.removeColumn('User', 'Followings');
    await queryInterface.removeColumn('User', 'Hobbies');
    await queryInterface.removeColumn('Tweets', 'Tweet_Images');
  },
};
