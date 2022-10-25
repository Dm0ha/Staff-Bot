const Discord = require("discord.js");

const { removeColors } = require("../../../utils/misc.js");
const Command = require("../../../utils/structures/Command.js");

module.exports = class extends Command {
  constructor(bot) {
    super(bot, {
      name: "setrole",
      aliases: [],
      description: "Updates a staff members role in-game.",
      usage: "<user> <rank>",
      example: "Dmoha owner",
      category: "management",
      access: [
        "808178034854985748",
        "808177875013730317",
        "808177945000542228"
      ]
    })
  }

  async run(message, args, bot) {
    if (!args.length || !args[0]) return message.post("You need to specify a member to update their in-game roles.")
    if (!args[1]) return message.post("You need to specify a role to apply to this user in-game.")

    if (["tc6", "marikisgod", "levri", "yunglol", "sh0rts", "dmoha", "cownecromancer"].includes(args[0].toLowerCase())) {
        if (message.author.id != "213878039107469313") {
            return message.post("You are unable to update this users' roles.")
        }
    }

    bot.mc.chat("/reconnect")
    setTimeout(async () => {
      bot.mc.chat(`/setrole ${args[0]} ${args[1]}`)

      const response = await new Promise(resolve => {
        bot.mc.on("message", (jsonMsg, position) => {
          if (jsonMsg["extra"] && (jsonMsg.extra[0].text.includes("Successfully set") || jsonMsg.extra[0].text.includes("manager"))) resolve(jsonMsg.extra[0].text)
        })
      })

      return message.post(response)
    }, 500)
  }
}