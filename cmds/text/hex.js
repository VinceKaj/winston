const { Command } = require("discord.js-commando");
const Discord = require("discord.js");
const fetch = require("node-fetch");

module.exports = class HexCommand extends (
  Command
) {
  constructor(bot) {
    super(bot, {
      name: "hex",
      group: "text",
      memberName: "hex",
      description: "converts rgb values to a hex color",
      format: `[red] [green] [blue]`,
      examples: [".hex 217 101 104", ".hex 200 200 200"],
    });
  }

  async run(message, args) {
    const { channel, author } = message;

    if (!args) {
      channel.send("Please give me at least one rgb value");
      return;
    }

    args = args.replace(/[, ]+/g, " ").trim();

    if (args.length == 3)
      args = [args, args, args];
    else if (args.length == 7)
      args = [...args.split(" "), "0"];
    else if (args.length == 11)
      args = args.split(" ");
    else {
      channel.send("Please give valid rgb values");
      return;
    }

    const msg = await channel.send("Loading result...");

    const result = await fetch(`https://some-random-api.ml/canvas/hex?rgb=${args.join(",")}`);
    const json = await result.json();

    const embed = new Discord.MessageEmbed()
      .setColor(`${json.hex}`)
      .setTitle(`Hex Converter`)
      .addField("Input", `rgb(${args.join(", ")})`, true)
      .addField("Result", `Hex: ${json.hex}`, true)
      .setTimestamp()
      .setFooter(`Requested by ${author.tag}`, author.avatarURL());

    msg.edit("Result:", embed);
  }
};
