// process.env.DEBUG = 'minecraft-protocol'

const Discord = require("discord.js");
const mineflayer = require("mineflayer");

const getFiles = require("./utils/getFiles.js");
const { credentials } = require("./config/config.json");

(async () => {

  const bot = new Discord.Client({ intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "GUILD_EMOJIS"] });
  const mcBot = mineflayer.createBot({
    host: credentials.server,
    username: credentials.minecraft.email,
    password: credentials.minecraft.password,
    port: 25565,
    version: "1.8.8",
    auth: "microsoft"
})

  bot.commands = new Discord.Collection();
  // bot.options.http.api = "https://discordapp.com/api"
  bot.mc = mcBot;
  bot.logged = [];
  bot.linking = []

  getFiles("./utils/extenders")
    .filter(file => file.endsWith(".js"))
    .forEach(file => {
      file = file.replace("\\", "/")
      require(`./${file}`)
      console.log("Loading " + file)
    })

  getFiles("./src/events")
    .filter(file => file.endsWith(".js"))
    .forEach(file => {
      file = file.replace("\\", "/")
      const event = require(`./${file}`)

      bot.on(file.split("/").pop().split(".")[0], event.bind(null, bot))
      console.log("Loading " + file)
    })

  getFiles("./src/in-game")
    .filter(file => file.endsWith(".js"))
    .forEach(file => {
      file = file.replace("\\", "/")
      const event = require(`./${file}`)
      mcBot.on(file.split("/").pop().split(".")[0], event.bind(null, mcBot, bot))
      console.log("Loading " + file)
    })

  getFiles("./src/commands")
    .filter(file => file.endsWith(".js"))
    .forEach(file => {
      file = file.replace("\\", "/")
      const buffer = require(`./${file}`)
      const command = new buffer(bot)
      bot.commands.set(command.name, command)
      console.log("Loading " + file)
    })

  bot.login(credentials.main);
})()