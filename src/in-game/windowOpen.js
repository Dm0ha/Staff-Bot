const { removeColors, getUser } = require("../../utils/misc.js");

module.exports = async (mcBot, bot, window) => {
  if (!removeColors(window.title).includes("Punish") && !removeColors(window.title).includes("Viewing")) return;

  setTimeout(() => {
    if (window.slots[22] && removeColors(window.title).includes("Punish")) {
      const ban = window.slots[22]?.nbt.value.display.value.Lore.value.value
      if (ban[7].includes("Notes") && ban[7].includes("For")) {
          const player = removeColors(window.title).split("Punish ")[1].split('"')[0];
          const notes = ban[7]?.split("For ")[1]
          return bot.anticheatPunishmentsChannel.send({ content: `> **BAN**: ${player} by @ANTICHEAT for ${notes}`, allowedMentions: { users: [], roles: [] }})
      if (!ban[7].includes("Evidence")) return;
      if (removeColors(ban[7]?.split("Evidence: ")[1]) == '1') return;  
      }
    }

    setTimeout(() => bot.mc.clickWindow(22, 0, 0), 500)
    setTimeout(() => bot.mc.clickWindow(20, 0, 0), 500)

    setTimeout(async () => {
      if (window.slots[10] == null) return;

      const data = window.slots[10]
      const staffMember = data?.nbt.value.display.value.Lore.value.value[0].split("by ")[1]

      const staffUUID = await bot.wrappers.mojang.Player(staffMember)

      if (!await getUser(bot, staffMember)) {
        await bot.db.staff.create({ uuid: staffUUID.formattedUuid, bans: 0, mutes: 0, warns: 0 })
        const user = await bot.users.fetch("213878039107469313")
        user.send(`Added ${staffMember} to the staff database.`)
      }
      const staffProfile = await bot.db.staff.findOne({ where: { uuid: staffUUID.formattedUuid } })
      staffProfile.increment("bans")
        
	  //await bot.db.logs.create({ name: player, bannedBy: staffUUID.formattedUuid, time: Date.now(), type: "ban"})
      console.log(`Logged /cm ban for user; ${staffMember}, hopefully..`)
    }, 2300)

  }, 1500)
}