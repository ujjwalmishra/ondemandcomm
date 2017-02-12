'use strict';



module.exports = function(db, DataTypes) {
  var Agent = db.define('Agent', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      isEmail: true
    },
    profile: DataTypes.JSON,
    tokens: DataTypes.JSON
  }, {
    tableName: 'agents',
    classMethods: {
      associate: function(models) {
        Agent.hasMany(models.Chat_Session);
      }
    },
    hooks: {
    },
    indexes: [
      {
        name: 'primaryky',
        method: 'BTREE',
        fields: ['id']
      }
    ]
  });

  return Agent;
};