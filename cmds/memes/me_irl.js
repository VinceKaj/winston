const { Command } = require("discord.js-commando");
const Discord = require("discord.js");
const fetch = require("node-fetch");

module.exports = class LyricsCommand extends (
  Command
) {
  constructor(bot) {
    super(bot, {
      name: "me_irl",
      group: "memes",
      memberName: "me_irl",
      format: "[category]",
      aliases: ["meirl", "me-irl"],
      examples: [".me_irl", ".me_irl hot"],
      description: "get a top post from r/me_irl",
      throttling: {
        usages: 1,
        duration: 10,
      },
    });
  }

  async run(message, args) {
    const { author, channel, guild } = message;

    const msg = await channel.send("Loading me_irl meme...");

    args = args.toLowerCase();

    let category = "top";
    if (args == "hot" || args == "new") {
      category = args;
    }

    let res, json;

    while (!json) { // fix URL checker
      res = await fetch(
        `https://api.reddit.com/r/me_irl/${category}.json?sort=top&t=day&limit=500`
      );
      const arr = (await res.json()).data.children;
      json = arr[Math.floor(Math.random() * arr.length)].data;
    }

    const embed = new Discord.MessageEmbed()
      .setColor("#ff4500")
      .setTitle(json.title)
      .setURL(`https://reddit.com${json.permalink}`)
      .setDescription(
        `:arrow_up: ${json.ups} | :speech_balloon: ${json.num_comments}`
      )
      .setImage(json.url)
      .setTimestamp()
      .setFooter(`Requested by ${author.tag}`, author.avatarURL());

    channel.send(embed).then(() => {
      msg.delete();
    });
  }
};