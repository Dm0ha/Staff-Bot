const Discord = require("discord.js");

const { getUser } = require("../../../utils/misc.js");
const Command = require("../../../utils/structures/Command.js");

const options = [
  "`•` loginTracking <on, off, status>"
]

module.exports = class extends Command {
  constructor(bot) {
    super(bot, {
      name: "preferences",
      aliases: ["prefs"],
      description: "Staff preferences.",
      usage: "<option> <value>",
      example: "loginTracking on",
      category: "staff"
    })
  }

  async run(message, args, bot) {
    const user = await bot.db.staff.findOne({ where: { discordID: message.author.id } })
    if (!user) return message.error("You have not linked your discord & in-game accounts, see `-check` for information.")

    if (!args.length) return message.error(`Options:\n${options.join("\n")}`)

    switch (args[0].toLowerCase()) {
      case "logintracking":
        if (!args[1]) return message.error("Invalid arguments! Usage: `-admin loginTracking <on, off, status>`")

        if (args[1].toLowerCase() == "status") {
          const data = await bot.db.staff.findOne({ where: { discordID: message.author.id } })
          return message.post(`Your tracking status: \`${data.loginTracker == true ? "enabled" : "disabled"}\``)
        }

        await bot.db.staff.update({ loginTracker: args[1].toLowerCase() == "off" ? false : true }, { where: { uuid: user.uuid } })

        return message.post(`You have successfully \`${args[1] == "off" ? `disabled` : `enabled`}\` your login tracking.`)
    }


  }
}