'use strict';


module.exports = function(db, DataTypes) {
  var Chat_Pair = db.define('Chat_Pair', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    userLine: DataTypes.TEXT,
    agentLine: DataTypes.TEXT,
  }, {
    tableName: 'chat_pair',
    classMethods: {
      associate: function(models) {
        Chat_Pair.belongsTo(models.Agent, {foreignKey: 'agentId'});
        Chat_Pair.belongsTo(models.User, {foreignKey: 'userId'});
      }
    },
    indexes: [
      {
        name: 'userPairIdIndex',
        method: 'BTREE',
        fields: ['UserId']
      },
      {
        name: 'agentPairIdIndex',
        method: 'BTREE',
        fields: ['AgentId']
      }      
    ]
  });

  return Chat_Pair;
};

