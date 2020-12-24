const { Command } = require("discord.js-commando");
const Discord = require("discord.js");
const fetch = require("node-fetch");

const subreddits = [
  "memes",
  "dankmemes",
  "funny"
];

async function SendMeme(message, args, subreddit) {
  const { author, channel } = message;

    const msg = await channel.send("Loading meme...");

    if (subreddit == "memes")
      subreddit = subreddits[Math.floor(Math.random() * subreddits.length)];

    let res, json;

    while (!json) { // fix url checker
      res = await fetch(
        `https://api.reddit.com/r/${subreddit}/top.json?sort=top&t=now&limit=100`
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

module.exports = { SendMeme };