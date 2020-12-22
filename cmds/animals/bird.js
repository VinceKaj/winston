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
      format: `["fact"]`,
      description: "get a bird picture or a bird fact with `.bird fact`",
      examples: [".bird", `.bird fact`],
    });
  }

  async run(message, args) {
    fetchAnimal(message, args, "birb");
  }
};
