const fs = require("fs");

const { track } = require("../../utils/misc.js");

module.exports = async (mcBot, bot) => {
  setTimeout(async () => {
    const data = await bot.db.staff.findAll()
    const config = JSON.parse(fs.readFileSync("./config/config.json"))

    setTimeout(() => {
      mcBot.chat(`/nick ${config["in-game"].nick} DREAM`)

      track(mcBot, bot.logged.length != 0 ? bot.logged.length - 1 : bot.logged.length, data, bot)
    }, 500)
  }, 1000)
}