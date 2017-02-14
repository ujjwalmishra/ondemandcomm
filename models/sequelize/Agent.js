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

var beforeSaveHook = function(agent, options, fn) {
  if(agent.changed('password')) {
    this.encryptPassword(agent.password, function(hash, err) {
      agent.password = hash;
      fn(null, agent);
    });
    return;
  }
  fn(null, agent);
};

module.exports = function(db, DataTypes) {
  var Agent = db.define('Agent', {
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
    tableName: 'agents',
    instanceMethods: instanceMethods,
    classMethods: {
      associate: function(models) {
        Agent.hasMany(models.Order);
        Agent.belongsTo(models.Role);
      },
      encryptPassword: function(password, cb) {
        if (!password) {
          cb('', null);
          return;
        }

        bcrypt.genSalt(10, function(err, salt) {
          if (err) { cb(null, err); return; }
          bcrypt.hash(password, salt, null, function(hErr, hash) {
            if (hErr) { cb(null, hErr); return; }
            cb(hash, null);
          });
        });
      },
      findAgent: function(email, password, cb) {
        Agent.findOne({
          where: { email: email }
        })
        .then(function(agent) {
          if(agent == null || agent.password == null || agent.password.length === 0) {
            cb('Agent / Password combination is not correct', null);
            return;
          }
          if(agent.RoleId == 2){
            bcrypt.compare(password, agent.password, function(err, res) {
              if(res)
                cb(null, agent);
              else
                cb(err, null);
            });            
          }
          else {
            if(agent.password == password) {
                cb(null, agent);
            }
            else {
                var err = new Error('bad login');
                cb( err, null);
            }
          }

        })
        .catch(function(serr) { cb(serr, null); });
      }
    },
    hooks: {
      beforeUpdate: beforeSaveHook,
      beforeCreate: beforeSaveHook
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