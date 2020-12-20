const { Command } = require("discord.js-commando");
const { fetchAnimal } = require("./animals.js");

module.exports = class birdCommand extends (
  Command
) {
  constructor(bot) {
    super(bot, {
      name: "bird",
      group: "animals",
      memberName: "bird",
      description: "get a bird picture or a bird fact with `.bird fact`",
      examples: [".bird", `.bird fact`],
      argsType: "multiple",
    });
  }

  async run(message, args) {
    fetchAnimal(message, args, "birb");
  }
};
