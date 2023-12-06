// sequelize.js

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('my tainer', 'postgres', '246761', {
  host: 'localhost',
  dialect: 'postgres',
});

module.exports = sequelize;
