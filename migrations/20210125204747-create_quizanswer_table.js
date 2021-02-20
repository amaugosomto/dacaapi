'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable("QuizAnswers", {
      id: {
        type: Sequelize.mssql.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      answerBody: Sequelize.STRING(65535),
      answerValue: Sequelize.STRING(50),
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable("QuizAnswers");
  }
};
