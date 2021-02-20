'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn("studentclasses", 'numberCorrectAnswers', {
      type: Sequelize.INTEGER(11),
      allowNull: true,
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("studentclasses", 'numberCorrectAnswers')
  }
};
