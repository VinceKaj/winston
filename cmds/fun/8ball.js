const { Command } = require("discord.js-commando");
const Discord = require("discord.js");
const fetch = require("node-fetch");

const responses = [
  "It is certain",
  "Without a doubt",
  "You may rely on it",
  "Yes definitely",
  "It is decidedly so",
  "As I see it, yes",
  "Most likely",
  "Yes",
  "Outlook good",
  "Signs point to yes",
  "Reply hazy try again",
  "Better not tell you now",
  "Ask again later",
  "Cannot predict now",
  "Concentrate and ask again",
  "Don't count on it",
  "Outlook not so good",
  "My sources say no",
  "Very doubtful",
  "My reply is no",
];

module.exports = class BinaryCommand extends (
  Command
) {
  constructor(bot) {
    super(bot, {
      name: "8ball",
      group: "fun",
      memberName: "8ball",
      description: "ask magic 8ball a question",
      examples: ["8ball {question}", ".8ball is Winston the best bot?"],
    });
  }

  

  async run(message) {
    const { channel } = message;

    const index = Math.floor(Math.random() * responses.length);
    channel.send(responses[index]);
  }
};
