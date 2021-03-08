'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable("StudentResponses", {
      id: {
        type: Sequelize.mssql.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      ClassId:  {
        type: Sequelize.INTEGER(11),
        allowNull: false
      },
      UserId:  {
        type: Sequelize.INTEGER(11),
        allowNull: false
      },
      quizCorrectAns: Sequelize.STRING(10),
      userAnswer: Sequelize.STRING(10),
      QuizId:  {
        type: Sequelize.INTEGER(11),
        allowNull: false
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable("StudentResponses");
  }
};
