const Discord = require("discord.js");

const { getUser, fixDate } = require("../../../utils/misc.js");
const Command = require("../../../utils/structures/Command.js");

module.exports = class extends Command {
  constructor(bot) {
    super(bot, {
      name: "recents",
      aliases: ["recent", "history"],
      description: "Returns a staff members recent punishments.",
      usage: "<user>",
      example: "Dmoha",
      category: "staff"
    })
  }

  async run(message, args, bot) {
    if (!args.length || !args[0]) return message.post("Please specify a member to check. `-recents <user>`")
    
    const user = await getUser(bot, args[0])
    if (!user) return message.post(`This user is not logged as a staff member.`)

    const mapped = user.logs.reverse().splice(0, 30)
      .map((r, index) => {
        const name = Discord.escapeMarkdown(r.name)
        const date = new Date(fixDate(r.time))
        
        return `\`#${index + 1}\` **${name}**: ${date.getMonth() + 1}/${date.getDate()}** -> **${date.toLocaleTimeString("en-GB", { hour12: false })} (\`${r.type.toUpperCase()}\`)`
      }).join("\n")

    const embed = new Discord.MessageEmbed()
      .setAuthor(`${user.name}'s Recents [PUNISHMENTS]`, bot.user.displayAvatarURL())
      .setDescription(mapped || "N/A")
      .setColor(message.member.displayHexColor)
    
    return message.post(embed)

  }
}