'use strict';


module.exports = function(db, DataTypes) {
  var Role = db.define('Role', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    label: DataTypes.STRING
  }, {
    tableName: 'roles',
    classMethods: {
      associate: function(models) {
        Role.hasMany(models.Agent);
      }
    },
    hooks: {
    }
  });

  return Role;
};