
module.exports = function (sequelize, Sequelize){
  const Sermon = sequelize.define('Event', {
    id: {
      type: Sequelize.mssql.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    eventTitle: Sequelize.STRING(200),
    eventPreacher: Sequelize.STRING(150),
    eventDesc: Sequelize.STRING(300),
    eventFileName: Sequelize.STRING(200),
    eventVenue: Sequelize.STRING(200),
    eventType: {
      type: Sequelize.INTEGER(11)
    },
    eventDate: {
      type: Sequelize.DATE,
      defaultValue: new Date()
    },
  });

  return Sermon;
}