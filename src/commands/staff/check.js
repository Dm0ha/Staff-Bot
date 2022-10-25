const Discord = require("discord.js");

const { getUser, getLoginInformation, fixDate } = require("../../../utils/misc.js");
const isDateInDay = require("../../../utils/isDateInDay.js");
const isDateInWeek = require("../../../utils/isDateInWeek.js");
const isDateInMonth = require("../../../utils/isDateInMonth.js");

const Command = require("../../../utils/structures/Command.js");

module.exports = class extends Command {
  constructor(bot) {
    super(bot, {
      name: "check",
      aliases: ["profile"],
      description: "Checks a specific staff members staff profile.",
      usage: "<user>",
      example: "Dmoha",
      category: "staff"
    })
  }

  async run(message, args, bot) {
    const data = args[0] ? args[0] : await bot.db.staff.findOne({ where: { discordID: message.author.id } })
    if (!data) return message.error("User does not have their in-game account linked to their discord account!\n\n`•` Simply do `/msg Gaine -link` to start.\n`•` Grab the code and do -link <code> in discord.\n\n[SRMOD+] -admin forcelink <ign> <discord>")

    bot.mc.chat("/reconnect")

    const username = args[0] || data?.uuid
    const user = await getUser(bot, username)

    if (!user) return message.post("This user is not logged as a staff member.")
    if (!user.profile.discordID) return message.error("User does not have their in-game account linked to their discord account!\n\n`•` Simply do `/msg Gaine -link` to start.\n`•` Grab the code and do -link <code> in discord.\n\n[SRMOD+] -admin forcelink <ign> <discord>")

    setTimeout(async () => {
      const activity = await getLoginInformation(bot, user.name)

      const daily = user.logs.filter(r => isDateInDay(fixDate(r.time)))
      const weekly = user.logs.filter(r => isDateInWeek(fixDate(r.time)))
      const monthly = user.logs.filter(r => isDateInMonth(fixDate(r.time)))

      const total = user.profile.bans + user.profile.mutes + user.profile.warns
      const tickets = await bot.db.tickets.findAll();

      const mapped = user.logs.reverse().slice(0, 8)
        .map((r, index) => {
          const name = Discord.escapeMarkdown(r.name)
          const date = new Date(fixDate(r.time))
          
          return `\`#${++index}\` **${name}**: ${date.getMonth() + 1}/${date.getDate()}** -> **${date.toLocaleTimeString("en-GB", { hour12: false })} (\`${r.type.toUpperCase()}\`)`
        }).join("\n")


      const stats = {
        profile: `\`•\` Total: **${total.toLocaleString()}** (${user.profile.bans} **B** | ${user.profile.mutes} **M** | ${user.profile.warns} **W**)\n\`•\` Screenshares: **${user.profile.screenshares}**\n\`•\` Reports: **${user.profile.reports}**\n\n`,
        statistics: `\`•\` Daily: **${daily.length}**\n\`•\` Weekly: **${weekly.length}**\n\`•\` Monthly: **${monthly.length}**`
      }

      const ticketStats = {
        bugs: tickets.filter(t => t.staffID == user.profile.discordID && t.type == "bugs").length,
        general: tickets.filter(t => t.staffID == user.profile.discordID && t.type == "general").length,
        appeals: tickets.filter(t => t.staffID == user.profile.discordID && t.type == "appeals").length,
        all: tickets.filter(t => t.staffID == user.profile.discordID).length
      }

      const embed = new Discord.MessageEmbed()
        .setAuthor(`${user.name}'s Staff Profile`, bot.user.displayAvatarURL())
        .setFooter(`Last 30 punishments can be viewed using -recents <user>`)
        .setColor(message.member.displayHexColor)
        .addFields(
          { name: `Punishments`, value: stats.profile },
          { name: `Statistics`, value: stats.statistics },
          { name: `Tickets`, value: `\`•\` Total: **${ticketStats.all}** (${ticketStats.general} **G** | ${ticketStats.bugs} **B** | ${ticketStats.appeals} **A**)`},
          { name: `Activity`, value: activity.active },
          { name: `Recents`, value: `${mapped || "N/A"}` }
        )

        return message.post(embed)
    }, 250)
  }
}