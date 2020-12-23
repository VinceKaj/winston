const { Command } = require("discord.js-commando");
const Discord = require("discord.js");
const fetch = require("node-fetch");

module.exports = class AvatarCommand extends (
  Command
) {
  constructor(bot) {
    super(bot, {
      name: "wasted",
      group: "images",
      memberName: "wasted",
      format: `[image url]`,
      description: "adds wasted filter to image",
      examples: [
        `.wasted https://assets.bonappetit.com/photos/5c62e4a3e81bbf522a9579ce/1:1/w_2560%2Cc_limit/milk-bread.jpg`,
      ],
      throttling: {
        usages: 1,
        duration: 5,
      },
    });
  }

  async run(message, args) {
    const { channel, guild, author, attachments } = message;

    const msg = await channel.send("Loading filter...");

    let url;

    if (!args || !checkURL(args)) {
      if (attachments.array()[0]) {
        const attachArr = attachments.array();
        url = attachArr[0].url;
      } else url = author.avatarURL({ format: "png" });
    } else {
      url = args;
    }

    const embed = new Discord.MessageEmbed()
      .setColor("#c93e4e")
      .setTitle("Wasted Filter")
      .setImage(`https://some-random-api.ml/canvas/wasted?avatar=${url}`)
      .setTimestamp()
      .setFooter(`Requested by ${author.tag}`, author.avatarURL());

    msg.edit("Result:", embed);
  }
};

function checkURL(url) {
  return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
}
