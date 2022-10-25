const Discord = require("discord.js");

const isDateInDay = require("../../../utils/isDateInDay.js");
const isDateInMonth = require("../../../utils/isDateInMonth.js");
const isDateInWeek = require("../../../utils/isDateInWeek.js");
const { getUser, fixDate } = require("../../../utils/misc.js");

const Command = require("../../../utils/structures/Command.js");

module.exports = class extends Command {
  constructor(bot) {
    super(bot, {
      name: "leaderboard",
      aliases: ["lb", "points"],
      description: "Displays a leaderboard of staff points.",
      usage: "<tickets, monthly, all>",
      example: "tickets monthly",
      category: "staff"
    })
  }

  async run(message, args, bot) {
    var limit = 25
    const data = await bot.db.staff.findAll()
    const tickets = await bot.db.tickets.findAll();
    const points = {}

    const embed = new Discord.MessageEmbed()
      .setColor(message.member.displayHexColor)

    switch (args[0] || "") {
      case "tickets":
        switch (args[1] || "") {
          case "monthly":
            await new Promise(async resolve => {
              const members = await message.guild.members.fetch()
              var counter = 1;
              tickets.forEach(async t => {
                if (members.find(m => m.id == t.staffID)) {
                  if (!points[t.staffID]) points[t.staffID] = { "user": members.find(m => m.id == t.staffID), "tickets": tickets.filter(a => isDateInMonth(a.updatedAt) && !a.active && a.staffID == t.staffID).length }
                };
                if (++counter >= tickets.length) resolve()
              })
            })

            embed.setAuthor(`Leaderboard [MONTHLY TICKETS]`, bot.user.displayAvatarURL())
            embed.setDescription(Object.keys(points).sort((a, b) => points[b].tickets - points[a].tickets).splice(0, limit).map((p, index) => `\`#${++index}\` ${Discord.escapeMarkdown(points[p].user.user.username) || "N/A"}: **${points[p].tickets.toLocaleString()}**`).join("\n"))
            embed.setFooter(`Tickets Total: ${Object.values(points).reduce((x, y) => x + (y.tickets), 0).toLocaleString()}`)

            return message.post(embed)

          case "weekly":
            await new Promise(async resolve => {
              const members = await message.guild.members.fetch()
              var counter = 1;
              tickets.forEach(async t => {
                if (members.find(m => m.id == t.staffID)) {
                  if (!points[t.staffID]) points[t.staffID] = { "user": members.find(m => m.id == t.staffID), "tickets": tickets.filter(a => isDateInWeek(a.updatedAt) && !a.active && a.staffID == t.staffID).length }
                };
                if (++counter >= tickets.length) resolve()
              })
            })

            embed.setAuthor(`Leaderboard [WEEKLY TICKETS]`, bot.user.displayAvatarURL())
            embed.setDescription(Object.keys(points).sort((a, b) => points[b].tickets - points[a].tickets).splice(0, limit).map((p, index) => `\`#${++index}\` ${Discord.escapeMarkdown(points[p].user.user.username) || "N/A"}: **${points[p].tickets.toLocaleString()}**`).join("\n"))
            embed.setFooter(`Tickets Total: ${Object.values(points).reduce((x, y) => x + (y.tickets), 0).toLocaleString()}`)

            return message.post(embed)

          case "daily":
            await new Promise(async resolve => {
              const members = await message.guild.members.fetch()
              var counter = 1;
              tickets.forEach(async t => {
                if (members.find(m => m.id == t.staffID)) {
                  if (!points[t.staffID]) points[t.staffID] = { "user": members.find(m => m.id == t.staffID), "tickets": tickets.filter(a => isDateInDay(a.updatedAt) && !a.active && a.staffID == t.staffID).length }
                };
                if (++counter >= tickets.length) resolve()
              })
            })

            embed.setAuthor(`Leaderboard [DAILY TICKETS]`, bot.user.displayAvatarURL())
            embed.setDescription(Object.keys(points).sort((a, b) => points[b].tickets - points[a].tickets).splice(0, limit).map((p, index) => `\`#${++index}\` ${Discord.escapeMarkdown(points[p].user.user.username) || "N/A"}: **${points[p].tickets.toLocaleString()}**`).join("\n"))
            embed.setFooter(`Tickets Total: ${Object.values(points).reduce((x, y) => x + (y.tickets), 0).toLocaleString()}`)

            return message.post(embed)

          default:
            await new Promise(async resolve => {
              const members = await message.guild.members.fetch()
              var counter = 1;
              tickets.forEach(async t => {
                if (members.find(m => m.id == t.staffID)) {
                  if (!points[t.staffID]) points[t.staffID] = { "user": members.find(m => m.id == t.staffID), "tickets": tickets.filter(a => !a.active && a.staffID == t.staffID).length }
                };
                if (++counter >= tickets.length) resolve()
              })
            })

            embed.setAuthor(`Leaderboard [TICKETS]`, bot.user.displayAvatarURL())
            embed.setDescription(Object.keys(points).sort((a, b) => points[b].tickets - points[a].tickets).splice(0, limit).map((p, index) => `\`#${++index}\` ${Discord.escapeMarkdown(points[p].user.user.username) || "N/A"}: **${points[p].tickets.toLocaleString()}**`).join("\n"))
            embed.setFooter(`Tickets Total: ${Object.values(points).reduce((x, y) => x + (y.tickets), 0).toLocaleString()}`)

            return message.post(embed)
        }

      case "daily":
        await new Promise(resolve => {
          var failed = 1;
          data.forEach(async s => {
            var staffMember = await getUser(bot, s.uuid)
            if (staffMember) {
              points[staffMember.name] = { "daily": Array.from(staffMember.logs).filter(r => isDateInDay(fixDate(r.time))).length }
              if ((Object.keys(points).length + failed) >= data.length) resolve()
            } else {
              failed += 1
              if ((Object.keys(points).length + failed) >= data.length) resolve()
            }
          })
        })

        embed.setAuthor(`Leaderboard [DAILY LOGS]`, bot.user.displayAvatarURL())
        embed.setDescription(Object.keys(points).sort((a, b) => points[b].daily - points[a].daily).splice(0, limit).map((p, index) => `\`#${++index}\` ${p}: **${points[p].daily.toLocaleString()}**`).join("\n"))
        embed.setFooter(`Daily Total: ${Object.values(points).reduce((x, y) => x + (y.daily), 0).toLocaleString()}`)

        return message.post(embed)

      case "weekly":
        await new Promise(resolve => {
          var failed = 1;
          data.forEach(async s => {
            var staffMember = await getUser(bot, s.uuid)
            if (staffMember) {
              points[staffMember.name] = { "weekly": Array.from(staffMember.logs).filter(r => isDateInWeek(fixDate(r.time))).length }
              if ((Object.keys(points).length + failed) >= data.length) resolve()
            } else {
              failed += 1;
              if ((Object.keys(points).length + failed) >= data.length) resolve()
            }
          })
        })

        embed.setAuthor(`Leaderboard [WEEKLY LOGS]`, bot.user.displayAvatarURL())
        embed.setDescription(Object.keys(points).sort((a, b) => points[b].weekly - points[a].weekly).splice(0, limit).map((p, index) => `\`#${++index}\` ${p}: **${points[p].weekly.toLocaleString()}**`).join("\n"))
        embed.setFooter(`Weekly Total: ${Object.values(points).reduce((x, y) => x + (y.weekly), 0).toLocaleString()}`)

        return message.post(embed)

      case "monthly":
        await new Promise(resolve => {
          var failed = 1;
          data.forEach(async s => {
            var staffMember = await getUser(bot, s.uuid)
            if (staffMember) {
              points[staffMember.name] = { "monthly": Array.from(staffMember.logs).filter(r => isDateInMonth(fixDate(r.time))).length }
              if ((Object.keys(points).length + failed) >= data.length) resolve()
            } else {
              failed += 1
              if ((Object.keys(points).length + failed) >= data.length) resolve()
            }
          })
        })

        embed.setAuthor(`Leaderboard [MONTHLY LOGS]`, bot.user.displayAvatarURL())
        embed.setDescription(Object.keys(points).sort((a, b) => points[b].monthly - points[a].monthly).splice(0, limit).map((p, index) => `\`#${++index}\` ${p}: **${points[p].monthly.toLocaleString()}**`).join("\n"))
        embed.setFooter(`Monthly Total: ${Object.values(points).reduce((x, y) => x + (y.monthly), 0).toLocaleString()}`)

        return message.post(embed)

      case "warns":
        await new Promise(resolve => {
          var failed = 1;
          data.forEach(async s => {
            var staffMember = await getUser(bot, s.uuid)
            if (staffMember) {
              points[staffMember.name] = { "warns": staffMember.profile.warns }
              if ((Object.keys(points).length + failed) >= data.length) resolve()
            } else {
              failed += 1;
              if ((Object.keys(points).length + failed) >= data.length) resolve()
            }
          })
        })

        embed.setAuthor(`Leaderboard [WARNS]`, bot.user.displayAvatarURL())
        embed.setDescription(Object.keys(points).sort((a, b) => points[b].warns - points[a].warns).splice(0, limit).map((p, index) => `\`#${++index}\` ${p}: **${points[p].warns.toLocaleString()}**`).join("\n"))
        embed.setFooter(`Total Warns: ${data.reduce((x, y) => x + (y.warns), 0).toLocaleString()}`)

        return message.post(embed)

      case "reports":
        await new Promise(resolve => {
          var failed = 1;
          data.forEach(async s => {
            var staffMember = await getUser(bot, s.uuid)
            if (staffMember) {
              points[staffMember.name] = { "reports": staffMember.profile.reports }
              if ((Object.keys(points).length + failed) >= data.length) resolve()
            } else {
              failed += 1
              if ((Object.keys(points).length + failed) >= data.length) resolve()
            }
          })
        })

        embed.setAuthor(`Leaderboard [REPORTS]`, bot.user.displayAvatarURL())
        embed.setDescription(Object.keys(points).sort((a, b) => points[b].reports - points[a].reports).splice(0, limit).map((p, index) => `\`#${++index}\` ${p}: **${points[p].reports.toLocaleString()}**`).join("\n"))
        embed.setFooter(`Total Reports Completed: ${data.reduce((x, y) => x + (y.reports), 0).toLocaleString()}`)

        return message.post(embed)

      case "bans":
        await new Promise(resolve => {
          var failed = 1;
          data.forEach(async s => {
            var staffMember = await getUser(bot, s.uuid)
            if (staffMember) {
              points[staffMember.name] = { "bans": staffMember.profile.bans }
              console.log(Object.keys(points).length + " - failed: " + failed + " > data length: " + data.length)
              if ((Object.keys(points).length + failed) >= data.length) resolve()
            } else {
              failed += 1
              if ((Object.keys(points).length + failed) >= data.length) resolve()
            }
          })
        })

        embed.setAuthor(`Leaderboard [BANS]`, bot.user.displayAvatarURL())
        embed.setDescription(Object.keys(points).sort((a, b) => points[b].bans - points[a].bans).splice(0, limit).map((p, index) => `\`#${++index}\` ${p}: **${points[p].bans.toLocaleString()}**`).join("\n"))
        embed.setFooter(`Total Bans: ${data.reduce((x, y) => x + (y.bans), 0).toLocaleString()}`)

        return message.post(embed)

      case "mutes":
        await new Promise(resolve => {
          var failed = 1;
          data.forEach(async s => {
            var staffMember = await getUser(bot, s.uuid)
            if (staffMember) {
              points[staffMember.name] = { "mutes": staffMember.profile.mutes }
              if ((Object.keys(points).length + failed) >= data.length) resolve()
            } else {
              failed += 1
              if ((Object.keys(points).length + failed) >= data.length) resolve()
            }
          })
        })

        embed.setAuthor(`Leaderboard [MUTES]`, bot.user.displayAvatarURL())
        embed.setDescription(Object.keys(points).sort((a, b) => points[b].mutes - points[a].mutes).splice(0, limit).map((p, index) => `\`#${++index}\` ${p}: **${points[p].mutes.toLocaleString()}**`).join("\n"))
        embed.setFooter(`Total Mutes: ${Object.values(points).reduce((x, y) => x + (y.mutes), 0).toLocaleString()}`)

        return message.post(embed)


      default:
        await new Promise(resolve => {
          var failed = 1;
          data.forEach(async s => {
            var staffMember = await getUser(bot, s.uuid)
            if (staffMember) {
              points[staffMember.name] = { "total": staffMember.profile.bans + staffMember.profile.mutes + staffMember.profile.warns }
            	if ((Object.keys(points).length + failed) >= data.length) resolve()
            } else {
              failed += 1
              if ((Object.keys(points).length + failed) >= data.length) resolve()
            }
          })
        })

        embed.setAuthor(`Leaderboard [TOTAL]`, bot.user.displayAvatarURL())
        embed.setDescription(Object.keys(points).sort((a, b) => points[b].total - points[a].total).splice(0, limit).map((p, index) => `\`#${++index}\` ${p}: **${points[p].total.toLocaleString()}**`).join("\n"))
        embed.setFooter(`Total Punishments: ${Object.values(points).reduce((x, y) => x + (y.total), 0).toLocaleString()}`)

        return message.post(embed)
    }
  }
}