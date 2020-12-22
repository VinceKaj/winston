const { Command } = require("discord.js-commando");
const { fetchAnimal } = require("./animals.js");

module.exports = class catCommand extends (
  Command
) {
  constructor(bot) {
    super(bot, {
      name: "cat",
      group: "animals",
      memberName: "cat",
      description: "get a cat picture or a cat fact with `.cat fact`",
      examples: [".cat", `.cat fact`],
    });
  }

  async run(message, args) {
    fetchAnimal(message, fact, "cat");
  }
};
