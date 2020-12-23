const { Command } = require("discord.js-commando");
const Discord = require("discord.js");

const { SendMeme } = require("./memeFunction");

module.exports = class LyricsCommand extends (
  Command
) {
  constructor(bot) {
    super(bot, {
      name: "dank-meme",
      group: "memes",
      memberName: "dank-meme",
      format: "[sort by]",
      aliases: ["dankmeme"],
      examples: [".dankmeme", ".dankmeme hot"],
      description: "get a top post from r/dankmemes",
      throttling: {
        usages: 1,
        duration: 10,
      },
    });
  }

  async run(message, args) {
    
    SendMeme(message, args, "dankmemes");

  }
};