
module.exports = function (sequelize, Sequelize){
  const User = sequelize.define('User', {
    id: {
      type: Sequelize.mssql.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    firstName: Sequelize.STRING(50),
    lastName: Sequelize.STRING(50),
    email: Sequelize.STRING(50),
    password: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    activationId: Sequelize.STRING(300)
  });

  User.associate = models => {
    User.hasMany(models.StudentClass);
  }

  return User;
}