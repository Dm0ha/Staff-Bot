const Sequelize = require("sequelize");

const { database, ticketDatabase } = require("../../utils/database/sql.js");
const { tags } = require("../../utils/database/models/tags.js");
const { staff }= require("../../utils/database/models/staff.js");
const { logs }= require("../../utils/database/models/logs.js");
const tickets = require("../../utils/database/models/tickets.js");

const Mojang = require("../../utils/wrappers/Mojang.js");

module.exports = async (bot) => {
  console.log("Successfully launched.")

  bot.bridgeChannel = bot.channels.cache.get(`830519698159566878`)
  bot.punishmentsChannel = bot.channels.cache.get(`839515767410262096`)
  bot.anticheatPunishmentsChannel = bot.channels.cache.get(`912098966726922300`)
  bot.reportsChannel = bot.channels.cache.get(`839515778965307422`)
  bot.logsChannel = bot.channels.cache.get(`860667881079832586`)
  bot.staffList = [];
  bot.lastStaffCheck = new Date()

  tags.sync()
  logs.sync()
  staff.sync()
  tickets.sync()

  bot.db = {
    import: Sequelize,
    databases: {
      main: database,
      tickets: ticketDatabase
    },
    staff: staff,
    logs: logs,
    tags: tags,
    tickets: tickets
  }

  bot.wrappers = {
    mojang: new Mojang()
  }

  const loggedStaff = await bot.db.staff.findAll();
  bot.user.setPresence({ activities: [{ name: `${loggedStaff.length} staff members.`, type: "WATCHING" }], status: "dnd" })
}