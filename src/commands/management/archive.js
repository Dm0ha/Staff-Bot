const Discord = require("discord.js");

const { getUser } = require("../../../utils/misc");
const Command = require("../../../utils/structures/Command.js");

module.exports = class extends Command {
  constructor(bot) {
    super(bot, {
      name: "archive",
      aliases: [],
      description: "Archive staff profiles",
      usage: "<user>",
      example: "Dmoha",
      category: "management",
      access: [
        "808178034854985748", // srmod
        "808177945000542228", // manager
        "808177389758447646", // owner
        "808177875013730317" // admin
      ]
    })
  }

  async run(message, args, bot) {
    return message.post("Unable to execute command. Please use `-admin` to perform this action.")
  }
}