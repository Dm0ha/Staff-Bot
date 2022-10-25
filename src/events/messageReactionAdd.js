const Discord = require('discord.js')
const fs = require("fs")

module.exports = async (bot, reaction, user) => {
  if (reaction.message.id == "866356047702786058") {
    reaction.users.remove(user.id)

    const member = await reaction.message.guild.members.fetch(user.id)
    const channel = await reaction.message.guild.channels.fetch("866358676059455528")

    switch (reaction._emoji.name) {
      case "🏓":
        if (member.roles.cache.some(r => ["814392682977165342"].includes(r.id))) {
          member.roles.remove("814392682977165342")
          channel.send(`\`${user.tag}\` has successfully \`removed\` their **Moderation Team** role.`)
        } else {
          member.roles.add("814392682977165342")
          channel.send(`\`${user.tag}\` has successfully \`added\` their **Moderation Team** role.`)
        }
        break;

      case "🍞":
        if (member.roles.cache.some(r => ["811387724426641418"].includes(r.id))) {
          member.roles.remove("811387724426641418")
          channel.send(`\`${user.tag}\` has successfully \`removed\` their **Break** role.`)
        } else {
          member.roles.add("811387724426641418")
          channel.send(`\`${user.tag}\` has successfully \`added\` their **Break** role.`)
        }
        break;
    }

  }

}