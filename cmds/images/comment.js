const { Command } = require("discord.js-commando");
const Discord = require("discord.js");
const fetch = require("node-fetch");

module.exports = class CommentCommand extends (
  Command
) {
  constructor(bot) {
    super(bot, {
      name: "comment",
      group: "images",
      memberName: "comment",
      format: `[profile picture url], [name], {message}`,
      description: "generate a fake youtube comment",
      examples: [
        `.comment https://cdn.discordapp.com/avatars/786699646114070529/1fcba2b59a6ac726b7dfb59d4bdf155c.png, Winston, who's watching in 2020?`,
      ],
      throttling: {
        usages: 1,
        duration: 5,
      },
    });
  }

  async run(message, args) {
    const { channel, guild, author } = message;

    if (!args) {
      channel.send("Please include a message for the comment.");
      return;
    }

    const split = args.split(", ");
    let name, msg, imgUrl;

    if (split.length == 3) {
      if (!checkURL(split[0])) {
        channel.send("Please include a valid picture url.");
        return;
      }

      imgUrl = split[0];
      name = split[1];
      msg = split[2];
    }
    else if (split.length == 2) {
      if (checkURL(split[0])) {
        imgUrl = split[0];
        name = author.username;
      }
      else {
        name = split[0];
        imgUrl = author.avatarURL( { format: 'png'} );
      }
      msg = split[1];
    }
    else {
      msg = split[0];
      name = author.username;
      imgUrl = author.avatarURL( { format: 'png'} );
    }

    channel.send("", {
      files: [
        `https://some-random-api.ml/canvas/youtube-comment?username=${name}&comment=${msg}&avatar=${imgUrl}`,
      ],
    });
  }
};

function checkURL(url) {
  return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
}