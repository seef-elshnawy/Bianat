'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.removeColumn('Hashtags', 'tweetId');
  },

  async down(queryInterface, Sequelize) {
    queryInterface.addColumn('Hashtag', 'tweetId', {
      type: Sequelize.STRING,
    });
  },
};
