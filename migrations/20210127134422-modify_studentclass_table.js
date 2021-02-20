'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn("StudentClasses", 
      "UserId",
      {
        type: Sequelize.STRING(150),
        allowNull: false
      }
    )
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("StudentClasses","UserId")
  }
};
