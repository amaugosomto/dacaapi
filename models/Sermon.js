
module.exports = function (sequelize, Sequelize){
  const Sermon = sequelize.define('Sermon', {
    id: {
      type: Sequelize.mssql.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    sermonTitle: Sequelize.STRING(200),
    sermonPreacher: Sequelize.STRING(150),
    sermonDesc: Sequelize.STRING(300),
    sermonFileName: Sequelize.STRING(200),
    duration: {
      type: Sequelize.INTEGER(11),
      defaultValue: 0
    },
    category: {
      type: Sequelize.STRING(200),
      defaultValue: ''
    },
  });

  return Sermon;
}