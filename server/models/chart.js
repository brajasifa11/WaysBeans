'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Chart.belongsTo(models.User, {
        as: 'userChart',
        foreignKey: {
          name: 'userId',
        },
      });
      Chart.belongsTo(models.Product, {
        as: 'productChart',
        foreignKey: {
          name: 'productId',
        },
      });
    };
  };
  Chart.init({
    userId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    qty: DataTypes.INTEGER,
    date: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Chart',
  });
  return Chart;
};