'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable("Events", {
      id: {
        type: Sequelize.mssql.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      eventTitle: Sequelize.STRING(200),
      eventPreacher: Sequelize.STRING(150),
      eventDesc: Sequelize.STRING(300),
      eventFileName: Sequelize.STRING(200),
      eventVenue: Sequelize.STRING(200),
      eventType: {
        type: Sequelize.INTEGER(11)
      },
      eventDate: {
        type: Sequelize.DATE,
        defaultValue: new Date()
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: new Date()
      },
      updatedAt: Sequelize.DATE
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Events");
  }
};
