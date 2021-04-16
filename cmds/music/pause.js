const { Command } = require("discord.js-commando");
const Discord = require("discord.js");
const ytdl = require("ytdl-core");
const ytSearch = require("yt-search");

module.exports = class PauseCommand extends Command {
  constructor(bot) {
    super(bot, {
      name: "pause",
      aliases: ["stop"],
      group: "music",
      memberName: "pause",
      description: "pause the audio player",
      examples: [".pause", ".stop"],
      clientPermissions: ["CONNECT", "SPEAK"],
      guildOnly: true,
    });
  }

  async run(message, args) {
    const { channel, member, guild, author } = message;
    const voiceChannel = member.voice.channel;

    if (!voiceChannel) {
      channel.send(":x: You need to be in a voice channel to stop music.");
      return;
    }

    cache.queues[guild.id].connection.dispatcher.pause(true);

    const embed = new Discord.MessageEmbed().setDescription(`:pause_button: <@${author.id}> has paused the music player.`).setColor("6a0dad");
    channel.send(embed);
  }
};
