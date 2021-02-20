'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable("AdminUsers", {
      id: {
        type: Sequelize.mssql.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      firstName: Sequelize.STRING(50),
      lastName: Sequelize.STRING(50),
      email: Sequelize.STRING(50),
      password: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      activationId: Sequelize.STRING(300),
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable("AdminUsers");
  }
};
