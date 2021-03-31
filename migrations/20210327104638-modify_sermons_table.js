'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn("Sermons", 'category', {
      type: Sequelize.STRING(200),
      defaultValue: '',
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("Sermons", 'category')
  }
};
