'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn("Classes", 
      "ClassTypeId",
      {
        type: Sequelize.INTEGER(11),
        allowNull: false
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("Classes", 'ClassTypeId');
  }
};
