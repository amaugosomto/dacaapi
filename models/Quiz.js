
module.exports = function (sequelize, Sequelize){
  const Quiz = sequelize.define('Quiz', {
    id: {
      type: Sequelize.mssql.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    quizBody: Sequelize.STRING(65535),
    quizCorrectAns: Sequelize.STRING(50),
    ClassId: {
      type: Sequelize.INTEGER(11), 
      allowNull: false
    }
  });

  Quiz.associate = models => {
    Quiz.belongsTo(models.Class, {
      foreignKey: 'ClassId',
      as: "User"
    });
    Quiz.hasMany(models.QuizAnswer, {
      onDelete: 'casacde'
    })
  }

  return Quiz;
}