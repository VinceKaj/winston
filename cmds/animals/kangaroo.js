const { Command } = require("discord.js-commando");
const { fetchAnimal } = require("./animals.js");

module.exports = class kangarooCommand extends (
  Command
) {
  constructor(bot) {
    super(bot, {
      name: "kangaroo",
      group: "animals",
      memberName: "kangaroo",
      format: `["fact"]`,
      description:
        "get a kangaroo picture or a kangaroo fact with `.kangaroo fact`",
      examples: [".kangaroo", `.kangaroo fact`],
    });
  }

  async run(message, args) {
    fetchAnimal(message, args, "kangaroo");
  }
};
