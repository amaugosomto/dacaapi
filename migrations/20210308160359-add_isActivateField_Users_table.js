'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn("Users", 'isActivated', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("Users", 'isActivated')
  }
};
