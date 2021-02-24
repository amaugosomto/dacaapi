'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn("classes", 'description', {
      type: Sequelize.STRING(1000),
      defaultValue: '',
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("classes", 'description')
  }
};
