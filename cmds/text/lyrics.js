const { Command } = require("discord.js-commando");
const Discord = require("discord.js");
const fetch = require("node-fetch");

module.exports = class LyricsCommand extends (
  Command
) {
  constructor(bot) {
    super(bot, {
      name: "lyrics",
      group: "text",
      memberName: "lyrics",
      description: "get the lyrics of a song by name",
      examples: [
        "lyrics [author] {song name}",
        ".lyrics lose yourself eminem",
        ".lyrics pharrell williams happy",
      ],
    });
  }

  async run(message, args) {
    const { channel, author} = message;

    if (args) {
      const result = await fetch(`https://some-random-api.ml/lyrics?title=${args}`, { method: "Get", });
      const json = await result.json();

      if (json.title) { // not undefined

        if (json.lyrics.length > 2048)
          json.lyrics = json.lyrics.substr(0, 2045) + "...";


        const embed = new Discord.MessageEmbed()
          .setColor("#6a0dad")
          .setTitle(`${json.author} - ${json.title}`)
          .setURL(json.links.genius)
          .setDescription(json.lyrics)
          .setTimestamp()
          .setFooter(`Requested by ${author.tag}`, author.avatarURL());

        channel.send(embed);
        return;
      }
    }

    channel.send("I could not find that song's lyrics.");
  }
};
