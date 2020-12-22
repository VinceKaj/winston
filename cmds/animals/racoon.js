const { Command } = require("discord.js-commando");
const { fetchAnimal } = require("./animals.js");

module.exports = class racoonCommand extends (
  Command
) {
  constructor(bot) {
    super(bot, {
      name: "racoon",
      group: "animals",
      memberName: "racoon",
      description: "get a racoon picture or a racoon fact with `.racoon fact`",
      examples: [".racoon", `.racoon fact`],
    });
  }

  async run(message, args) {
    fetchAnimal(message, fact, "racoon");
  }
};
