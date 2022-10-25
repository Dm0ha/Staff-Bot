const mineflayer = require("mineflayer");

const { credentials } = require("../../config/config.json");
const getFiles = require("../../utils/getFiles");

module.exports = async (mcBot, bot) => {

  setTimeout(async () => {
    mcBot = mineflayer.createBot({
      host: credentials.server,
      port: 25565,
      username: credentials.minecraft.email,
      password: credentials.minecraft.password,
      version: "1.8.8",
      auth: "microsoft"
    })
    bot.mc = mcBot;
    bot.logged = [];
  
    // const user = await bot.users.fetch("676876290078277634")
    // setTimeout(() => user.send(`**${new Date().toLocaleDateString()} @ ${new Date().toLocaleTimeString()}** - I have been disconnected from the server, reconnecting...`), 3000)
  
    getFiles("./src/in-game")
      .filter(file => file.endsWith(".js"))
      .forEach(file => {
        file = file.replace("\\", "/")
        const event = require(`../../${file}`)
        mcBot.on(file.split("/").pop().split(".")[0], event.bind(null, mcBot, bot))
        console.log("Loading " + file)
      })
  }, 20000)
}