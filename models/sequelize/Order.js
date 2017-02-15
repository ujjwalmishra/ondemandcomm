'use strict';

module.exports = function(db, DataTypes) {
  var Order = db.define('Order', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    totalprice:{
    	type: DataTypes.FLOAT,
    	allowNull: false
    },
    discount: {
    	type: DataTypes.FLOAT
    },    
    totallineitems: DataTypes.INTEGER || 0,
    description: DataTypes.STRING(1234),
    currency: DataTypes.STRING
  },{
    tableName: 'orders',
    classMethods: {
      associate: function(models) {
        Order.hasMany(models.OrderItem);
        Order.belongsTo(models.User);
        Order.belongsTo(models.Agent);
      }
   },
    hooks: {
    },
    indexes: [
      {
        name: 'totalky',
        method: 'BTREE',
        fields: ['totalprice']
      },
      {
        name: 'createdky',
        method: 'BTREE',
        fields: ['createdAt']
      }      
    ]
  });

  return Order;
};