'use strict';

var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');


var instanceMethods = {
  getGravatarUrl: function(size) {
    if (!size) size = 200;

    if (!this.email) {
      return 'https://gravatar.com/avatar/?s=' + size + '&d=retro';
    }

    var md5 = crypto.createHash('md5').update(this.email).digest('hex');
    return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=retro';
  },
  getProfilePicture: function(size) {
    if(this.profile && this.profile.picture != null)
      return this.profile.picture;

    return this.getGravatarUrl(size);
  },
  hasSetPassword: function() {
    return this.password != null && this.password.length > 0;
  }
};


module.exports = function(db, DataTypes) {
  var Admin = db.define('Admin', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    password: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    logins: DataTypes.INTEGER,
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      isEmail: true
    },
    profile: DataTypes.JSON,
    tokens: DataTypes.JSON
  }, {
    tableName: 'admins',
    instanceMethods: instanceMethods,
    classMethods: {
      associate: function(models) {
        Admin.hasMany(models.Agent);
      },
      findAdmin: function(email, password, cb) {
        Admin.findOne({
          where: { email: email, password: password }
        })
        .then(function(admin) {
          if(admin == null || admin.password == null || admin.password.length === 0) {
            cb('Admin / Password combination is not correct', null);
            return;
          }
          else {
            cb(null, admin);
          }
        })
        .catch(function(serr) { cb(serr, null); });
      }
    },
    hooks: {
    },
    indexes: [
    ]
  });

  return Admin;
};