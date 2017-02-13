'use strict';

var db = require('../models/sequelize');
var repo = {};

repo.createAgent = function(agent) {

	return db.Agent.count({where: {email: agent.email}})
	.then(function(c){
		if(c > 0) {
			throw 'Agent already exist with the email'
		}

		var dbAgent = db.Agent.build(agent);

		dbAgent.set('tokens', {});
        dbAgent.set('profile', {});

		return dbAgent.save();
	}
	)		

}

repo.getAgents = function(adminId) {

	return db.Agent.findAll({where: {adminId: adminId}})
	.then(function(list){
		return list;
	})
	.catch(function(err) {
		throw err;
	})

}

module.exports = repo;