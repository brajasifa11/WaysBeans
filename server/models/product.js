'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.hasMany(models.Chart, {
        as: 'productChart',
        foreignKey: {
          name: 'productId',
        },
      });
      Product.hasMany(models.Order, {
        as: 'ProductOrder',
        foreignKey: {
          name: 'productId',
        },
      });
    };
  };
  Product.init({
    name: DataTypes.STRING,
    price: DataTypes.STRING,
    description: DataTypes.STRING,
    stock: DataTypes.STRING,
    photo: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};