'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn("Classes", 
      "isApproved", {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("Classes", 'isApproved');
  }
};
