
const { Command } = require("discord.js-commando");
const Discord = require("discord.js");
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

module.exports = class PlayCommand extends Command {
  constructor(bot) {
    super(bot, {
      name: "play",
      group: "music",
      memberName: "play",
      aliases: ['p'],
      format: `{song name}`,
      description: "play a song in a voice channel",
      examples: [
        ".play adele hello",
        ".play why'd you only call me when you're high",
      ],
      throttling: {
        usages: 1,
        duration: 10,
      },
      clientPermissions: ["CONNECT", "SPEAK"],
      guildOnly: true,
      argsType: 'multiple'
    });
  }

  async run(message, args) {
    const { channel, member, guild, author } = message;
    const voiceChannel = member.voice.channel;

    if (!voiceChannel) {
      channel.send(":x: You need to be in a voice channel to play music.");
      return;
    }

    if (!args[0]) {
      if (cache.queues[guild.id]) { // resume function
        cache.queues[guild.id].connection.dispatcher.resume();

        const embed = new Discord.MessageEmbed()
          .setDescription(
            `:play_pause: <@${author.id}> has resumed the music player.`
          )
          .setColor("6a0dad");
        channel.send(embed);
        return;
      }
    }

    let song = {};

    if (ytdl.validateURL(args[0])) { // args are a url
      const songInfo = await ytdl.getInfo(args[0]);
      song = { title: songInfo.videoDetails.title, url: songInfo.videoDetails.video_url };
    } else {

      const videoFinder = async (query) => {
        const videoResult = await ytSearch(query);
        return (videoResult.videos.length) ? videoResult.videos[0] : null;
      }

      const video = await videoFinder(args.join(' '));
      if (video) { // found a video
        song = { title: video.title, url: video.url };
      } else {
        channel.send(":x: Couldn't find a song matching that query.");
      }
    }

    if (!cache.queues[guild.id]) { // server has no queue
      cache.queues[guild.id] = {
        voiceChannel: voiceChannel,
        textChannel: channel,
        connection: null,
        songs: []
      };

      cache.queues[guild.id].songs.push(song);

      try {
        const embed = new Discord.MessageEmbed().setTitle(`:speaker: Joining \`${voiceChannel.name}\``).setColor("#6a0dad");
        channel.send(embed);

        const connection = await voiceChannel.join();
        cache.queues[guild.id].connection = connection;
        songPlayer(message, cache.queues[guild.id].songs[0]);
      } catch (err) {
        delete cache.queues[guild.id];
        channel.send(":x: There was an error connecting.");
        throw err;
      }
    } else { // server already has queue (already in vchannel)
      cache.queues[guild.id].songs.push(song);
      
      const embed = new Discord.MessageEmbed().setDescription(`<@${author.id}> added **[${song.title}](${song.url})** to queue.`).setColor("#6a0dad");
      channel.send(embed);
    }
  }
};

const songPlayer = async (message, song) => {
  const { guild, channel, author } = message;

  console.log(song.title);

  if (!song) {
    // no song given
    console.log("no song?");
    cache.queues[guild.id].voiceChannel.leave(); // leave
    delete cache.queues[guild.id]; // delete server queue
    return;
  }
  console.log("yes song.");
  const stream = ytdl(song.url, { filter: "audioonly" }); // fetch stream of song (audio only)
  console.log("we got a stream");

  const embed = new Discord.MessageEmbed()
    .setDescription(
      `:notes: Playing **[${song.title}](${song.url})** in \`${
        cache.queues[guild.id].voiceChannel.name
      }\` as requested by <@${author.id}>.`
    )
    .setColor("#6a0dad");
  channel.send(embed);

  cache.queues[guild.id].connection
    .play(stream, { seek: 0, volume: 0.5 }) // play song
    .on("finish", () => {
      cache.queues[guild.id].songs.shift();
      songPlayer(guild, cache.queues[guild.id].songs[0]); // loop function until runs out of songs
    });
};