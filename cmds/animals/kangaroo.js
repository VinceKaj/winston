const { Command } = require("discord.js-commando");
const { fetchAnimal } = require("./animals.js");

module.exports = class KangarooCommand extends (
  Command
) {
  constructor(bot) {
    super(bot, {
      name: "kangaroo",
      group: "animals",
      memberName: "kangaroo",
      description: "get a kangaroo picture or a kangaroo fact with `.kangaroo fact`",
      examples: [".kangaroo", `.kangaroo fact`],
      argsType: "multiple",
    });
  }

  async run(message, args) {
    fetchAnimal(message, args, "kangaroo");
  }
};
