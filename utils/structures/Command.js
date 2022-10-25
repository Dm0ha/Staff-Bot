const Discord = require('discord.js');

module.exports = class {
    constructor(bot, options) {
        this.bot = bot;
        this.options = {
            name: "",
            description: "",
            aliases: null,
            devOnly: false,
            usage: "",
            example: "",
            category: "misc",
            access: [],
            ...options
        };

        Object.assign(this, this.options)
        this.name = this.options.name.toLowerCase();
        this.aliases = this.options.aliases?.map(c => c.toLowerCase());
    }
}