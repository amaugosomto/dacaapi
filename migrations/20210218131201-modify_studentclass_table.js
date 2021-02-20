'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn("StudentClasses", 
        "QuizId", 
        {
          type: Sequelize.INTEGER(11),
          allowNull: true
        }
      ),
      queryInterface.addColumn("studentclasses", 'hasTakenQuiz', {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      })
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn("StudentClasses", "QuizId",
        {
          type: Sequelize.INTEGER(11),
          allowNull: false
        }
      ),
      queryInterface.removeColumn("studentclasses", 'hasTakenQuiz')
    ]) 
  }
};
