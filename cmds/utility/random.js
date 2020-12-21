const { Command } = require("discord.js-commando");
const Discord = require("discord.js");

module.exports = class RandomCommand extends (
  Command
) {
  constructor(bot) {
    super(bot, {
      name: "random",
      group: "utility",
      memberName: "random",
      description: "generate a random number or choose an option out of given ones",
      examples: ["random 1-100", "random apple, banana, pear, orange"],
      aliases: ["r", "random", "rand"],
      argsType: "multiple"
    });
  }

  async run(message, args) {
    const { channel } = message;

    if (!args[0]) {
      channel.send("Please give me a range or options to choose from.");
      return;
    }

    if (!isNaN(args[0][0])) {
      const split = args[0].split("-");
      if (split.length > 1) {
        const res = (split[0] < split[1] ? Rand(split[0], split[1]) : Rand(split[1], split[0]));

        channel.send(`I generated ${res} :game_die:`);
        return;
      }
    }

    args = args.join(" ").replace(/[, ]+/g, " ").trim().split(" ");
    const index = Math.floor(Math.random() * args.length);
    channel.send(`I choose **${args[index]}** :game_die:`);
  }
};

function Rand(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max) + 1;
  return Math.floor(Math.random() * (max - min) + min);
}