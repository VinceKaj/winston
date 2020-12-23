const { Command } = require("discord.js-commando");
const Discord = require("discord.js");
const fetch = require("node-fetch");

module.exports = class BinaryCommand extends (
  Command
) {
  constructor(bot) {
    super(bot, {
      name: "rgb",
      group: "text",
      memberName: "rgb",
      description: "converts hex value to an rgb color",
      format: `{#code}`,
      examples: [
        ".rgb #c8c8c8",
        ".rgb #ff0000",
      ],
    });
  }

  async run(message, args) {
    const { channel, author } = message;

    if (args && args.startsWith("#"))
      args = args.slice(1, args.length);

    if (!args || args.length != 6) {
      channel.send("Please give me a hex value of 6 characters.");
      return;
    }

    const msg = await channel.send("Loading result...");

    const result = await fetch(
      `https://some-random-api.ml/canvas/rgb?hex=${args}`,
    );
    const json = await result.json();

    const embed = new Discord.MessageEmbed()
      .setColor(`#${args}`)
      .setTitle(`RGB Converter`)
      .addField("Input", `Hex: #${args}`, true)
      .addField("Result", `rgb(${json.r}, ${json.g}, ${json.b})`, true)
      .setTimestamp()
      .setFooter(`Requested by ${author.tag}`, author.avatarURL());

    msg.edit('Result:', embed);
  }
};
