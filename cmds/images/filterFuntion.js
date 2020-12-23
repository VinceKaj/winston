const { Command } = require("discord.js-commando");
const Discord = require("discord.js");
const fetch = require("node-fetch");

async function SendFilter(message, args, filter, color) {
  const { channel, guild, author, attachments } = message;

  const msg = await channel.send("Loading filter...");

  let url;
  let member;

  if (args && args.startsWith("<@") && args.endsWith(">")) {
    // is a mention
    let target = args.slice(2, -1);

    if (target.startsWith("!")) target = target.slice(1);

    member = guild.members.cache.get(target); // set user target as ID
  }

  if (!args || !checkURL(args)) {
    if (member) {
      url = member.user.avatarURL({ format: "png" });
    } else if (attachments.array()[0]) {
      const attachArr = attachments.array();
      url = attachArr[0].url;
    } else url = author.avatarURL({ format: "png" });
  } else {
    url = args;
  }

  const embed = new Discord.MessageEmbed()
    .setColor(color)
    .setTitle(`${filter} Filter`)
    .setImage(`https://some-random-api.ml/canvas/${filter}?avatar=${url}`)
    .setTimestamp()
    .setFooter(`Requested by ${author.tag}`, author.avatarURL());

  msg.edit("Result:", embed);
}

function checkURL(url) {
  return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
}


module.exports = { SendFilter };