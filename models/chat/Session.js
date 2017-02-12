'use strict';


module.exports = function(db, DataTypes) {
  var Chat_Session = db.define('Chat_Session', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    }
  }, {
    tableName: 'chat_session',
    classMethods: {
      associate: function(models) {
        Chat_Session.belongsTo(models.Agent, {foreignKey: 'agentId'});
        Chat_Session.belongsTo(models.User, {foreignKey: 'userId'});
      }
    },
    indexes: [
      {
        name: 'userSessionIdIndex',
        method: 'BTREE',
        fields: ['UserId']
      },
      {
        name: 'agentSessionIdIndex',
        method: 'BTREE',
        fields: ['AgentId']
      }      
    ]
  });

  return Chat_Session;
};

