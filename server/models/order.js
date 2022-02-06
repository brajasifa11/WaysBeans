'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.Transaction, {
        as: 'TransactionOrder',
        foreignKey: {
          name: 'transactionId',
        },
      });
      Order.belongsTo(models.Product, {
        as: 'ProductOrder',
        foreignKey: {
          name: 'productId',
        },
      });
    };
  };
  Order.init({
    transactionId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    qty: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};