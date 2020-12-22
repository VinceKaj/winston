const { Command } = require("discord.js-commando");
const Discord = require("discord.js");

module.exports = class CoinCommand extends (
  Command
) {
  constructor(bot) {
    super(bot, {
      name: "coinflip",
      group: "utility",
      memberName: "coinflip",
      description: "flip a coin (`cf` also works)",
      examples: ["coinlfip", "cf"],
      aliases: ["cf"],
    });
  }

  async run(message) {

    const heads = Math.floor(Math.random() * 2);
    const res = heads ? "heads" : "tails";

    message.channel.send(`It's ${res}. :coin:`);
  }
};
