
module.exports = function (sequelize, Sequelize){
  const Class = sequelize.define('Class', {
    id: {
      type: Sequelize.mssql.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    classBody: Sequelize.STRING(65535),
    isApproved: { 
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    imageName: { 
      type: Sequelize.STRING(200),
      defaultValue: ''
    },
    description: { 
      type: Sequelize.STRING(1000),
      defaultValue: ''
    },
    ClassTypeId: {
      type: Sequelize.INTEGER(11),
      allowNull: false
    },
    classTitle: Sequelize.STRING(150),
    tutor: Sequelize.STRING(150),
  });

  Class.associate = models => {
    Class.hasMany(models.Quiz, {foreignKey: 'ClassId', onDelete: 'cascade'});
    Class.belongsTo(models.ClassType, {foreignKey: 'ClassTypeId'});
  }

  return Class;
}