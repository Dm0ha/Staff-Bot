const Discord = require("discord.js");

const Command = require("../../../utils/structures/Command.js");

module.exports = class extends Command {
  constructor(bot) {
    super(bot, {
      name: "tags",
      aliases: ["tag", "note", "notes"],
      description: "Tags command.",
      usage: "<get | update | delete | list> <args..>",
      example: "get ban-evading",
      category: "general"
    })
  }

  async run(message, args, bot) {
    switch (args[0]?.toLowerCase() || "") {
      case "add":
        if (!args[1]) return message.post("You have not supplied an `identifier` for a tag.")
        if (!args[2]) return message.post("You have not supplied a `description` for this tag.")

        try {
          const tag = await bot.db.tags.create({
            name: args[1],
            description: args.slice(2).join(" "),
            createdBy: message.author.id
          })
          return message.post(`Successfully saved tag with identifier \`${tag.name}\` to the database.`)
        } catch (e) {
          if (e.name === 'SequelizeUniqueConstraintError') {
            return message.post('A tag with that identifier already exists, please try another tag.');
          }
          return;
        }

      case "get":
        if (!args[1]) return message.post("You have not supplied an `identifier` to retrieve a tag.")

        var tag = await bot.db.tags.findAll({ where: { name: bot.db.import.where(bot.db.import.fn("LOWER", bot.db.import.col("name")), 'LIKE', '%' + args[1] + '%') }})
        if (!tag.length) return message.post(`No tags could be found with \`${args[1]}\` identifier.`)

        if (tag.length > 1 && !tag.some(t => t.name.toLowerCase() == args[1].toLowerCase())) {
          var embed = new Discord.MessageEmbed()
            .setAuthor(`Multiple results found..`, bot.user.displayAvatarURL())
            .setDescription(tag.map((i, index) => `\`#${index +1}\`: ${i.name} - *${i.usages} usages.*`).join("\n"))
            .setColor(message.member.displayHexColor)
          return message.post(embed)
        }

        if (tag.some(t => t.name.toLowerCase() == args[1].toLowerCase())) var tag = tag.find(t => t.name.toLowerCase() == args[1].toLowerCase())
        else tag = tag[0]

        tag.increment("usages")
        const createdDate = `${new Date(tag.createdAt).getMonth() + 1}/${new Date(tag.createdAt).getDay() + 1} - ${new Date(tag.createdAt).toLocaleTimeString()}`
        const updatedDate = `${new Date(tag.createdAt).getMonth() + 1}/${new Date(tag.updatedAt).getDay() + 1} - ${new Date(tag.updatedAt).toLocaleTimeString()}`

        var embed = new Discord.MessageEmbed()
          .setAuthor(`${tag.name} [ID: #${tag.id}]`, bot.user.displayAvatarURL())
          .setDescription(`Author: **${message.guild.members.cache.get(tag.createdBy) ? message.guild.members.cache.get(tag.createdBy).displayName : "Unavailable"}**\nCreated: \`${createdDate}\`\nUpdated: \`${updatedDate}\``)
          .addFields({ name: `Description`, value: tag.description })
          .setFooter(`This tag has been used ${tag.usages} times.`)
          .setColor(message.member.displayHexColor)

        return message.post(embed)

      case "update":
        if (!args[1]) return message.post("You have not supplied an `identifier` to update a tag.")
        if (!args[2]) return message.post("You have not supplied a **new** `description` for this tag.")

        var tag = await bot.db.tags.findAll({ where: { name: bot.db.import.where(bot.db.import.fn("LOWER", bot.db.import.col("name")), 'LIKE', '%' + args[1] + '%') }})
        if (!tag.length) return message.post(`No tags could be found with \`${args[1]}\` identifier.`)

        if (tag.length > 1 && !tag.some(t => t.name.toLowerCase() == args[1].toLowerCase())) {
          var embed = new Discord.MessageEmbed()
            .setAuthor(`Multiple results found..`, bot.user.displayAvatarURL())
            .setDescription(tag.map((i, index) => `\`#${index +1}\`: ${i.name} - *${i.usages} usages.*`).join("\n"))
            .setColor(message.member.displayHexColor)
          return message.post(embed)
        }

        if (tag.some(t => t.name.toLowerCase() == args[1].toLowerCase())) var tag = tag.find(t => t.name.toLowerCase() == args[1].toLowerCase())
        else tag = tag[0]

        await bot.db.tags.update({ description: args.slice(2).join(" ") }, { where: { name: tag.name }})
        return message.post(`Successfully updated tag \`${tag.name}\` with a new description.`)

      case "delete":
        if (!args[1]) return message.post("You have not supplied an `identifier` to update a tag.")

        var tag = await bot.db.tags.findAll({ where: { name: bot.db.import.where(bot.db.import.fn("LOWER", bot.db.import.col("name")), 'LIKE', '%' + args[1] + '%') }})
        if (!tag.length) return message.post(`No tags could be found with \`${args[1]}\` identifier.`)

        if (tag.length > 1 && !tag.some(t => t.name.toLowerCase() == args[1].toLowerCase())) {
          var embed = new Discord.MessageEmbed()
            .setAuthor(`Multiple results found..`, bot.user.displayAvatarURL())
            .setDescription(tag.map((i, index) => `\`#${index +1}\`: ${i.name} - *${i.usages} usages.*`).join("\n"))
            .setColor(message.member.displayHexColor)
          return message.post(embed)
        }

        if (tag.some(t => t.name.toLowerCase() == args[1].toLowerCase())) var tag = tag.find(t => t.name.toLowerCase() == args[1].toLowerCase())
        else tag = tag[0]

        await bot.db.tags.destroy({ where: { name: tag.name }})
        return message.post(`Successfully removed the \`${tag.name}\` tag from the database.`)

      case "list":
        const tags = Array.from(await bot.db.tags.findAll({ attributes: ["name", "usages"] })).map((t, index) => `\`#${index +1}\` ${t.name} - *${t.usages} usages.*`).join("\n")
        
        var embed = new Discord.MessageEmbed()
          .setAuthor(`Listing all tags..`, bot.user.displayAvatarURL())
          .setDescription(tags)
          .setColor(message.member.displayHexColor)

        return message.post(embed)

      default:
        var description = ``
        description += `\`•\` -tags add <name> <description> (Will create a tag)\n`
        description += `\`•\` -tags update <name> <new description> (Will update a tags description)\n`
        description += `\`•\` -tags get <name> (Will return information on the specified tag)\n`
        description += `\`•\` -tags list (Will list all available tags)\n`
        description += `\`•\` -tags delete <name> (Will delete a tag)\n`

        var embed = new Discord.MessageEmbed()
          .setAuthor(`Tags Help`, bot.user.displayAvatarURL())
          .setDescription(description)
          .setColor(message.member.displayHexColor)

        return message.post(embed)
    }
  }
}