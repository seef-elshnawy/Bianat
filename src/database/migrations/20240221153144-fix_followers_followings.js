'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addColumn('User', 'Followers', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      defaultValue: [],
      allowNull: false,
    });
    queryInterface.addColumn('User', 'Followings', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      defaultValue: [],
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeColumn('User', 'Followers');
    queryInterface.removeColumn('User', 'Followings');
  },
};
