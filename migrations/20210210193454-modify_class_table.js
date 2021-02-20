'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn("Classes", 
      "imageName",
      {
        type: Sequelize.STRING(200),
        defaultValue: ""
      }
    )
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("Classes", "imageName")
  }
};
