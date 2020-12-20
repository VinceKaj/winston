const { Command } = require("discord.js-commando");
const { fetchAnimal } = require("./animals.js");

module.exports = class DogCommand extends Command {
  constructor(bot) {
    super(bot, {
      name: "dog",
      group: "animals",
      memberName: "dog",
      description: "get a dog picture or a dog fact with `.dog fact`",
      examples: [".dog", `.dog fact`],
      argsType: "multiple",
    });
  }

  async run(message, args) {
    fetchAnimal(message, args, "dog");
  }
}
