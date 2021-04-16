const { Command } = require("discord.js-commando");
const Discord = require("discord.js");
const ytdl = require("ytdl-core");
const ytSearch = require("yt-search");

module.exports = class SkipCommand extends Command {
  constructor(bot) {
    super(bot, {
      name: "skip",
      group: "music",
      memberName: "skip",
      aliases: ["s"],
      description: "skip the currently playing song",
      examples: [
        ".skip",
      ],
      clientPermissions: ["CONNECT", "SPEAK"],
      guildOnly: true,
    });
  }

  async run(message, args) {
    const { channel, member, guild, author } = message;
    const voiceChannel = member.voice.channel;

    if (!voiceChannel) {
      channel.send(":x: You need to be in a voice channel to skip music.");
      return;
    }

    if (!cache.queues[guild.id]) { // no queue

      const embed = new Discord.MessageEmbed()
        .setDescription("There are no songs in the queue.")
        .setColor("#6a0dad");
      channel.send(embed);

      cache.queues[guild.id].connection.dispatcher.end(); // ends song, beginning next one.
    }
  }
};
