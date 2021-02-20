
module.exports = function (sequelize, Sequelize){
  const AdminUser = sequelize.define('AdminUser', {
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
    isActive: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    isAdmin: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    activationId: Sequelize.STRING(300)
  });

  return AdminUser;
}