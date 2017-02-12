'use strict';

module.exports = function(db, DataTypes) {
  var OrderItem = db.define('OrderItem', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    price:{
    	type: DataTypes.FLOAT,
    	allowNull: false
    },
    discount: {
    	type: DataTypes.INTEGER
    },    
    quantity: DataTypes.INTEGER || 0,
    description: DataTypes.STRING(1234),
    currency: DataTypes.STRING,
    size: DataTypes.STRING
  },{
    tableName: 'orderitem',
    classMethods: {
      associate: function(models) {
        OrderItem.belongsTo(models.Order);
        OrderItem.belongsTo(models.User);
        OrderItem.belongsTo(models.Product);
      }
   },
    hooks: {
    },
    indexes: [
      {
        name: 'orderlineky',
        method: 'BTREE',
        fields: ['id']
      }    
    ]
  });

  return OrderItem;
};