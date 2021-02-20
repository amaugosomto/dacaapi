
module.exports = function (sequelize, Sequelize){
  const BasicClassesOrder = sequelize.define('BasicClassesOrder', {
    id: {
      type: Sequelize.mssql.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    ClassId: Sequelize.INTEGER(11),
    ClassOrder: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      defaultValue: 0
    }
  });

  return BasicClassesOrder;
}