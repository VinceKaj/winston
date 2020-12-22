const { Command } = require("discord.js-commando");
const Discord = require("discord.js");

module.exports = class PremiumCommand extends (
  Command
) {
  constructor(bot) {
    super(bot, {
      name: "grant-premium",
      group: "moderation",
      memberName: "grant-premium",
      aliases: ["grant-prem"],
      description: "grant a guild premium access",
      ownerOnly: true,
      guildOnly: true,
    });
  }

  async run(message, args) {
    const { author, channel } = message;

    // grant a guild premium
  }
};
