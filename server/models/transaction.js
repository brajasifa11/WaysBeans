'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaction.belongsTo(models.User, {
        as: 'buyer',
        foreignKey: {
          name: 'userId',
        },
      });
      Transaction.hasMany(models.Order, {
        as: 'TransactionOrder',
        foreignKey: {
          name: 'transactionId',
        },
      });
    };
  };
  Transaction.init({
    userId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    date: DataTypes.STRING,
    attachment: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate(transaction) {
        transaction.status = 'Waiting Approve'
      }
    },
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};