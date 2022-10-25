const Sequelize = require("sequelize");

const { database } = require("../sql.js");

const tags = database.define('tags', {
  name: { type: Sequelize.STRING, unique: true },
  description: Sequelize.TEXT,
  createdBy: { type: Sequelize.STRING },
  usages: { type: Sequelize.INTEGER, defaultValue: 0, allowNull: false }
})

module.exports = {
  tags
};