const { Command } = require("discord.js-commando");
const Discord = require("discord.js");
const fetch = require("node-fetch");

module.exports = class JokeCommand extends (
  Command
) {
  constructor(bot) {
    super(bot, {
      name: "joke",
      group: "fun",
      memberName: "joke",
      description: "tells you a joke",
      examples: [".joke"],
    });
  }

  async run(message) {
    const { channel } = message;

    const result = await fetch(`https://some-random-api.ml/joke`, { method: "Get", });
    const json = await result.json();

    channel.send(json.joke);
  }
};
