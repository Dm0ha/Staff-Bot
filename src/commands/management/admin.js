const Discord = require("discord.js");
const fs = require("fs");

const { banPlayer, getLoginInformation, getUser } = require("../../../utils/misc.js");
const Command = require("../../../utils/structures/Command.js");

const options = [
  "`•` activityCheck <user>",
  "`•` setNick <nick>",
  "`•` forceLink <ign> <discord>",
  "`•` unlink <ign>",
  "`•` ban <user> <note>"
]

module.exports = class extends Command {
  constructor(bot) {
    super(bot, {
      name: "admin",
      aliases: [],
      description: "Access admin partitions.",
      usage: "<args..>",
      example: "activityCheck",
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
    if (!args.length || !args[0]) return message.error(`Options:\n${options.join("\n")}`)
    bot.mc.chat("/reconnect")

    switch (args[0].toLowerCase() || "") {
      case "archive":
      	if (!args[1]) return message.post("You have not specified a user to archive.")

        var user = await getUser(bot, args[1])
        if (!user) return message.post("This user is not logged as a staff member.")

        await bot.db.staff.destroy({ where: { uuid: user.profile.uuid }})
        return message.post(`Successfully archived \`${user.name}'s\` staff profile.`)
            
      case "activitycheck":
        if (!args[1]) return message.post("You have not supplied a user to check.")

        var activity = await getLoginInformation(bot, args[1])
        const embed = new Discord.MessageEmbed().setColor(message.member.displayHexColor)

        embed.setAuthor(`${args[1]}'s Activity`, bot.user.displayAvatarURL())
        embed.addFields(
          { name: `Login History`, value: activity.history },
          { name: `Activity`, value: activity.active }
        )

        return message.post(embed)

      case "setnick":
        return message.error("no fuck off")
        if (!args[1]) return message.error("Define what Gaine should nick as upon logging in.")

        const config = JSON.parse(fs.readFileSync("./config/config.json"));
        config["in-game"].nick = args[1]

        bot.mc.chat(`/nick ${args[1]}`)
        fs.writeFileSync("./config/config.json", JSON.stringify(config, null, 2))

        return message.post(`Successfully updated Gaine's nick to \`${args[1]}\`, it will automatically update.`)

      case "forcelink":
        if (!args[1] || !args[2]) return message.error("Invalid arguments! Usage: `-admin forcelink <ign> <discord>`")

        var user = await getUser(bot, args[1])
        if (!user) return message.error("You did not specify a valid member of staff.")
        if (user.profile.discordID) return message.error("The user you have specified has already linked their accounts.")

        var discord = message.mentions.members.first() || await messsage.guild.members.fetch(args[2])
        if (!discord) return message.error("You did not specify a valid discord.")

        await bot.db.staff.update({ discordID: discord.id }, { where: { uuid: user.profile.uuid } })

        return message.post(`Successfully force linked account \`${user.name}\` to discord \`${discord.user.tag}\``)


      case "unlink":
        if (!args[1]) return message.error("Invalid arguments! Usage: `-admin unlink <ign>`")

        var user = await getUser(bot, args[1])
        if (!user) return message.error("You did not specify a valid member of staff.")
        if (!user.profile.discordID) return message.error("The user you have specified has not linked their accounts.")

        await bot.db.staff.update({ discordID: null }, { where: { discordID: user.profile.discordID } })

        return message.post(`Successfully unlinked account discord <@${user.profile.discordID}> from account \`${user.name}\``)

      case "ban":
        if (!args[1] || !args[2]) return message.error("Invalid arguments! Usage: `-admin ban <user> <note(s)>`")

        const player = await bot.wrappers.mojang.Player(args[1])
        if (player.exists == false) return message.error("You did not specify a valid player.")

        bot.mc.chat("/reconnect")

        setTimeout(async () => {
            console.log(player);
          await banPlayer(bot, player.data.player.username, { content: args.slice(2).join(" "), author: message.author.tag })
        }, 200)

        return message.post(`Successfully executed \`ban\` on player **${player.data.player.username}** with \`${args.slice(2).join(" ")}\` as the reason.`)

      default:
        return message.error(`Options:\n\n${options.join("\n")}`)
    }
  }
}