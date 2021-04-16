const { Command } = require("discord.js-commando");
const Discord = require("discord.js");
const fetch = require("node-fetch");

const { SendFilter } = require("./filterFuntion");

module.exports = class GlassCommand extends (
  Command
) {
  constructor(bot) {
    super(bot, {
      name: "smoke",
      group: "images",
      memberName: "smoke",
      guildOnly: true,
      format: `[image url or @user]`,
      aliases: ["glass"],
      description: "adds smoke filter to image",
      examples: [
        `.smoke https://assets.bonappetit.com/photos/5c62e4a3e81bbf522a9579ce/1:1/w_2560%2Cc_limit/milk-bread.jpg`,
        `.smoke <@${process.env.WINSTON}>`,
      ],
      throttling: {
        usages: 1,
        duration: 5,
      },
    });
  }

  async run(message, args) {
    
    SendFilter(message, args, "Glass", "#c8c8c8");
  }
};
