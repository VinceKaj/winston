const { Command } = require("discord.js-commando");
const Discord = require("discord.js");
const fetch = require("node-fetch");

module.exports = class WolframCommand extends (
  Command
) {
  constructor(bot) {
    super(bot, {
      name: "wolfram",
      group: "utility",
      memberName: "wolfram",
      format: `{query}`,
      description: "search something in Wolfram Alpha",
      aliases: ["wa", "wolf"],
      examples: [
        ".wolfram graph 2y=3x+7",
      ],
      // throttling: {
      //   usages: 1,
      //   duration: 10,
      // },
    });
  }

  async run(message, args) {
    const { channel, author, guild } = message;

    const embed = new Discord.MessageEmbed()
      .setColor("#FF4500")
      .setTitle(`Wolfram Alpha Temporarily Unavailable`)
      .setDescription(`Sorry, I currently cannot send Wolfram Results.\n[Here's a link to your search](https://www.wolframalpha.com/input/?i=${encodeURIComponent(args)})`)
      .setTimestamp()
      .setFooter(`Requested by ${author.tag}`, author.avatarURL());

    channel.send(embed);
  }
};
