'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING 
    },
    jobCents: {
      type: DataTypes.STRING 
    },
    publicKey: {
      type: DataTypes.STRING
    },
    privateKey: {
      type: DataTypes.STRING
    },
    otpKey: {
      type: DataTypes.STRING
    },
    otpExp: {
      type: DataTypes.INTEGER
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};