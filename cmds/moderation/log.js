const { Command } = require("discord.js-commando");
const Discord = require("discord.js");

module.exports = class PremiumCommand extends (
  Command
) {
  constructor(bot) {
    super(bot, {
      name: "log",
      group: "moderation",
      memberName: "log",
      description: "send the message content",
      ownerOnly: true,
    });
  }

  async run(message, args) {
    const { author, channel, content } = message;

    channel.send(`\`${content}\``);
  }
};
