
module.exports = function (sequelize, Sequelize){
  const StudentResponse = sequelize.define('StudentResponse', {
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
  });

  StudentResponse.associate = models => {
    StudentResponse.belongsTo(models.Quiz, {
      foreignKey: "QuizId",
      allowNull: false
    });
    StudentResponse.belongsTo(models.Class, {
      foreignKey: {
        allowNull: false,
        foreignKey: 'ClassId'
      }
    });
    StudentResponse.belongsTo(models.User, {
      foreignKey: {
        allowNull: false,
        foreignKey: 'UserId'
      }
    });
  }

  return StudentResponse;
}