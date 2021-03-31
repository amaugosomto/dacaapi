'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable("Sermons", {
      id: {
        type: Sequelize.mssql.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      sermonTitle: Sequelize.STRING(200),
      sermonPreacher: Sequelize.STRING(150),
      sermonDesc: Sequelize.STRING(300),
      sermonFileName: Sequelize.STRING(200),
      duration: {
        type: Sequelize.INTEGER(11),
        defaultValue: 0
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: new Date()
      },
      updatedAt: Sequelize.DATE
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Sermons");
  }
};
