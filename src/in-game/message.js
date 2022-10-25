const { removeColors, getUser, compileJsonExtra } = require("../../utils/misc.js");

module.exports = async (mcBot, bot, jsonMsg, position) => {

  const textLine = compileJsonExtra(jsonMsg)
  if (textLine.includes("Levri") && !textLine.includes("- [")) return;
  if (textLine.includes("e") && !textLine.includes("- [")) {
    bot.mc.chat("/stafflist")
  }
  // console.log(textLine)

  if (textLine.startsWith("From")) {
    const username = textLine.split(":")[0].split("From ")[1]
    const content = textLine.split(": ")[1]
		
    if (content.startsWith("-link")) {
      setTimeout(async () => {
        const user = await getUser(bot, username)

        if (!user) return mcBot.chat(`/msg ${username} You are not staff, and cannot use this system.`)
        if (user.profile?.discordID) return mcBot.chat(`/msg ${username} Your accounts are already linked!`)
  
        const code = Math.random().toString(36).substring(7);
        
        bot.linking[code] = { user: username, code: code }
        mcBot.chat(`/msg ${username} Your verification code is "${code}", please do -link <code> in discord.`)
      }, 250)
    }
  }

  if (textLine.startsWith("Successfully connected to")) {
    return bot.currentServer = textLine.split("to ")[1]
  }

  if (textLine.startsWith("Tracker Alert: ") && !textLine.includes("started") && !textLine.includes("queue") && !textLine.includes("technique")
     && !textLine.includes("QUEUE")) {
    let user = textLine.split(": ")[1].split(" has")[0]
    const userInfo = await getUser(bot, user)
    mcBot.chat("/reconnect")

    if (!userInfo.profile.loginTracker || user == "dmomo") return bot.bridgeChannel.send(textLine.includes("has left") ? `> **[LOG]** ${user} has disconnected.` : `> **[LOG]** ${user} has connected.`);

    setTimeout(() => {
       mcBot.chat(textLine.includes("has left") ? `#>>> [LOG] ${user} has disconnected. <<<` : `#>>> [LOG] ${user} has connected. <<<`)
       bot.bridgeChannel.send(textLine.includes("has left") ? `> **[LOG]** ${user} has disconnected.` : `> **[LOG]** ${user} has connected.`);
    }, 500)
    return;
  }

  else if (textLine.startsWith("Staff > ")) {
    let user = textLine.split("] ")[1].split(": ")[0]
    let rank = textLine.split("[")[1].split("]")[0]
    let content = textLine.split(": ")[1]
    
    if (content.length < 1) return;
    return bot.bridgeChannel.send({ content: `**[${rank}]** ${user}: ${content}`, allowedMentions: { users: [], roles: [] }})
  }

  else if (textLine.includes("WARN > ")) {
    const staffMember = textLine.split("by ")[1].split(" for")[0]
    const staffUUID = await bot.wrappers.mojang.Player(staffMember)
    const user = textLine.split("WARN > ")[1].split(" by")[0]

    if (!staffMember || staffMember.length > 16 || staffMember == "@ANTICHEAT") return;
    else {
      if (!await getUser(bot, staffMember)) {
        await bot.db.staff.create({ uuid: staffUUID.formattedUuid, bans: 0, mutes: 0, warns: 0 })
        const user = await bot.users.fetch("213878039107469313")
        user.send(`Added ${staffMember} to the staff database.`)
      }
      const staffProfile = await bot.db.staff.findOne({ where: { uuid: staffUUID.formattedUuid }})
      staffProfile.increment("warns")

      await bot.db.logs.create({ name: user, bannedBy: staffUUID.formattedUuid, time: Date.now(), type: "warn"})
    }
    return bot.punishmentsChannel.send({ content: `> **WARN**: ${textLine.split("> ")[1]}`, allowedMentions: { users: [], roles: [] }})
  }
    
  else if (textLine.includes("BAN > ")) {
    const staffMember = textLine.split("by ")[1].split(" for")[0]
    const staffUUID = await bot.wrappers.mojang.Player(staffMember)
    const user = textLine.split("BAN > ")[1].split(" by")[0]

    if (!staffMember || staffMember.length > 16) return;
    else if (staffMember == "@ANTICHEAT") {
        return mcBot.chat(`/pu ${user}`);
    }

    else {
      if (!await getUser(bot, staffMember)) {
        await bot.db.staff.create({ uuid: staffUUID.formattedUuid, bans: 0, mutes: 0, warns: 0 })
        const user = await bot.users.fetch("213878039107469313")
        user.send(`Added ${staffMember} to the staff database.`)
      }
      const staffProfile = await bot.db.staff.findOne({ where: { uuid: staffUUID.formattedUuid }})
      staffProfile.increment("bans")

      await bot.db.logs.create({ name: user, bannedBy: staffUUID.formattedUuid, time: Date.now(), type: "ban"})
    }
    return bot.punishmentsChannel.send({ content: `> **BAN**: ${textLine.split("> ")[1]}`, allowedMentions: { users: [], roles: [] }})
  }

  else if (textLine.includes("MUTE > ")) {
    const staffMember = textLine.split("by ")[1].split(" for")[0]
    const staffUUID = await bot.wrappers.mojang.Player(staffMember)
    const user = textLine.split("MUTE > ")[1].split(" by")[0]
    
    if (!staffMember || staffMember.length > 16 || staffMember == "@ANTICHEAT") return;
    else {
      if (!await getUser(bot, staffMember)) {
        await bot.db.staff.create({ uuid: staffUUID.formattedUuid, bans: 0, mutes: 0, warns: 0 })
        const user = await bot.users.fetch("213878039107469313")
        user.send(`Added ${staffMember} to the staff database.`)
      }
      const staffProfile = await bot.db.staff.findOne({ where: { uuid: staffUUID.formattedUuid }})
      staffProfile.increment("mutes")

      await bot.db.logs.create({ name: user, bannedBy: staffUUID.formattedUuid, time: Date.now(), type: "mute"})
    }
    return bot.punishmentsChannel.send({ content: `> **MUTE**: ${textLine.split("> ")[1]}`, allowedMentions: { users: [], roles: [] }})
  } 
  
  else if (textLine.includes("has reported")) {
    const reporter = textLine.split(" has reported")[0]
    const offender = textLine.split("reported ")[1].split(" (")[0]
    const reason = textLine.split(" for ")[1]

    return bot.reportsChannel.send({ content: `> **REPORT**: **${reporter}** has reported **${offender}** for \`${reason.trim()}\``, allowedMentions: { users: [], roles: [] }})
  }

  else if (textLine.startsWith("- [")) {
    const now = new Date()
    if (now - bot.lastStaffCheck > 100) {
      bot.staffList = [];
    }
    staffName = textLine.replace("- ", "")
    if (!bot.staffList.includes(staffName) && !staffName.includes("Levri")) {
      bot.staffList.push(staffName)
    }
    bot.lastStaffCheck = new Date()
  }
}