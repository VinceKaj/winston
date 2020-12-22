const { Command } = require("discord.js-commando");
const Discord = require("discord.js");
const fetch = require("node-fetch");

const quoteFile = require("./quote-responses");

module.exports = class BinaryCommand extends (
  Command
) {
  constructor(bot) {
    super(bot, {
      name: "quote",
      group: "fun",
      memberName: "quote",
      description: "get a random famous quote",
      examples: [".quote"],
    });
  }

  async run(message) {
    const { channel } = message;

    const index = Math.floor(Math.random() * quoteFile.quotes.length);
    const quote = quoteFile.quotes[index];

    channel.send(`"${quote.text}"\n-${quote.author}`);
  }
};
