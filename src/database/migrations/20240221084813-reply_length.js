'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'Tweets',
      'retweet_counter',
      Sequelize.INTEGER,
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Tweets', 'retweet_counter');
  },
};
