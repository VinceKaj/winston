const { Command } = require("discord.js-commando");
const Discord = require("discord.js");
const fetch = require("node-fetch");

const { SendFilter } = require("./filterFuntion");

module.exports = class AvatarCommand extends (
  Command
) {
  constructor(bot) {
    super(bot, {
      name: "rainbow",
      group: "images",
      memberName: "rainbow",
      guildOnly: true,
      format: `[image url or @user] `,
      aliases: ["gay"],
      description: "adds rainbow filter to image",
      examples: [
        `.rainbow https://assets.bonappetit.com/photos/5c62e4a3e81bbf522a9579ce/1:1/w_2560%2Cc_limit/milk-bread.jpg`,
        `.rainbow <@${process.env.WINSTON}>`,
      ],
      throttling: {
        usages: 1,
        duration: 5,
      },
    });
  }

  async run(message, args) {

    SendFilter(message, args, "Gay", "#00ffff");

  }
};