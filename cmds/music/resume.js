const { Command } = require("discord.js-commando");
const Discord = require("discord.js");
const ytdl = require("ytdl-core");
const ytSearch = require("yt-search");

module.exports = class ResumeCommand extends Command {
  constructor(bot) {
    super(bot, {
      name: "resume",
      group: "resume",
      memberName: "pause",
      description: "resume the audio player",
      examples: [".resume"],
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

    cache.queues[guild.id].connection.dispatcher.resume();

    const embed = new Discord.MessageEmbed()
      .setDescription(
        `:play_pause: <@${author.id}> has resumed the music player.`
      )
      .setColor("6a0dad");
    channel.send(embed);
  }
};
