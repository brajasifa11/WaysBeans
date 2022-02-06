'use strict';
const {
  Model
} = require('sequelize');
const { hashPass } = require('../src/helpers/bcrypt');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Chart, {
        as: 'userChart',
        foreignKey: {
          name: 'userId',
        },
      });
    };
  };
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    fullname: DataTypes.STRING,
    role: DataTypes.STRING,
  }, {
    hooks: {
      beforeCreate(user) {
        user.password = hashPass(user.password)
        if (!user.role) {
          user.role = 'User'
        };
      },
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};
