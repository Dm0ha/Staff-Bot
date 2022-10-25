const Sequelize = require("sequelize");

const { database } = require("../sql.js");

const logs = database.define('logs', {
  name: { type: Sequelize.STRING },
  bannedBy: { type: Sequelize.STRING },
  time: { type: Sequelize.STRING },
  type: { type: Sequelize.STRING }
})

module.exports = {
  logs
};