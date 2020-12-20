const { Command } = require("discord.js-commando");
const { fetchAnimal } = require("./animals.js");

module.exports = class pandaCommand extends (
  Command
) {
  constructor(bot) {
    super(bot, {
      name: "panda",
      group: "animals",
      memberName: "panda",
      description: "get a panda picture or a panda fact with `.panda fact`",
      examples: [".panda", `.panda fact`],
      argsType: "multiple",
    });
  }

  async run(message, args) {
    fetchAnimal(message, args, "panda");
  }
};
