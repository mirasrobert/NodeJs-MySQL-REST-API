const Sequelize = require('sequelize');
const sequelize = require('../database/database');

const Article = sequelize.define('Article', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.BIGINT
  },
  user_id: {
    type: Sequelize.BIGINT,
    references: { model: 'users', key: 'id' }
  },
  title: {
    type: Sequelize.STRING
  },
  body: {
    type: Sequelize.STRING
  }
});

module.exports = Article;
