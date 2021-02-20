
module.exports = function (sequelize, Sequelize){
  const StudentClass = sequelize.define('StudentClass', {
    id: {
      type: Sequelize.mssql.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    ClassId: {
      type: Sequelize.INTEGER(11),
      allowNull: false
    },
    quizScore: {
      type: Sequelize.INTEGER(11)
    },
    QuizId: {
      type: Sequelize.INTEGER(11),
      allowNull: false
    },
    UserId: {
      type: Sequelize.INTEGER(11),
      allowNull: false
    },
    hasTakenQuiz: {
      type: Sequelize.INTEGER(11),
      allowNull: true
    },
    numberCorrectAnswers: {
      type: Sequelize.INTEGER(11),
      allowNull: true,
    }
  });

  StudentClass.associate = models => {
    StudentClass.belongsTo(models.User, {
      foreignKey: {
        allowNull: false,
        foreignKey: 'UserId'
      }
    });
    StudentClass.belongsTo(models.Class, {
      foreignKey: {
        allowNull: false,
        foreignKey: 'ClassId'
      }
    });
    StudentClass.belongsTo(models.Quiz, {
      foreignKey: {
        allowNull: false,
        foreignKey: 'QuizId'
      }
    });
  }

  return StudentClass;
}