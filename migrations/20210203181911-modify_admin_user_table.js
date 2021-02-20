'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn("AdminUsers", 
      "isActive",
      {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }
    )
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("AdminUsers","isActive")
  }
};
