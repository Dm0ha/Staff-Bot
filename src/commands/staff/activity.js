const Discord = require("discord.js");
const fs = require("fs");

const { writeData, getUser, getLoginInformation } = require("../../../utils/misc.js");
const Command = require("../../../utils/structures/Command.js");

module.exports = class extends Command {
  constructor(bot) {
    super(bot, {
      name: "activity",
      aliases: [],
      description: "Checks user activity.",
      usage: "<user>",
      example: "Dmoha",
      category: "staff",
    })
  }

  async run(message, args, bot) {
    if (!args.length) return message.post("Please specify a member to check. `-activity <user>`")

    bot.mc.chat("/reconnect")
    const embed = new Discord.MessageEmbed().setColor(message.member.displayHexColor)

    setTimeout(async () => {
      if (args[0].toLowerCase() == "fetch" && message.member.roles.cache.some(r => ["Senior Moderator", "Manager", "Admin", "Owner", "Developer"].includes(r.name))) {
        const staff = await bot.db.staff.findAll()

        message.post(`Retrieving activity results.. Estimated time to completion is \`${staff.length + Math.floor((staff.length / 1.5))}\` seconds.`)
        return await writeData(staff, 0, bot, message)
      } else {
        const user = await getUser(bot, args[0])
        if (!user) return message.post("That user is not logged as a staff member.")

        var activity = await getLoginInformation(bot, user.name)

        embed.setAuthor(`${user.name}'s Activity`, bot.user.displayAvatarURL())
        embed.addFields(
          { name: `Login History`, value: activity.history },
          { name: `Activity`, value: activity.active }
        )

        return message.post(embed)
      }
    }, 500)
  }
}