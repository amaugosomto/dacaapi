
module.exports = function (sequelize, Sequelize){
  const AdvancedClassesOrder = sequelize.define('AdvancedClassesOrder', {
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

  return AdvancedClassesOrder;
}