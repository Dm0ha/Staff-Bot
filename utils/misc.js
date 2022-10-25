const fs = require("fs");

const isDateInMonth = require("./isDateInMonth.js");

const prettify = s => s.replace(/_/g, " ").replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.substr(1).toLowerCase());

const fixDate = (date) => {
  return Number(date.toString().replace(".0", ""))
}

const removeColors = (text) => {
  var newString = "";
  for (var i = 0; i < text.length; i++) {
    if (text[i] != "§" && text[i - 1] != undefined && text[i - 1] != "§") newString += text[i]
  }
  return newString;
}

const compileJsonExtra = (chatMessage) => {
  var newString = "";
  if (chatMessage.extra == null) {
      return newString
  }
  for (var i = 0; i < chatMessage.extra.length; i++) {
    newString += chatMessage.extra[i].text
  }
  return newString
}

const getUser = async (bot, name) => {
  if (name == undefined) return false
    
  const user = await bot.wrappers.mojang.Player(name)
  if (!user || user.exists == false) {
      console.log("RETURNED NULL 2: " + name);
      return false
  }

  var profile = await bot.db.staff.findOne({ where: { uuid: user.formattedUuid } })
  var logs = await bot.db.logs.findAll({ where: { bannedBy: user.formattedUuid } })

  if (profile == null || profile == undefined) {
      console.log("RETURNED NULL 3: " + name);
      return false
  }
  console.log("[DEBUG: getUser] " + name + " - " + user.data.player.username)
  return { name: user.data.player.username, profile: profile, logs: logs }
}

const track = async (mcBot, index, array, bot) => {
  var user = await getUser(bot, array[index]?.uuid)
  if (!user) setTimeout(() => track(mcBot, index + 1, array, bot), 1500)
    
  if (!bot.logged.includes(user.name)) {
    mcBot.chat("/reconnect")
    mcBot.chat(`/track ${user.name}`)
    bot.logged.push(user.name)
  }
  if ((index < array.length - 1) || (bot.logged.length < array.length)) {
    setTimeout(() => track(mcBot, index + 1, array, bot), 1500)
  }
  // console.log(`Array Length: ${bot.logged.length}/${array.length}\nLast Item: ${bot.logged[bot.logged.length -1]}`)
}

const writeData = async (array, index, bot, message) => {
  const data = JSON.parse(fs.readFileSync("./config/data.json"))

  const object = array[index]
  const profile = await getUser(bot, object.uuid)
  const activity = await getLoginInformation(bot, profile.name)

  data[profile.name] = {
    "totalPunishments": profile.profile.bans + profile.profile.mutes + profile.profile.warns,
    "monthlyPunishments": profile.logs.filter(r => isDateInMonth(fixDate(r.time))).length,
    "weekActivity": `${activity.raw}`
  }
  fs.writeFileSync("./config/data.json", JSON.stringify(data, null, 2))

  if (index >= array.length - 1) {
    message.channel.send({ content: `Successfully completed activity fetch ${message.author.toString()}, data can be found below.`, files: ["./config/data.json"] })
    return setTimeout(() => fs.writeFileSync("./config/data.json", JSON.stringify({}, null, 2)), 1500)
  }
  return setTimeout(async () => await writeData(array, ++index, bot, message), 1500)
}

const banPlayer = async (bot, player, note) => {
  bot.mc.chat(`/punish ${player}`)

  const punish = await new Promise(resolve => {
    bot.mc.on("windowOpen", (window) => {
      console.log(window.title)

      setTimeout(() => {
        setTimeout(() => bot.mc.clickWindow(24, 0, 0), 150)
        setTimeout(() => bot.mc.clickWindow(22, 0, 0), 150)
        setTimeout(() => bot.mc.clickWindow(16, 0, 0), 150)
        setTimeout(() => bot.mc.clickWindow(22, 0, 0), 200)
      }, 200)
    })
    resolve({ success: true })
  })
  setTimeout(() => {
    bot.mc.chat(`/ae n l ${note.author}: ${note.content}`)
  }, 2500)

  return punish;
}

const getLoginInformation = async (bot, username) => {
  bot.mc.chat("/activity " + username)

  const activity = await new Promise(resolve => {
    bot.mc.on("windowOpen", (window) => {
      var history, activity
      if (!window.title.includes("Activity")) return;

      history = window.slots[29].nbt.value.display.value.Lore.value.value
      activity = window.slots[31].nbt.value.display.value.Lore.value.value
      var raw = []

      var activityText = [];
      activity.forEach(e => {
        var text = removeColors(e)
        var splitter = text.split(": ")
        if (splitter[0].includes("This week")) raw.push(splitter[1].trim())

        activityText.push({ name: splitter[0], value: splitter[1] })
      })

      var historyText = [];
      history.forEach(h => {
        var text = removeColors(h)
        if (!text.startsWith("Click")) {
          var splitter = text.split(": ")
          historyText.push({ name: splitter[0], value: splitter[1] })
        }
      })

      resolve([historyText, activityText, raw])
    })
  })

  var history = "";
  var active = "";
  activity[0].forEach(h => history += `\`•\` ${h.name}: **${h.value}**\n`)
  activity[1].forEach(a => active += `\`•\` ${a.name}: **${a.value}**\n`)

  return { history, active, raw: activity[2] };
}

module.exports = {
  prettify,
  removeColors,
  compileJsonExtra,
  getUser,
  getLoginInformation,
  track,
  fixDate,
  writeData,
  banPlayer
}