const Discord = require("discord.js");
const fs = require("fs");

const Command = require("../../../utils/structures/Command.js");

module.exports = class extends Command {
  constructor(bot) {
    super(bot, {
      name: "addbans",
      aliases: [],
      description: "lol",
      usage: "",
      example: "",
      category: "management",
      access: [
        "808177389758447646", // owner
        "808177875013730317" // admin
      ]
    })
  }
	async run(message, args, bot) {
        const repetitions = message.content.split(" ")[1]
        console.log(repetitions)
        for (let i = 0; i < repetitions; i++) {
  			await bot.db.logs.create({ name: 'RealPlayer', bannedBy: '27b54924-26d0-4f3b-9ae2-2f0db17029d4', time: Date.now(), type: "ban"})
		}
	}
}