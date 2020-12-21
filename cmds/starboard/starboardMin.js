const { Command } = require("discord.js-commando");
const Discord = require("discord.js");
const starboardSchema = require("../../schemas/starboard-schema");
const mongo = require("./../../mongo");

const starboardMinFunction = require("./starboardMinFunction");

module.exports = class WelcomeCommand extends (
  Command
) {
  constructor(bot) {
    super(bot, {
      name: "starboard min",
      group: "starboard",
      memberName: "starboard-min",
      description:
        "Change how many :star: needed for message to go to starboard (write default for default value)",
      examples: [
        "starboard-min {integer}",
        `.starboard-min default`,
        ".starboard-min 5",
      ],
      userPermissions: ["MANAGE_GUILD"],
      guildOnly: true,
    });
  }

  async run(message, args) {
    starboardSchema.Min(message, args);
  }
};
