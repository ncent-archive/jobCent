'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      jobCents: {
        type: Sequelize.STRING
      },
      publicKey: {
        type: Sequelize.STRING
      },
      privateKey: {
        type: Sequelize.STRING
      },
      otpKey: {
        type: Sequelize.STRING
      },
      otpExp: {
        type: Sequelize.BIGINT
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      active: {
        type:Sequelize.BOOLEAN,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};