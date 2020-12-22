const { Command } = require("discord.js-commando");
const { fetchAnimal } = require("./animals.js");

module.exports = class koalaCommand extends (
  Command
) {
  constructor(bot) {
    super(bot, {
      name: "koala",
      group: "animals",
      memberName: "koala",
      format: `["fact"]`,
      description: "get a koala picture or a koala fact with `.koala fact`",
      examples: [".koala", `.koala fact`],
    });
  }

  async run(message, args) {
    fetchAnimal(message, args, "koala");
  }
};
