const { Command } = require("discord.js-commando");
const { fetchAnimal } = require("./animals.js");

module.exports = class dogCommand extends (
  Command
) {
  constructor(bot) {
    super(bot, {
      name: "dog",
      group: "animals",
      memberName: "dog",
      format: `["fact"]`,
      description: "get a dog picture or a dog fact with `.dog fact`",
      examples: [".dog", `.dog fact`],
    });
  }

  async run(message, args) {
    fetchAnimal(message, args, "dog");
  }
};
