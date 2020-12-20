const { Command } = require("discord.js-commando");
const { fetchAnimal } = require("./animals.js");

module.exports = class KoalaCommand extends (
  Command
) {
  constructor(bot) {
    super(bot, {
      name: "koala",
      group: "animals",
      memberName: "koala",
      description: "get a koala picture or a koala fact with `.koala fact`",
      examples: [".koala", `.koala fact`],
      argsType: "multiple",
    });
  }

  async run(message, args) {
    fetchAnimal(message, args, "koala");
  }
};
