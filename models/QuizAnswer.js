
module.exports = function (sequelize, Sequelize){
  const QuizAnswer = sequelize.define('QuizAnswer', {
    id: {
      type: Sequelize.mssql.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    QuizId: {
      type: Sequelize.INTEGER(11),
      allowNull: false
    },
    answerBody: Sequelize.STRING(65535),
    answerValue: Sequelize.STRING(50)
  });

  QuizAnswer.associate = models => {
    QuizAnswer.belongsTo(models.Quiz, {
      foreignKey: "QuizId",
      allowNull: false
    });
  }

  return QuizAnswer;
}