
module.exports = function (sequelize, Sequelize){
  const ClassType = sequelize.define('ClassType', {
    id: {
      type: Sequelize.mssql.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    classType: Sequelize.STRING(50)
  });

  ClassType.associate = models => {
    ClassType.hasMany(models.Class);
  }

  return ClassType;
}