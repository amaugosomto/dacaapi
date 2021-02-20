'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("Classes", 
        "tutor",
        {
          type: Sequelize.STRING(150)
        }
      ),
      queryInterface.addColumn("Classes", 
        "classTitle",
        {
          type: Sequelize.STRING(150)
        }
      )
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("Classes","tutor"),
      queryInterface.removeColumn("Classes", "classTitle")
    ])
  }
};
