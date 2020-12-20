const { Command } = require("discord.js-commando");
const Discord = require("discord.js");
const fetch = require("node-fetch");

module.exports = class BinaryCommand extends (
  Command
) {
  constructor(bot) {
    super(bot, {
      name: "binary",
      group: "text",
      memberName: "binary",
      description: "encode and decode binary messages",
      examples: [
        "binary {encode/decode} {message}",
        ".binary decode 01101000 01100101 01101100 01101100 01101111",
        ".binary encode hello world!",
      ],
      argsType: "multiple",
    });
  }

  async run(message, args) {
    const { channel, author } = message;

    if (args[0]) {
      let type;

      if (args[0].toLowerCase() == "decode")
        type = ["decode", "text"];
      else if (args[0].toLowerCase() == "encode")
        type = ["text", "binary"];
      else
        return;
      
      if (!args[1]) {
        channel.send("I have nothing to encode or decode.");
        return;
      }

      const input = args.slice(1, args.length).join(" ");

      const result = await fetch(`https://some-random-api.ml/binary?${type[0]}=${input}`, { method: "Get", });
      const json = await result.json();

      const embed = new Discord.MessageEmbed()
        .setColor("#808080")
        .setTitle(`Binary Converter`)
        .addField("Input", input, true)
        .addField("Result", json[type[1]], true)
        .setTimestamp()
        .setFooter(`Requested by ${author.tag}`, author.avatarURL());
      
      channel.send(embed);
      return;
    }
    channel.send("Please specify whether you want to encode or decode.\n`encode {text}`\n`decode {binary}`");
  }
};
