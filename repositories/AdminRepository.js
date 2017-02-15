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

	return db.Agent.findAll({where: {RoleId: 2}})
	.then(function(list){
		return list;
	})
	.catch(function(err) {
		throw err;
	})

}

repo.getAgentSales = function(agentId) {
	console.log(agentId);
	return db.Agent.findById(agentId)
	.then(function(agent){
		return db.Order.findAll({where: {AgentId: agentId}})
		.then(function(list) {
			return {list: list, agent: agent};
		})
		.catch(function(err) {
			throw err
		})		
	})
	.catch(function(err){
		throw err;
	})

}

repo.getOrderItems = function(orderId) {
	return db.OrderItem.findAll({where: {OrderId: orderId}})
	.then(function(items){
		return items;	
	})
	.catch(function(err){
		throw err;
	})

}


module.exports = repo;