'use strict';

var instanceMethods = {
	getFormattedPrice: function() {
		return this.currency + this.price;
	}
}

// var beforeSaveHook = function(product, options, fn) {
// 	if(product.changed('sizes')){

// 	}
// 	return fn(null, product)
// }

module.exports = function(db, DataTypes) {
  var Product = db.define('Product', {
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
    title: {
    	type: DataTypes.STRING,
    	allowNull: false
    },
    currency: DataTypes.STRING,
    sizeS: DataTypes.INTEGER,
    sizeM: DataTypes.INTEGER,
    sizeL: DataTypes.INTEGER,
    sizeXL: DataTypes.INTEGER,
    sizeXLL: DataTypes.INTEGER
  },{
    tableName: 'products',
    instanceMethods: instanceMethods,
    classMethods: {
   },
    hooks: {
    },
    indexes: [
      {
        name: 'productky',
        method: 'BTREE',
        fields: ['id']
      },
      {
        name: 'productpriceky',
        method: 'BTREE',
        fields: ['price']
      }      
    ]
  });

  return Product;
};