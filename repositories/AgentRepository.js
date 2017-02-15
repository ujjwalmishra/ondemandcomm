'use strict';

var db = require('../models/sequelize');
var repo = {};

repo.changeProfileData = function(agentId, reqBody) {
  return db.Agent.findById(agentId)
    .then(function(agent) {
      agent.email = reqBody.email || '';
      agent.profile.name = reqBody.name || '';
      agent.profile.gender = reqBody.gender || '';
      agent.profile.location = reqBody.location || '';
      agent.profile.website = reqBody.website || '';
      agent.set('profile', agent.profile);

      if(agent.changed('email')) {
        return db.Agent.count({ where: { email: agent.email } })
          .then(function(c) {
            if(c > 0)
              throw 'Cannot change e-mail address, because address ' + agent.email + ' already exists';

            return agent.save();
          });
      }
      return agent.save();
    });
};

module.exports = repo;