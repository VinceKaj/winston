const { Command } = require("discord.js-commando");
const Discord = require("discord.js");
const ytdl = require("ytdl-core");
const ytSearch = require("yt-search");

module.exports = class DisconnectCommand extends Command {
  constructor(bot) {
    super(bot, {
      name: "disconnect",
      aliases: ['d'],
      group: "music",
      memberName: "stop",
      description: "stop the audio player and disconnect bot from voice channel",
      examples: [".stop"],
      clientPermissions: ["CONNECT", "SPEAK"],
      guildOnly: true,
      argsType: "multiple",
    });
  }

  async run(message, args) {
    const { channel, member, guild, author } = message;
    const voiceChannel = member.voice.channel;

    if (!voiceChannel) {
      channel.send(":x: You need to be in a voice channel to disconnect the bot.");
      return;
    }

    if (cache.queues[guild.id]) cache.queues[guild.id].songs = [];
    cache.queues[guild.id].voiceChannel.leave(); // leave
  }
};
