const Discord = require("discord.js");
const fetch = require('node-fetch')

const { credentials } = require("../../../config/config.json");
const Command = require("../../../utils/structures/Command.js");

module.exports = class extends Command {
  constructor(bot) {
    super(bot, {
      name: "staff",
      aliases: [],
      description: "Displays currently online staff members.",
      usage: "",
      example: "",
      category: "staff"
    })
  }

  async run(message, args, bot) {
    bot.mc.chat("/reconnect")
    
    const body = await (await fetch(`https://api.mcsrvstat.us/2/${credentials.server}`)).json()
    if (body.online == false) {
      return message.post("Bedwars Practice is currently offline.")
    }
    
    // const staff = await new Promise(resolve => {
    //   const now = new Date()
    //   let online = [];
    //   bot.mc.on("message", (jsonMsg, position) => {
    //     if (!eventActive) return false;
    //     const newDate = new Date();
    //     if (position == "system" && jsonMsg["text"]) online.push(jsonMsg.text)
    //     if ((newDate - now) >= 300) {
    //         eventActive = false;
    //         resolve(online.filter(m => m.startsWith("§7- ") && !m.includes(bot.mc.username)).map(m => {
    //           const [rank, username] = m.replace(/\]|\[|- |§0|§1|§2|§3|§4|§5|§6|§7|§8|§9|§a|§b|§c|§d|§e|§f|§r|§l|§o|§n|§m|§k/g, '').split(" ")
    //           return { rank, username }
    //       }))
    //     }

    //   })
    // })

    try {
      const staffFormatted = "`•` " + bot.staffList.join("\n`•` ").replaceAll("[","**[").replaceAll("]","]**")
      const embed = new Discord.MessageEmbed()
        .setAuthor(`Online Staff [${bot.staffList.length}]`, bot.user.displayAvatarURL())
        .setDescription(bot.staffList.length > 0 ? staffFormatted : `No staff are currently online.`)
        .setColor(message.member.displayHexColor)
        .setFooter(`There are ${body?.players?.online?.toLocaleString() || "N/A"} players online.`)

      await message.post(embed)
      return setTimeout(() => bot.staffActive = false, 10000)
      
    } catch (e) {
      console.log(e)
    }

  }
}