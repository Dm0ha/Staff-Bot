const Discord = require("discord.js");

const { answers } = require("../../../config/config.json");
const Command = require("../../../utils/structures/Command.js");

module.exports = class extends Command {
  constructor(bot) {
    super(bot, {
      name: "ask",
      aliases: [],
      description: "Ask a question.",
      usage: "<question>",
      example: "Why is Yung sus?",
      category: "general"
    })
  }

  async run(message, args, bot) {
    if (!args.length || !args[0]) return message.post("Please specify a question to ask.")
    var response = answers[Math.floor(Math.random() * answers.length)]

    const embed = new Discord.MessageEmbed()
      .setAuthor(`🎱 Response`, bot.user.displayAvatarURL())
      .setDescription(`${response}`)
      .setColor(message.member.displayHexColor)

    return message.post(embed)
  }
}