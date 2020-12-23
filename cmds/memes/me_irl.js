const { Command } = require("discord.js-commando");
const Discord = require("discord.js");

const { SendMeme } = require("./memeFunction");

module.exports = class LyricsCommand extends (
  Command
) {
  constructor(bot) {
    super(bot, {
      name: "me_irl",
      group: "memes",
      memberName: "me_irl",
      format: "[category]",
      aliases: ["meirl", "me-irl"],
      examples: [".me_irl", ".me_irl hot"],
      description: "get a top post from r/me_irl",
      throttling: {
        usages: 1,
        duration: 10,
      },
    });
  }

  async run(message, args) {

    SendMeme(message, args, "me_irl");

  }
};