const Discord = require("discord.js");

const { getUser } = require("../../../utils/misc.js"); 
const Command = require("../../../utils/structures/Command.js");

module.exports = class extends Command {
  constructor(bot) {
    super(bot, {
      name: "link",
      aliases: [],
      description: "Links in-game to discord.",
      usage: "<code>",
      example: "1ab8sd6",
      category: "staff",
    })
  }

  async run(message, args, bot) {
    const user = await bot.db.staff.findOne({ where: { discordID: message.author.id } })
    if (user) return message.error("Your accounts are already linked!")

    if (!args.length) return message.post("Please supply the code that you received in-game. `-link <code>`")
    if (!bot.linking[args[0]]) return message.post("That code is invalid, please try again!")

    const data = bot.linking[args[0]]

    const profile = await getUser(bot, data.user)
    await bot.db.staff.update({ discordID: message.author.id }, { where: { uuid: profile.profile.uuid }})

    delete bot.linking[args[0]]
    return message.post(`You have successfully linked your in-game account (\`${data.user}\`) to your discord account (\`${message.author.tag}\`). You may now use -profile.`)


  }
}