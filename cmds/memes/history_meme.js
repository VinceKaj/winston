const { Command } = require("discord.js-commando");
const Discord = require("discord.js");

const { SendMeme } = require("./memeFunction");

module.exports = class HistoryMemeCommand extends (
  Command
) {
  constructor(bot) {
    super(bot, {
      name: "history-meme",
      group: "memes",
      memberName: "history-meme",
      aliases: ["history_meme", "historymeme"],
      description: "get a top post from r/HistoryMemes",
      throttling: {
        usages: 1,
        duration: 10,
      },
    });
  }

  async run(message, args) {

    SendMeme(message, args, "HistoryMemes");

  }
};