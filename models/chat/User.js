'use strict';




module.exports = function(db, DataTypes) {
  var User = db.define('User', {
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
    tableName: 'users',
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Chat_Session);
      }
    },
    hooks: {
    },
    indexes: [

    ]
  });

  return User;
};