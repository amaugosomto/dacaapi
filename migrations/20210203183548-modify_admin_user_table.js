'use strict';


module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn("AdminUsers", 
      "isAdmin",
      {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }
    )
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("AdminUsers","isAdmin")
  }
};

