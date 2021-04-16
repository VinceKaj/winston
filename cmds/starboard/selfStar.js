const { Command } = require("discord.js-commando");
const Discord = require("discord.js");
const starboardSchema = require("../../schemas/starboard-schema");
const mongo = require("./../../mongo");

const selfStarFunction = require("./selfStarFunction");

module.exports = class SelfStarCommand extends (
  Command
) {
  constructor(bot) {
    super(bot, {
      name: "starboard self-star",
      group: "starboard",
      memberName: "starboard-selfstar",
      description:
        "Change whether users can add stars to their own messages (write `default` for default value)",
      alias: ["sb-selfstar", "starboard-self-star"],
      examples: [
        `.starboard-selfstar default`,
        ".starboard-selfstar true",
      ],
      userPermissions: ["MANAGE_GUILD"],
      guildOnly: true,
    });
  }

  async run(message, args) {
    selfStarFunction.SelfStar(message, args);
  }
};
