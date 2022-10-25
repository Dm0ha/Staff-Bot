const { developers, prefix } = require("../../config/config.json");

module.exports = async (bot, message) => {

  if (message.channel.type !== 'text') return;
  message.prefix = prefix

  if (!message.content.toLowerCase().startsWith(message.prefix.toLowerCase())) {
    if (message.channel.id == "830519698159566878" && !message.author.bot) {
      bot.mc.chat("/reconnect")
        
	  if (message.author.id == "213878039107469313" && message.content.startsWith("?")) {
          message.delete().catch(err => err)
          setTimeout(async () => {
            return bot.mc.chat(`#${message.content.split("\n")[0].substring(1, 75)}`)
          }, 500)
      }
      else {
          setTimeout(async () => {
        	return bot.mc.chat(`#[DISCORD] ${message.author.username}: ${message.content.split("\n")[0].substring(0, 75)}`)
          }, 500)
      }
    }
    return;
  };

  if (message.author.bot) return;

  const args = message.content.slice(message.prefix.length).split(/ +/);
  const commandName = args.shift().toLocaleLowerCase();
  const command = bot.commands.get(commandName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return;
  if (command.access.length && !message.member.roles.cache.some(r => command.access.includes(r.id)) && !developers.includes(message.author.id) && !message.member.permissions.has("ADMINISTRATOR")) {
    return message.error(`This command is restricted from your current role.`)
  }
  if (command.devOnly && !developers.includes(message.author.id)) return message.error(`This command requires you to be the bot developer.`);

   if (bot.cat && command.name != "eval") return message.channel.send("Catstaboli has disabled the bot.")
    
  await command.run(message, args, bot).catch(err => console.log(err));
  console.log(`[CMD] (#${message.channel.name}) ${message.author.tag}: ${message.content}`)
}