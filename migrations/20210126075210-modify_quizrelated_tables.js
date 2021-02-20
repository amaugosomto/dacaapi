'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("Quizzes", 
        "ClassId",
        {
          type: Sequelize.INTEGER(11),
          allowNull: false
        }
      ),
      queryInterface.addColumn("StudentClasses", 
        "ClassId",
        {
          type: Sequelize.INTEGER(11),
          allowNull: false
        }
      ),
      queryInterface.addColumn("StudentClasses", 
        "quizScore",
        {
          type: Sequelize.INTEGER(11)
        }
      ),
      queryInterface.addColumn("StudentClasses", 
        "QuizId",
        {
          type: Sequelize.INTEGER(11),
          allowNull: false
        }
      ),
      queryInterface.addColumn("QuizAnswers", 
        "QuizId",
        {
          type: Sequelize.INTEGER(11),
          allowNull: false
        }
      )
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("Quizzes", "ClassId"),
      queryInterface.removeColumn("StudentClasses", "ClassId"),
      queryInterface.removeColumn("StudentClasses", "quizScore"),
      queryInterface.removeColumn("StudentClasses", "QuizId"),
      queryInterface.removeColumn("QuizAnswers", "QuizId")
    ]);
  }
};
