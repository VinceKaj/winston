const { Command } = require("discord.js-commando");
const Discord = require("discord.js");
const fetch = require("node-fetch");

module.exports = class FoxPicture extends (
  Command
) {
  constructor(bot) {
    super(bot, {
      name: "fox",
      group: "animals",
      memberName: "fox",
      description: "get a fox picture",
      examples: [".fox"],
    });
  }

  async run(message) {
    const msg = await message.channel.send("Loading your fox picture...");
    const result = await fetch("https://randomfox.ca/floof/?ref=apilist.fun");
    const json = await result.json();

    message.channel.send('', { files: [json.image]}).then(() => {msg.delete()});
  }
};
