const Sequelize = require('sequelize');
const sequelize = require('../database/database');

const User = sequelize.define('User', {
  id: {
    type: Sequelize.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: Sequelize.STRING(30),
    allowNull: false,
	unique: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  }
});

module.exports = User;
