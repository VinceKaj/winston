const { Command } = require("discord.js-commando");
const Discord = require("discord.js");

module.exports = class HeadCommand extends (
  Command
) {
  constructor(bot) {
    super(bot, {
      name: "head",
      group: "images",
      memberName: "head",
      format: `{in-game name}`,
      description: "get a 3D head model of a Minecraft avatar",
      examples: [
        `.head VinceKaj`,
        `.head Notch`,
      ],
      throttling: {
        usages: 1,
        duration: 5,
      },
    });
  }

  async run(message, args) {
    if (!args) {
      message.channel.send("Invalid minecraft username or uuid.");
    } else {
      message.chanel.send(`http://cravatar.eu/helmhead/${args}/512.png`);
    }
  }
};
