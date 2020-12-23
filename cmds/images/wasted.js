const { Command } = require("discord.js-commando");
const Discord = require("discord.js");
const fetch = require("node-fetch");

const { SendFilter } = require("./filterFuntion");

module.exports = class WastedCommand extends (
  Command
) {
  constructor(bot) {
    super(bot, {
      name: "wasted",
      group: "images",
      memberName: "wasted",
      guildOnly: true,
      format: `[image url @user]`,
      description: "adds wasted filter to image",
      examples: [
        `.wasted https://assets.bonappetit.com/photos/5c62e4a3e81bbf522a9579ce/1:1/w_2560%2Cc_limit/milk-bread.jpg`,
        `.wasted <@${process.env.WINSTON}>`,
      ],
      throttling: {
        usages: 1,
        duration: 5,
      },
    });
  }

  async run(message, args) {
    
    SendFilter(message, args, "Wasted", "#c93e4e");
  }
};