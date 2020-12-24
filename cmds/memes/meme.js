const { Command } = require("discord.js-commando");
const Discord = require("discord.js");
const fetch = require("node-fetch");

const { SendMeme } = require("./memeFunction");

module.exports = class LyricsCommand extends (
  Command
) {
  constructor(bot) {
    super(bot, {
      name: "meme",
      group: "memes",
      memberName: "meme",
      description: "get the latest, most popular memes",
      throttling: {
        usages: 1,
        duration: 10,
      },
    });
  }

  async run(message, args) {
    SendMeme(message, args, "memes");
  }
};