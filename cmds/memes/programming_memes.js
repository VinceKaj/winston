const { Command } = require("discord.js-commando");
const Discord = require("discord.js");

const { SendMeme } = require("./memeFunction");

module.exports = class LyricsCommand extends (
  Command
) {
  constructor(bot) {
    super(bot, {
      name: "coding-meme",
      group: "memes",
      format: "[sort by]",
      examples: [".meme", ".meme hot"],
      aliases: ["codingmeme", "programmingmeme", "programming-meme"],
      memberName: "coding-meme",
      description: "get a top post from r/ProgrammerHumor",
      throttling: {
        usages: 1,
        duration: 10,
      },
    });
  }

  async run(message, args) {

    SendMemes(message, args, "ProgrammerHumor");

  }
};
